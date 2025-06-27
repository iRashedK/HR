import json
import os
import logging
import pika
from sqlalchemy.orm import Session
from concurrent.futures import ThreadPoolExecutor
import time
from .openrouter import generate_recommendations
from .db import SessionLocal, wait_for_db
from .utils import wait_for_rabbitmq
from .models import Result

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")

wait_for_db()
wait_for_rabbitmq()

connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
channel = connection.channel()
channel.queue_declare(queue="tasks")

MAX_WORKERS = int(os.getenv("ANALYSIS_WORKERS", "4"))
executor = ThreadPoolExecutor(max_workers=MAX_WORKERS)

def process_task(result_id: str, employee: dict, ch, tag: int):
    start = time.time()
    try:
        rec = generate_recommendations(employee)
    except Exception as exc:
        logger.exception("Processing failed for %s", employee.get("name"))
        rec = {"error": str(exc)}
    duration = time.time() - start
    sess: Session = SessionLocal()
    res = sess.get(Result, result_id)
    if res:
        res.data = rec
        res.status = "error" if rec.get("error") else "done"
        res.elapsed = duration
        sess.commit()
    sess.close()
    ch.basic_ack(delivery_tag=tag)

def callback(ch, method, properties, body):
    task = json.loads(body)
    result_id = task["id"]
    employee = task["employee"]
    logger.info("Queueing %s", employee.get("name"))
    executor.submit(process_task, result_id, employee, ch, method.delivery_tag)

channel.basic_qos(prefetch_count=MAX_WORKERS)
channel.basic_consume(queue="tasks", on_message_callback=callback)
print("Analyzer service started, waiting for tasks...")
channel.start_consuming()
