from .models import AnnotationAffectationDB
from contextlib import AbstractContextManager
from typing import Callable
from sqlalchemy.orm import Session

from ..models.AnnotationAffectation import AnnotationAffectation


class AnnotationAffectationRepository:
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory

    @staticmethod
    def _db_to_domain(annotation_affectation_db: AnnotationAffectationDB | None) -> AnnotationAffectation | None:
        if annotation_affectation_db is None:
            return None
        return AnnotationAffectation(
            id_business_proposition_annotation=str(annotation_affectation_db.id_business_proposition_annotation),
            id_user=annotation_affectation_db.id_user
        )

    def create(self, user_id: str, business_proposition_annotation_id: str):
        with self.session_factory() as session:
            user_business_proposition_table = AnnotationAffectationDB(
                id_business_proposition_annotation=business_proposition_annotation_id,
                id_user=user_id
            )
            session.add(user_business_proposition_table)
            session.commit()
            return self._db_to_domain(user_business_proposition_table)

    def read(self, id_user: str, id_business_proposition_annotation: str, id_business_proposition_file: str):
        with self.session_factory() as session:
            return session.query(AnnotationAffectation).filter(
                AnnotationAffectation.id_user == id_user,
                AnnotationAffectation.id_business_proposition_annotation == id_business_proposition_annotation,
            ).one_or_none()

    def delete(self, id_user: str, id_business_proposition_annotation: str, id_business_proposition_file: str):
        with self.session_factory() as session:
            user_business_proposition_table = session.query(AnnotationAffectation).filter(
                AnnotationAffectation.id_user == id_user,
                AnnotationAffectation.id_business_proposition_annotation == id_business_proposition_annotation,
            ).one_or_none()
            if user_business_proposition_table is not None:
                session.delete(user_business_proposition_table)
                session.commit()
                return True
            return False
