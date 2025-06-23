import os
import logging
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from app.openrouter import generate_recommendations
from app.utils import parse_file

logging.basicConfig(level=logging.INFO)
app = FastAPI()
app.mount('/static', StaticFiles(directory='static'), name='static')

@app.get('/', response_class=HTMLResponse)
def index():
    with open('templates/index.html', 'r', encoding='utf-8') as f:
        return HTMLResponse(content=f.read())

@app.post('/upload')
def upload(file: UploadFile = File(...)):
    try:
        data = parse_file(file)
    except Exception as e:
        logging.error("Failed to parse file: %s", e)
        return JSONResponse(status_code=400, content={"error": str(e)})

    results = []
    for row in data:
        rec = generate_recommendations(row)
        results.append({"employee": row.get("name", "Unknown"), "recommendations": rec})
    return JSONResponse(content={"results": results})
