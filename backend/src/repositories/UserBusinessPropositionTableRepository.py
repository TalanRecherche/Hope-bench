from .models import UserBusinessPropositionTableDB
from ..models.UserBusinessPropositionTable import UserBusinessPropositionTable
from contextlib import AbstractContextManager
from typing import Callable
from sqlalchemy.orm import Session

class UserBusinessPropositionTableRepository:
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory

    def _db_to_domain(self, user_business_proposition_table: UserBusinessPropositionTableDB | None) -> UserBusinessPropositionTable | None:
        if user_business_proposition_table is None:
            return None
        return UserBusinessPropositionTable(
            id_business_proposition=str(user_business_proposition_table.id_business_proposition),
            id_user=user_business_proposition_table.id_user
        )

    def create(self, business_proposition_id: str, user_id: str):
        with self.session_factory() as session:
            user_business_proposition_table = UserBusinessPropositionTableDB(
                id_business_proposition=business_proposition_id,
                id_user=user_id
            )
            session.add(user_business_proposition_table)
            session.commit()
            return self._db_to_domain(user_business_proposition_table)

    def read(self, id_user: str, id_business_proposition: str):
        with self.database.session() as session:
            return session.query(UserBusinessPropositionTable).filter(
                UserBusinessPropositionTable.id_user == id_user,
                UserBusinessPropositionTable.id_business_proposition == id_business_proposition
            ).one_or_none()

    def delete(self, id_user: str, id_business_proposition: str):
        with self.database.session() as session:
            user_business_proposition_table = session.query(UserBusinessPropositionTable).filter(
                UserBusinessPropositionTable.id_user == id_user,
                UserBusinessPropositionTable.id_business_proposition == id_business_proposition
            ).one_or_none()
            if user_business_proposition_table is not None:
                session.delete(user_business_proposition_table)
                session.commit()
                return True
            return False