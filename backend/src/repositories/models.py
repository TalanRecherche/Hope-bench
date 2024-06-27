from sqlalchemy import Column, String, LargeBinary, ARRAY, Boolean, DateTime, func, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class UserDb(Base):
    __tablename__ = 'users'
    id_users = Column(String, primary_key=True, nullable=False)
    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    firstname_manager = Column(String)
    lastname_manager = Column(String)


class ReviewerDb(Base):
    __tablename__ = 'reviewers'
    id_user = Column(String, primary_key=True, nullable=False)
    id_reviewer = Column(String, nullable=False)
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
