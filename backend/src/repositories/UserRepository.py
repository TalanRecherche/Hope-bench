from ..services.ReviewerService import ReviewerService
from .models import UserDb
from ..models.User import User
from typing import Callable, List
from contextlib import AbstractContextManager
from sqlalchemy.orm import Session


class UserRepository:
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
    
    def find(self, user_id) -> User | None:
        with self.session_factory() as db:
            us_db = self._find(db, user_id).one_or_none()
            return self._db_to_domain(us_db)

    def _find(self, db: Session, user_id: str):
        return db.query(UserDb).filter(UserDb.id_users == user_id)

    def find_underlings(self, user_id) -> [User]:
        with self.session_factory() as db:
            us_db = self._find_underlings(db, user_id)
            return [self._db_to_domain(us) for us in us_db]

    def _find_underlings(self, db: Session, user_id: str) -> [UserDb]:
        return db.query(UserDb).filter(UserDb.id_manager == user_id)
    
    def find_underlings_mail(self, mail) -> [User]:
        with self.session_factory() as db:
            us_db = self._find_underlings_mail(db, mail)
            return [self._db_to_domain(us) for us in us_db]

    def _find_underlings_mail(self, db: Session, mail: str) -> [UserDb]:
        if(mail is None):
            return db.query(UserDb)
        else:
            return db.query(UserDb).filter(UserDb.mail_manager == mail)

    def _db_to_domain(self, user_db: UserDb | None) -> User | None:
        if user_db is None:
            return None
        return User(
            id=user_db.id_users,
            roles=[],
            first_name=user_db.firstname,
            last_name=user_db.lastname,
            mail = user_db.mail,
            first_name_manager=user_db.firstname_manager,
            last_name_manager=user_db.lastname_manager,
            mail_manager = user_db.mail_manager
        )
    
    def find_reviewed_and_underlings_id(self, userId: str, reviewer_service: ReviewerService) -> List[str]:
        mail =  self.find(userId).mail
        list_underlings_id = [ x.id for x in self.find_underlings_mail(mail)]
        list_reviewees_id = [ x.id_user for x in reviewer_service.find_ids_reviewed_by_id(userId)]
    
        return list_reviewees_id + list_underlings_id