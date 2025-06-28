from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func

Base = declarative_base()

class Result(Base):
    __tablename__ = 'results'
    id = Column(String, primary_key=True, index=True)
    job_id = Column(String, index=True)
    employee_name = Column(String)
    data = Column(JSONB)
    status = Column(String, default='pending')
    elapsed = Column(String)
    created_at = Column(DateTime, server_default=func.now())
