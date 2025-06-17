import io
import pandas as pd
from fastapi import FastAPI, File, UploadFile
from .models import EmployeeProfile, TrainingPlan
from .planner import generate_training_plan

app = FastAPI(title="Employee Training Gateway")

@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))
    plans = []
    for _, row in df.iterrows():
        profile = EmployeeProfile(
            employee_name=row.get('Employee Name', ''),
            job_title=row.get('Job Title', ''),
            years_of_experience=int(row.get('Years of Experience', 0)),
            department=row.get('Department', ''),
            career_goal=row.get('Career Goal', ''),
            skill_gap_areas=row.get('Skill Gap Areas', ''),
            technical_skills=row.get('Technical Skills', ''),
            soft_skills=row.get('Soft Skills', ''),
            preferred_learning_style=row.get('Preferred Learning Style', '')
        )
        plan = generate_training_plan(profile)
        plans.append(plan)
    return plans
