import os
import requests
from typing import List
from .models import EmployeeProfile, TrainingPlan, TrainingItem

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
# Use Qwen model for generating plans via OpenRouter
OPENROUTER_MODEL = "qwen"


def generate_training_plan(profile: EmployeeProfile) -> TrainingPlan:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY not set")

    prompt = f"""Employee Name: {profile.employee_name}\n" \
             f"Job Title: {profile.job_title}\n" \
             f"Experience: {profile.years_of_experience}\n" \
             f"Department: {profile.department}\n" \
             f"Career Goal: {profile.career_goal}\n" \
             f"Skill Gap Areas: {profile.skill_gap_areas}\n" \
             f"Technical Skills: {profile.technical_skills}\n" \
             f"Soft Skills: {profile.soft_skills}\n" \
             f"Preferred Learning Style: {profile.preferred_learning_style}"""

    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": "You are a professional training assistant generating concise learning plans."},
            {"role": "user", "content": prompt}
        ]
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    response = requests.post(OPENROUTER_URL, json=payload, headers=headers)
    response.raise_for_status()
    data = response.json()

    # The response format is model dependent; this is a simple extraction
    content = data['choices'][0]['message']['content']
    # For demo purposes we expect JSON string
    plan_data = TrainingPlan.parse_raw(content)
    return plan_data
