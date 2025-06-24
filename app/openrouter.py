import os
import json
import logging
import requests
from functools import lru_cache
import re

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = os.getenv(
    "OPENROUTER_URL", "https://openrouter.ai/api/v1/chat/completions"
)
OPENROUTER_MODELS_URL = os.getenv(
    "OPENROUTER_MODELS_URL", "https://openrouter.ai/api/v1/models"
)

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

PROMPT_TEMPLATE = (
    """You are an HR assistant. For the following employee data, recommend important\n"
    "certifications and courses that will improve the employee's career.\n"
    "Provide the response in Arabic only. The output must be strictly one JSON object\n"
    "with the following format. Mention the certification or course names within the\n"
    "roadmap steps so they can be matched visually:\n"
    "{\n"
    "  \"certifications\": [ {\"name\":..., \"link\":..., \"price\":... } ],\n"
    "  \"courses\": [ {\"name\":..., \"link\":..., \"price\":... } ],\n"
    "  \"roadmap\": [ \"step 1 mentions PMP\", \"step 2 mentions course name\", ... ]\n"
    "}\n"
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
    return ["qwen:7b", "openai/gpt-3.5-turbo"]



def choose_model() -> str:
    """Return a valid model ID, falling back to a free one if needed."""
    env_model = os.getenv("OPENROUTER_MODEL")
    available = fetch_available_models()
    if env_model and env_model in available:
        return env_model

    # prefer well-known free models
    for default in ["openai/gpt-3.5-turbo", "qwen:7b"]:
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


def extract_first_json_block(text: str):
    """Return the first JSON object found in text, or None."""
    matches = re.findall(r"\{[\s\S]*?\}", text)
    if matches:
        try:
            return json.loads(matches[0])
        except json.JSONDecodeError:
            return None
    return None


def generate_recommendations(employee: dict):
    if not OPENROUTER_API_KEY:
        return {
            "error": "OPENROUTER_API_KEY not configured",
            "prompt": employee
        }
    model = choose_model()

    messages = [
        {"role": "system", "content": PROMPT_TEMPLATE},
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
    logger.info("Sending payload for %s: %s", employee.get("name"), json.dumps(payload, ensure_ascii=False))
    try:
        resp = requests.post(OPENROUTER_URL, json=payload, headers=headers, timeout=60)
        logger.info("OpenRouter response text for %s: %s", employee.get("name"), resp.text)
        if resp.status_code != 200:
            try:
                err = resp.json().get("error", {}).get("message", resp.text)
            except Exception:
                err = resp.text
            logger.error("OpenRouter returned %s: %s", resp.status_code, err)
            return {"error": err}

        data = resp.json()
        logger.debug("OpenRouter raw response: %s", data)
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        logger.info("OpenRouter content for %s: %s", employee.get("name"), content)
        parsed = extract_first_json_block(content)
        if parsed:
            return parsed
        try:
            return json.loads(content)
        except Exception:
            return {"raw": content}
    except Exception as e:
        logger.error("Error from OpenRouter for %s: %s", employee.get("name"), e)
        return {"error": str(e)}
