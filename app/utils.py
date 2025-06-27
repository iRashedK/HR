import os
import time
import logging
import pandas as pd
import pika
from fastapi import UploadFile


def parse_file(file: UploadFile):
    """Parse uploaded file and return a list of employee dicts."""
    contents = file.file.read()
    file.file.seek(0)
    name = file.filename.lower()
    if name.endswith('.csv') or name.endswith('.xlsx'):
        if name.endswith('.csv'):
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)
        df.columns = [c.lower().strip().replace(' ', '_') for c in df.columns]
        return df.to_dict(orient='records')

    text = ''
    if name.endswith('.pdf'):
        try:
            from pdfminer.high_level import extract_text
            text = extract_text(file.file)
        except Exception as exc:
            logging.error("Failed to read PDF: %s", exc)
    elif name.endswith('.docx'):
        try:
            from docx import Document
            doc = Document(file.file)
            text = "\n".join(p.text for p in doc.paragraphs)
        except Exception as exc:
            logging.error("Failed to read DOCX: %s", exc)

    if text:
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        guess_name = lines[0] if lines else ''
        return [{"name": guess_name, "cv_text": text}]

    raise ValueError("Unsupported file format")


RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")
RABBITMQ_MAX_TRIES = int(os.getenv("RABBITMQ_MAX_TRIES", "20"))


def wait_for_rabbitmq(max_tries: int = RABBITMQ_MAX_TRIES, delay: int = 3) -> None:
    """Block until RabbitMQ connection is available."""
    for i in range(max_tries):
        try:
            conn = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
            conn.close()
            return
        except pika.exceptions.AMQPConnectionError:
            logging.info(
                "RabbitMQ not ready, retrying (%s/%s)...", i + 1, max_tries
            )
            time.sleep(delay)
    raise RuntimeError("RabbitMQ connection failed")
