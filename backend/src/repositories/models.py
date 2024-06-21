from sqlalchemy import Column, String, LargeBinary, ARRAY, Boolean, DateTime, func, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declarative_base

from ..models.Template import TemplateType

Base = declarative_base()


class TemplateDb(Base):
    __tablename__ = 'templates'

    id = Column(String, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    fileName = Column(String, nullable=False)
    fileBlob = Column(LargeBinary, nullable=False)
    active = Column(Boolean, default=False)

    def get_media_type(self) -> str | None:
        if self.type == TemplateType.DOCX:
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        if self.type == TemplateType.PPTX:
            return 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        return None


class CVDb(Base):
    __tablename__ = 'cvs'

    id = Column(String, primary_key=True, nullable=False)
    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    poste = Column(String, nullable=False)
    introduction = Column(String)
    missions = Column(ARRAY(JSONB))
    languages = Column(ARRAY(JSONB))
    educations = Column(ARRAY(JSONB))
    certifications = Column(ARRAY(JSONB))
    skills = Column(ARRAY(JSONB))
    comm_languages = Column(JSONB)
    comm_educations = Column(JSONB)
    comm_certifications = Column(JSONB)
    comm_skills = Column(JSONB)
    comm_general = Column(JSONB)
    id_user = Column(String)
    status = Column(Integer) #0 : Just created or has comment to resolve, 1 if sent to a manager and waiting for review 2 if valid.
    label = Column(String, default="")
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
    primary_cv = Column(Boolean, default=False)
    labelsAnnotation = Column(JSONB)
    originalFormat= Column(String, default="None")

class UserDb(Base):
    __tablename__ = 'users'
    id_users = Column(String, primary_key=True, nullable=False)
    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    mail = Column(String, nullable=False)
    firstname_manager = Column(String)
    lastname_manager = Column(String)
    mail_manager = Column(String)


class ReviewerDb(Base):
    __tablename__ = 'reviewers'
    id_user = Column(String, primary_key=True, nullable=False)
    id_reviewer = Column(String, nullable=False)
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
