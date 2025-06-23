import os
import json
import logging
import requests

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
OPENROUTER_URL = os.getenv('OPENROUTER_URL', 'https://openrouter.ai/api/v1/chat/completions')

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

PROMPT_TEMPLATE = (
    """You are an HR assistant. For the following employee data, recommend important\n"
    "certifications and courses that will improve the employee's career.\n"
    "Provide the response in both Arabic and English. The output must be\n"
    "structured as JSON with the following format:\n"
    "{\n"
    "  \"certifications\": [ {\"name\":..., \"link\":..., \"price\":... } ],\n"
    "  \"courses\": [ {\"name\":..., \"link\":..., \"price\":... } ],\n"
    "  \"roadmap\": [ \"step 1\", \"step 2\", ... ]\n"
    "}\n"""
)


def generate_recommendations(employee: dict):
    if not OPENROUTER_API_KEY:
        return {
            "error": "OPENROUTER_API_KEY not configured",
            "prompt": employee
        }
    messages = [
        {"role": "system", "content": PROMPT_TEMPLATE},
        {"role": "user", "content": str(employee)},
    ]
    payload = {
        "model": os.getenv('OPENROUTER_MODEL', 'qwen:7b'),
        "messages": messages,
    }
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }
    try:
        resp = requests.post(OPENROUTER_URL, json=payload, headers=headers, timeout=60)
        resp.raise_for_status()
        data = resp.json()
        logger.debug("OpenRouter raw response: %s", data)
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        logger.info("OpenRouter content for %s: %s", employee.get("name"), content)
        try:
            return json.loads(content)
        except Exception:
            return {"raw": content}
    except Exception as e:
        logger.error("Error from OpenRouter for %s: %s", employee.get("name"), e)
        return {"error": str(e)}
