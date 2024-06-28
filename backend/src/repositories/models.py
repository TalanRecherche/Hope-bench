import uuid
from sqlalchemy.dialects.postgresql import UUID
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

class BusinessPropositionDB(Base):
    __tablename__ = "business_propositions"
    id_business_proposition = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    mission_name = Column(String)
    client = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    localisation_talan = Column(String)
    localisation_client = Column(String)
    number_of_workers = Column(Integer)
    mission_length_in_month = Column(Integer)
    number_of_in_person_meetings_per_week = Column(Integer)
    transports = Column(ARRAY(JSONB))
    number_of_emails_with_attachments_per_week = Column(Integer)
    number_of_emails_without_attachments_per_week = Column(Integer)
    hours_of_visioconference_per_week = Column(Integer)
    camera_on = Column(Boolean)
    computers = Column(ARRAY(JSONB))
    phones = Column(ARRAY(JSONB))
    storage_amount_in_terabytes = Column(Integer)
    storage_length_in_month = Column(Integer)
    number_of_backups = Column(Integer)
    storage_provider = Column(String)
    storage_location = Column(String)
    compute_time = Column(Integer)
    compute_provider = Column(String)
    compute_location = Column(String)
    compute_device = Column(String)
    pages_printed_per_month = Column(Integer)
    print_double_sided = Column(Boolean)
