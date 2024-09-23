import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, LargeBinary, ARRAY, Boolean, DateTime, func, Integer, ForeignKey
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


class BusinessPropositionAnnotationDB(Base):
    __tablename__ = "business_proposition_annotations"
    id_business_proposition_annotation = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False
    )

    id_business_proposition_file = Column(
        UUID(as_uuid=True),
        ForeignKey('business_proposition_files.id_business_proposition_file'),
        default=uuid.uuid4,
        nullable=False
    )
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


class BusinessPropositionFileDB(Base):
    __tablename__ = "business_proposition_files"
    id_business_proposition_file = Column(UUID(as_uuid=True), primary_key=True, nullable=False)
    file_name = Column(String, nullable=False)
    format = Column(String, nullable=False)
    confidential = Column(Boolean, nullable=False)
    added_at = Column(DateTime, nullable=False, server_default=func.now())
    file = Column(LargeBinary, nullable=False)  # Not ideal architecture wise but probably fine for now


class AnnotationAffectationDB(Base):
    __tablename__ = "AnnotationAffectationTable"
    id_business_proposition_file = Column(
        UUID(as_uuid=True),
        ForeignKey('business_proposition_files.id_business_proposition_file'),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False
    )

    id_user = Column(
        String,
        ForeignKey('users.id_users'),
        primary_key=True,
        nullable=False
    )

    id_business_proposition_annotation = Column(
        UUID(as_uuid=True),
        ForeignKey('business_proposition_annotations.id_business_proposition_annotation'),
        primary_key=False,
        default=uuid.uuid4,
        nullable=True
    )
    status = Column(String, nullable=False)
    last_update = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

class ComputerDB(Base):
    __tablename__ = "computers"
    id_computer = Column(UUID(as_uuid=True), primary_key=True, nullable=False)
    model = Column(String, nullable=False)

class PhoneDB(Base):
    __tablename__ = "phones"
    id_phone = Column(UUID(as_uuid=True), primary_key=True, nullable=False)
    model = Column(String, nullable=False)

class TransportDB(Base):
    __tablename__ = "transports"
    id_transport = Column(UUID(as_uuid=True), primary_key=True, nullable=False)
    transport_mode = Column(String, nullable=False)

class ComputeProviderDB(Base):
    __tablename__ = "compute_providers"
    id_compute_provider = Column(UUID(as_uuid=True), primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    region = Column(String, nullable=False)

class StorageProviderDB(Base):
    __tablename__ = "storage_providers"
    id_storage_provider = Column(UUID(as_uuid=True), primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    region = Column(String, nullable=False)