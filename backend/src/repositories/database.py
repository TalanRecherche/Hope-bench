import logging
from contextlib import contextmanager, AbstractContextManager
from typing import Callable

from sqlalchemy import create_engine, orm
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)


class Database:

    def __init__(self, db_url: str) -> None:
        self._engine = create_engine(db_url)
        self._session_factory = orm.scoped_session(
            orm.sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=self._engine,
            )
        )

    @contextmanager
    def session(self) -> Callable[..., AbstractContextManager[Session]]:
        db: Session = self._session_factory()
        try:
            yield db
        except Exception:
            logger.exception("Session rollback because of exception")
            db.rollback()
            raise
        finally:
            db.close()
