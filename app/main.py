import os
import uuid
import json
import logging
import pika
from fastapi import FastAPI, UploadFile, File, Query
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from app.utils import parse_file, wait_for_rabbitmq
from app.db import SessionLocal, init_db
from app.models import Result

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")

init_db()

wait_for_rabbitmq()

connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
channel = connection.channel()
channel.queue_declare(queue="tasks")

app = FastAPI()
app.mount('/static', StaticFiles(directory='static'), name='static')

@app.get('/', response_class=HTMLResponse)
def index():
    with open('templates/index.html', 'r', encoding='utf-8') as f:
        return HTMLResponse(content=f.read())

@app.get('/library', response_class=HTMLResponse)
def library():
    with open('templates/library.html', 'r', encoding='utf-8') as f:
        return HTMLResponse(content=f.read())

@app.get('/dashboard', response_class=HTMLResponse)
def dashboard():
    with open('templates/dashboard.html', 'r', encoding='utf-8') as f:
        return HTMLResponse(content=f.read())

@app.post('/upload')
def upload(file: UploadFile = File(...)):
    try:
        data = parse_file(file)
    except Exception as e:
        logger.error("Failed to parse file: %s", e)
        return JSONResponse(status_code=400, content={"error": str(e)})

    job_id = str(uuid.uuid4())
    session: Session = SessionLocal()
    for row in data:
        result_id = str(uuid.uuid4())
        channel.basic_publish(
            exchange='',
            routing_key='tasks',
            body=json.dumps({"id": result_id, "employee": row}),
        )
        session.add(Result(id=result_id, job_id=job_id, employee_name=row.get('name', '')))
    session.commit()
    return JSONResponse(content={"job_id": job_id, "count": len(data)})

@app.get('/results')
def get_results(job: str = Query(...)):
    session: Session = SessionLocal()
    items = session.query(Result).filter(Result.job_id == job).all()
    results = []
    for r in items:
        results.append({"employee": r.employee_name, "status": r.status, "recommendations": r.data})
    return {"results": results}
