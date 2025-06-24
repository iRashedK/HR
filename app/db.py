import os
import time
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
from .models import Base

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@db:5432/hr")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)


def wait_for_db(max_tries: int = 10, delay: int = 3) -> None:
    """Block until the database connection is available."""
    for i in range(max_tries):
        try:
            with engine.connect() as conn:  # noqa: F841
                return
        except OperationalError:
            logging.info("Database not ready, retrying (%s/%s)...", i + 1, max_tries)
            time.sleep(delay)
    raise RuntimeError("Database connection failed")


def init_db():
    wait_for_db()
    Base.metadata.create_all(bind=engine)
