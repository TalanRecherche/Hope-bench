from contextlib import AbstractContextManager
from typing import Callable

from sqlalchemy.orm import Session

from .models import BusinessPropositionAnnotationDB, BusinessPropositionFileDB
from ..models.BusinessPropositionFile import BusinessPropositionFile


class BusinessPropositionFileRepository:
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory

    def find(self, business_proposition_file_id):
        with self.session_factory() as db:
            us_db = self._find(db, business_proposition_file_id).one_or_none()
            return self._db_to_domain(us_db)

    def _find(self, db: Session, business_proposition_file_id: str):
        return db.query(BusinessPropositionAnnotationDB).filter(
            BusinessPropositionAnnotationDB.business_proposition_file_id == business_proposition_file_id)

    def _db_to_domain(self, business_proposition_file_db: BusinessPropositionFileDB | None) -> BusinessPropositionFile | None:
        if business_proposition_file_db is None:
            return None
        return BusinessPropositionFile(
            id_business_proposition_file=str(business_proposition_file_db.id_business_proposition_file),
            file_name=business_proposition_file_db.file_name,
            format=business_proposition_file_db.format,
            confidential=business_proposition_file_db.confidential,
            added_at=business_proposition_file_db.added_at,
            data=business_proposition_file_db.file
        )

    def create(self, business_proposition_file: BusinessPropositionFile) -> BusinessPropositionFile:
        db_data = BusinessPropositionAnnotationDB(**business_proposition_file.dict(exclude={"id_business_proposition_file"}))
        with self.session_factory() as db:
            db.add(db_data)
            db.commit()
            db.refresh(db_data)
        return self._db_to_domain(db_data)

    def update(self, business_proposition_file: BusinessPropositionFile) -> BusinessPropositionFile:
        dic = {
            "id_business_proposition_file": str(business_proposition_file.id_business_proposition_file),
        }
        with self.session_factory() as db:
            previous_data = self._find(db, business_proposition_file.id_business_proposition_file)
            previous_data.update(dic)
            db.commit()
            db.refresh(previous_data)
        return self._db_to_domain(previous_data)

    def delete(self, business_proposition_file_id: str) -> None:
        with self.session_factory() as db:
            e = self._find(db, business_proposition_file_id).one_or_none()
            if e is not None:
                db.delete(e)
                db.commit()

    def find_paginated(self, offset: int, limit: int) -> list[BusinessPropositionFile]:
        with self.session_factory() as db:
            query_result = db.query(BusinessPropositionFileDB).offset(offset).limit(limit).all()
            domain_models = [self._db_to_domain(record) for record in query_result]

            return domain_models

    def count(self) -> int:
        with self.session_factory() as db:
            return db.query(BusinessPropositionFileDB).count()