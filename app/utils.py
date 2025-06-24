import os
import time
import logging
import pandas as pd
import pika
from fastapi import UploadFile


def parse_file(file: UploadFile):
    """Parse CSV or Excel file and return list of employee dicts."""
    contents = file.file.read()
    file.file.seek(0)
    if file.filename.endswith('.csv'):
        df = pd.read_csv(file.file)
    else:
        df = pd.read_excel(file.file)
    df.columns = [c.lower().strip().replace(' ', '_') for c in df.columns]
    employees = df.to_dict(orient='records')
    return employees


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
