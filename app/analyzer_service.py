import json
import os
import logging
import pika
from sqlalchemy.orm import Session
from .openrouter import generate_recommendations
from .db import SessionLocal, init_db
from .models import Result

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")

init_db()

connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
channel = connection.channel()
channel.queue_declare(queue="tasks")

session: Session = SessionLocal()

def callback(ch, method, properties, body):
    task = json.loads(body)
    result_id = task["id"]
    employee = task["employee"]
    logger.info("Processing %s", employee.get("name"))
    rec = generate_recommendations(employee)
    res = session.get(Result, result_id)
    if res:
        res.data = rec
        res.status = "done"
        session.commit()
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue="tasks", on_message_callback=callback)
print("Analyzer service started, waiting for tasks...")
channel.start_consuming()
