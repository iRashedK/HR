import os
import json
import logging
import requests
from functools import lru_cache
import time
import re

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = os.getenv(
    "OPENROUTER_URL", "https://openrouter.ai/api/v1/chat/completions"
)
OPENROUTER_MODELS_URL = os.getenv(
    "OPENROUTER_MODELS_URL", "https://openrouter.ai/api/v1/models"
)
ANALYSIS_LANGUAGE = os.getenv("USED_LANGUAGE", "Arabic")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

PROMPT_TEMPLATE = (
    """You are an HR assistant. For the following employee data, recommend important\n"
    "certifications and courses that will improve the employee's career.\n"
    "Return at least five certifications and five courses.\n"
    "Provide the response in {lang} only. The output must be strictly one JSON object\n"
    "with the following format. Mention the certification or course names within the\n"
    "roadmap steps so they can be matched visually so our UI can sort them:\n"
    "{{\n"
    "  \"certifications\": [ {{\"name\":..., \"link\":..., \"price\":... }} ],\n"
    "  \"courses\": [ {{\"name\":..., \"link\":..., \"price\":... }} ],\n"
    "  \"roadmap\": [ \"step 1 mentions PMP\", \"step 2 mentions course name\", ... ]\n"
    "}}\n"
    "Return only this JSON object and nothing else."""
)


@lru_cache(maxsize=1)
def fetch_available_models() -> list:
    """Return a list of model IDs supported by OpenRouter."""
    try:
        resp = requests.get(OPENROUTER_MODELS_URL, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        models = [m.get("id") for m in data.get("data", []) if m.get("id")]
        if models:
            logger.info("Available OpenRouter models: %s", ", ".join(models))
            return models
    except Exception as exc:
        logger.error("Failed to fetch models list: %s", exc)
    # fallback to a minimal list
    return ["deepseek/deepseek-r1-0528:free", "openai/gpt-3.5-turbo"]



def choose_model() -> str:
    """Return a valid model ID, falling back to a free one if needed."""
    env_model = os.getenv("OPENROUTER_ANALYSIS_MODEL", "deepseek/deepseek-r1-0528:free")
    available = fetch_available_models()
    if env_model and env_model in available:
        return env_model

    # prefer well-known free models
    for default in ["deepseek/deepseek-r1-0528:free", "openai/gpt-3.5-turbo"]:
        if default in available:
            if env_model and env_model not in available:
                logger.warning(
                    "Model %s is invalid; falling back to %s", env_model, default
                )
            return default

    if available:
        logger.warning(
            "No preferred free model available; using %s", available[0]
        )
        return available[0]

    # as last resort return env model or default string
    return env_model or "openai/gpt-3.5-turbo"


def extract_json_objects(text: str) -> list:
    """Return all JSON objects found in the response text."""
    objs = []
    stack = []
    start = None
    for i, ch in enumerate(text):
        if ch == "{":
            if not stack:
                start = i
            stack.append(ch)
        elif ch == "}":
            if stack:
                stack.pop()
                if not stack and start is not None:
                    snippet = text[start : i + 1]
                    try:
                        objs.append(json.loads(snippet))
                    except json.JSONDecodeError:
                        pass
    return objs


def merge_json_results(objs: list) -> dict:
    """Merge multiple recommendation JSON objects, avoiding duplicates."""
    merged = {"certifications": [], "courses": [], "roadmap": []}
    for obj in objs:
        for key in ("certifications", "courses"):
            for item in obj.get(key, []):
                if item and item not in merged[key]:
                    merged[key].append(item)
        for step in obj.get("roadmap", []):
            if step and step not in merged["roadmap"]:
                merged["roadmap"].append(step)
    return merged


def generate_recommendations(employee: dict):
    if not OPENROUTER_API_KEY:
        return {
            "error": "OPENROUTER_API_KEY not configured",
            "prompt": employee
        }
    model = choose_model()

    messages = [
        {"role": "system", "content": PROMPT_TEMPLATE.format(lang=ANALYSIS_LANGUAGE)},
        {"role": "user", "content": str(employee)},
    ]
    payload = {
        "model": model,
        "messages": messages,
    }
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }
    timeout = int(os.getenv("OPENROUTER_TIMEOUT", "60"))
    retries = int(os.getenv("OPENROUTER_RETRIES", "2"))
    logger.info("Sending payload for %s: %s", employee.get("name"), json.dumps(payload, ensure_ascii=False))
    try:
        attempt = 0
        while True:
            resp = requests.post(OPENROUTER_URL, json=payload, headers=headers, timeout=timeout)
            logger.info("OpenRouter response text for %s: %s", employee.get("name"), resp.text)
            if resp.status_code == 200:
                break
            try:
                err = resp.json().get("error", {}).get("message", resp.text)
            except Exception:
                err = resp.text
            logger.error("OpenRouter returned %s: %s", resp.status_code, err)
            if "not a valid model" in err.lower() and payload["model"] != "openai/gpt-3.5-turbo":
                payload["model"] = "openai/gpt-3.5-turbo"
                logger.info("Retrying with fallback model openai/gpt-3.5-turbo")
            else:
                attempt += 1
                if attempt > retries:
                    return {"error": err}
                logger.info("Retrying request (%s/%s)", attempt, retries)
                time.sleep(2)
                continue

        try:
            data = resp.json()
        except ValueError:
            logger.error("Invalid JSON from OpenRouter: %s", resp.text)
            return {"error": resp.text.strip()}
        logger.debug("OpenRouter raw response: %s", data)
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        logger.info("OpenRouter content for %s: %s", employee.get("name"), content)
        objs = extract_json_objects(content)
        if not objs and content.strip().startswith('{'):
            try:
                objs = [json.loads(content.strip())]
            except Exception:
                pass
        if not objs:
            return {"raw": content}
        result = objs[0] if len(objs) == 1 else merge_json_results(objs)
        logger.info("Parsed recommendations for %s: %s", employee.get("name"), json.dumps(result, ensure_ascii=False))
        return result
    except Exception as e:
        logger.error("Error from OpenRouter for %s: %s", employee.get("name"), e)
        return {"error": str(e)}
