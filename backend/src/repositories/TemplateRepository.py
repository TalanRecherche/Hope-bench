from contextlib import AbstractContextManager
from typing import Callable

from sqlalchemy.orm import Session

from .models import TemplateDb
from ..models.Template import Template


class TemplateRepository:
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory

    def find(self, template_id) -> Template | None:
        with self.session_factory() as db:
            tpl_db = self._find(db, template_id).one_or_none()
            return self._db_to_domain(tpl_db)

    def delete(self, template_id):
        with self.session_factory() as db:
            t = self._find(db, template_id).one_or_none()
            if t is not None:
                db.delete(t)
                db.commit()

    def find_all(self, active: bool | None) -> [Template]:
        with self.session_factory() as db:
            query = db.query(TemplateDb)
            if active is not None:
                query = query.filter(TemplateDb.active == active)
            tpl_dbs = query.order_by(TemplateDb.type, TemplateDb.name).all()
            return [self._db_to_domain(tpl) for tpl in tpl_dbs]

    def create(self, data: Template):
        tpl_db = TemplateDb(
            id=data.id,
            name=data.name,
            type=data.type,
            fileName=data.fileName,
            fileBlob=data.fileBlob,
            active=data.active,
        )
        with self.session_factory() as db:
            db.add(tpl_db)
            db.commit()

    def save(self, template_id: str, template: dict):
        with self.session_factory() as db:
            previous_template = self._find(db, template_id)
            previous_template.update(template)
            db.commit()

    def _find(self, db: Session, template_id: str):
        return db.query(TemplateDb).filter(TemplateDb.id == template_id)

    def _db_to_domain(self, template_db: TemplateDb | None) -> Template | None:
        if template_db is None:
            return None
        return Template(
            id=template_db.id,
            name=template_db.name,
            type=template_db.type,
            fileName=template_db.fileName,
            fileBlob=template_db.fileBlob,
            active=template_db.active or False
        )
