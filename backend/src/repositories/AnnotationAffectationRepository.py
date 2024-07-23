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

    def create(self, user_id: str, business_proposition_file_id: str):
        with self.session_factory() as session:
            user_business_proposition_table = AnnotationAffectationDB(
                id_user=user_id,
                id_business_proposition_file=business_proposition_file_id
            )
            session.add(user_business_proposition_table)
            session.commit()
            return self._db_to_domain(user_business_proposition_table)

    def read(self, id_user: str, id_business_proposition_file: str):
        with self.session_factory() as session:
            return session.query(AnnotationAffectation).filter(
                AnnotationAffectation.id_user == id_user,
                AnnotationAffectation.id_business_proposition_file == id_business_proposition_file,
            ).one_or_none()

    def delete(self, id_user: str, id_business_proposition_file: str):
        with self.session_factory() as session:
            user_business_proposition_table = session.query(AnnotationAffectation).filter(
                AnnotationAffectation.id_user == id_user,
                AnnotationAffectation.id_business_proposition_file == id_business_proposition_file,
            ).one_or_none()
            if user_business_proposition_table is not None:
                session.delete(user_business_proposition_table)
                session.commit()
                return True
            return False

    def update_status(self, id_user: str, id_business_proposition_file: str, status: str):
        assert status in ['annotated', 'verified']
        with self.session_factory() as session:
            user_business_proposition_table = session.query(AnnotationAffectation).filter(
                AnnotationAffectation.id_user == id_user,
                AnnotationAffectation.id_business_proposition_file == id_business_proposition_file,
            ).one_or_none()
            if user_business_proposition_table is not None:
                user_business_proposition_table.status = status
                session.commit()
                return self._db_to_domain(user_business_proposition_table)
            return None

    def update_annotation_id(self, id_user: str, id_business_proposition_file: str, annotation_id: str):
        with self.session_factory() as session:
            user_business_proposition_table = session.query(AnnotationAffectation).filter(
                AnnotationAffectation.id_user == id_user,
                AnnotationAffectation.id_business_proposition_file == id_business_proposition_file,
            ).one_or_none()
            if user_business_proposition_table is not None:
                if user_business_proposition_table.id_business_proposition_annotation is None:
                    user_business_proposition_table.id_business_proposition_annotation = annotation_id
                    user_business_proposition_table.status = 'in-progress'
                    session.commit()
                    return self._db_to_domain(user_business_proposition_table)
                else:
                    raise Exception("Annotation ID is already set for this user and business proposition file.")
            return None