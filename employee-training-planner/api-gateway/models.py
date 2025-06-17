from pydantic import BaseModel
from typing import List, Optional

class EmployeeProfile(BaseModel):
    employee_name: str
    job_title: str
    years_of_experience: int
    department: str
    career_goal: Optional[str] = None
    skill_gap_areas: Optional[str] = None
    technical_skills: Optional[str] = None
    soft_skills: Optional[str] = None
    preferred_learning_style: Optional[str] = None

class TrainingItem(BaseModel):
    title: str
    platform: str
    duration: str
    cost: str
    link: str
    reason: str

class TrainingPlan(BaseModel):
    employee: str
    job_title: str
    experience: int
    learning_plan: List[TrainingItem]
