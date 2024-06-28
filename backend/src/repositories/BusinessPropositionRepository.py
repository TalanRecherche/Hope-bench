import logging
from contextlib import AbstractContextManager
from typing import Callable
from sqlalchemy.orm import Session
from sqlalchemy import select

from .models import ReviewerDb, BusinessPropositionDB
from ..models.BusinessProposition import BusinessProposition


class BusinessPropositionRepository:
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory

    def find(self, business_proposition_id):
        with self.session_factory() as db:
            us_db = self._find(db, business_proposition_id).one_or_none()
            return self._db_to_domain(us_db)

    def _find(self, db: Session, business_proposition_id: str):
        return db.query(BusinessPropositionDB).filter(
            BusinessPropositionDB.id_business_proposition == business_proposition_id)

    def _db_to_domain(self, business_proposition_db: BusinessPropositionDB | None) -> BusinessProposition | None:
        if business_proposition_db is None:
            return None
        return BusinessProposition(
            id_business_proposition=str(business_proposition_db.id_business_proposition),
            mission_name=business_proposition_db.mission_name,
            client=business_proposition_db.client,
            start_date=business_proposition_db.start_date,
            end_date=business_proposition_db.end_date,
            localisation_talan=business_proposition_db.localisation_talan,
            localisation_client=business_proposition_db.localisation_client,
            number_of_workers=business_proposition_db.number_of_workers,
            mission_length_in_month=business_proposition_db.mission_length_in_month,
            number_of_in_person_meetings_per_week=business_proposition_db.number_of_in_person_meetings_per_week,
            transports=[],  #TODO parse transports
            number_of_emails_with_attachments_per_week=business_proposition_db.number_of_emails_with_attachments_per_week,
            number_of_emails_without_attachments_per_week=business_proposition_db.number_of_emails_without_attachments_per_week,
            hours_of_visioconference_per_week=business_proposition_db.hours_of_visioconference_per_week,
            camera_on=business_proposition_db.camera_on,
            computers=[],  #TODO parse computers
            phones=[],  #TODO parse phones
            storage_amount_in_terabytes=business_proposition_db.storage_amount_in_terabytes,
            storage_length_in_month=business_proposition_db.storage_length_in_month,
            number_of_backups=business_proposition_db.number_of_backups,
            storage_provider=business_proposition_db.storage_provider,
            storage_location=business_proposition_db.storage_location,
            compute_time=business_proposition_db.compute_time,
            compute_provider=business_proposition_db.compute_provider,
            compute_location=business_proposition_db.compute_location,
            compute_device=business_proposition_db.compute_device,
            pages_printed_per_month=business_proposition_db.pages_printed_per_month,
            print_double_sided=business_proposition_db.print_double_sided
        )

    def create(self, data: BusinessProposition) -> BusinessProposition:
        db_data = BusinessPropositionDB(**data.dict(exclude={"id_business_proposition"}))
        with self.session_factory() as db:
            db.add(db_data)
            db.commit()
            db.refresh(db_data)
        return self._db_to_domain(db_data)

    def update(self, data: BusinessProposition) -> BusinessProposition:
        dic = {
            "id_business_proposition": str(data.id_business_proposition),
            "mission_name": data.mission_name,
            "client": data.client,
            "start_date": data.start_date,
            "end_date": data.end_date,
            "localisation_talan": data.localisation_talan,
            "localisation_client": data.localisation_client,
            "number_of_workers": data.number_of_workers,
            "mission_length_in_month": data.mission_length_in_month,
            "number_of_in_person_meetings_per_week": data.number_of_in_person_meetings_per_week,
            "transports": [],  # TODO parse transports
            "number_of_emails_with_attachments_per_week": data.number_of_emails_with_attachments_per_week,
            "number_of_emails_without_attachments_per_week": data.number_of_emails_without_attachments_per_week,
            "hours_of_visioconference_per_week": data.hours_of_visioconference_per_week,
            "camera_on": data.camera_on,
            "computers": [],  # TODO parse computers
            "phones": [],  # TODO parse phones
            "storage_amount_in_terabytes": data.storage_amount_in_terabytes,
            "storage_length_in_month": data.storage_length_in_month,
            "number_of_backups": data.number_of_backups,
            "storage_provider": data.storage_provider,
            "storage_location": data.storage_location,
            "compute_time": data.compute_time,
            "compute_provider": data.compute_provider,
            "compute_location": data.compute_location,
            "compute_device": data.compute_device,
            "pages_printed_per_month": data.pages_printed_per_month,
            "print_double_sided": data.print_double_sided
        }
        with self.session_factory() as db:
            previous_data = self._find(db, data.id_business_proposition)
            previous_data.update(dic)
            db.commit()
            db.refresh(previous_data)
        return self._db_to_domain(previous_data)

    def delete(self, business_proposition_id: str) -> None:
        with self.session_factory() as db:
            e = self._find(db, business_proposition_id).one_or_none()
            if e is not None:
                db.delete(e)
                db.commit()
