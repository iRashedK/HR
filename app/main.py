import os
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from app.openrouter import generate_recommendations
from app.utils import parse_file

app = FastAPI()
app.mount('/static', StaticFiles(directory='static'), name='static')

@app.get('/', response_class=HTMLResponse)
def index():
    with open('templates/index.html', 'r', encoding='utf-8') as f:
        return HTMLResponse(content=f.read())

@app.post('/upload')
def upload(file: UploadFile = File(...)):
    data = parse_file(file)
    results = []
    for row in data:
        rec = generate_recommendations(row)
        results.append({"employee": row["name"], "recommendations": rec})
    return JSONResponse(content={"results": results})
