from contextlib import AbstractContextManager
from typing import Callable
from sqlalchemy.orm import Session
from sqlalchemy import select

from .models import ReviewerDb

class ReviewerRepository:
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory

    def find_ids_reviewed_by_id(self, id):
        with self.session_factory() as db:
            return [ x for x in db.execute(select(ReviewerDb.id_user).where(ReviewerDb.id_reviewer == id))]    
