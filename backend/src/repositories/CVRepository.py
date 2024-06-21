from contextlib import AbstractContextManager
from typing import Callable

from sqlalchemy.orm import Session, Query

from ..services.ReviewerService import ReviewerService

from ..models.SearchOptions import SearchOptions

from .models import CVDb
from ..models.CVModels import CVData, Mission, Education, Language, Certification, SkillsByDomain
from ..services.UserService import UserService


class CVRepository:
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory

    def create(self, data: CVData) -> None:
        # Values should be basic types, dicts, or list of dicts. 
        data.comm_languages.sort_comments()
        data.comm_educations.sort_comments()
        data.comm_certifications.sort_comments()
        data.comm_skills.sort_comments()
        data.comm_general.sort_comments()
        cv_db = CVDb(
            id=data.id,
            firstname=data.firstname,
            lastname=data.lastname,
            poste=data.poste,
            introduction=data.introduction,
            missions=[a.dict() for a in data.missions],
            languages=[a.dict() for a in data.languages],
            educations=[a.dict() for a in data.educations],
            certifications=[a.dict() for a in data.certifications],
            skills=[a.dict() for a in data.skills],
            comm_languages=data.comm_languages.dict(),
            comm_educations=data.comm_educations.dict(),
            comm_certifications=data.comm_certifications.dict(),
            comm_skills=data.comm_skills.dict(),
            comm_general=data.comm_general.dict(),
            id_user=data.id_user, 
            label=data.label, 
            status=data.status, 
            primary_cv=data.primary_cv,
            labelsAnnotation=data.labelsAnnotation.dict(),
            originalFormat=data.originalFormat
        )
        with self.session_factory() as db:
            db.add(cv_db)
            db.commit()

    def update(self, data: CVData):
        data.comm_languages.sort_comments()
        data.comm_educations.sort_comments()
        data.comm_certifications.sort_comments()
        data.comm_skills.sort_comments()
        data.comm_general.sort_comments()
        dic = {
            'id': data.id,
            'id': data.id,
            'firstname': data.firstname,
            'lastname': data.lastname,
            'poste': data.poste,
            'introduction': data.introduction,
            'missions': [a.dict() for a in data.missions],
            'languages': [a.dict() for a in data.languages],
            'educations': [a.dict() for a in data.educations],
            'certifications': [a.dict() for a in data.certifications],
            'skills': [a.dict() for a in data.skills],
            'comm_languages': data.comm_languages.dict(),
            'comm_educations': data.comm_educations.dict(),
            'comm_certifications': data.comm_certifications.dict(),
            'comm_skills': data.comm_skills.dict(),
            'comm_general': data.comm_general.dict(),
            'id_user': data.id_user,
            'status': data.status,
            'label': data.label,
            'primary_cv': data.primary_cv,
            'labelsAnnotation': data.labelsAnnotation.dict(),
            'originalFormat': data.originalFormat
        }
        with self.session_factory() as db:
            previous_data = self._find(db, data.id)
            previous_data.update(dic)
            db.commit()

    def search(self, options: SearchOptions , user_service: UserService, reviewer_service: ReviewerService) -> [CVData]:
        with self.session_factory() as db:
            query = self._build_search_query_mail(db.query(CVDb), options, user_service, reviewer_service)
            cv_dbs = query.limit(options.pageSize).offset(options.page * options.pageSize).all()
            tab = [self._db_to_domain(cv) for cv in cv_dbs]
            return tab

    def count(self, options: SearchOptions, user_service: UserService, reviewer_service: ReviewerService) -> int:
        with self.session_factory() as db:
            query = self._build_search_query_mail(db.query(CVDb), options, user_service, reviewer_service)
            return query.count()

    def _build_search_query(self, query, id_user: str | None, search: str | None, user_service: UserService):
        # TODO: recherche par skills
        # TODO: faire de la recherche full text
        if id_user is not None and search is None:
            # if user_service is not None:
            #     query = query.filter( lambda user = user_sService.find(CVDb.id_user) : user is not None and user.id_manager  == id_user )
            query = query.filter(CVDb.id_user == id_user)
        if search is not None:
            if id_user is not None:
                # Récuperer les users qui ont ce user en manager
                list_underlings_id = [ x.id for x in user_service.find_underlings(id_user)]
                query = query.filter(CVDb.id_user.in_(list_underlings_id))
            if len(search) > 0:
                query = query.filter(
                    (CVDb.firstname.ilike(f'%{search}%'))
                    | (CVDb.lastname.ilike(f'%{search}%'))
                    | (CVDb.poste.ilike(f'%{search}%'))
            )
        return query.order_by(CVDb.updated_at.desc())
    
    def _build_search_query_mail(self, query, options: SearchOptions, user_service: UserService, reviewer_service: ReviewerService):
        # TODO: recherche par skills
        # TODO: faire de la recherche full text
        if options.selfSearch and options.userId is not None:
            query = query.filter(CVDb.id_user == options.userId)
        else:
            if  options.limitToAllowedCv:
                if options.userId != "":
                    mail =  user_service.find(options.userId).mail
                    list_underlings_id = [ x.id for x in user_service.find_underlings_mail(mail)]
                    list_reviewees_id = [ x.id_user for x in reviewer_service.find_ids_reviewed_by_id(options.userId)]
                    query = query.filter(CVDb.id_user.in_(list_underlings_id + list_reviewees_id))
            if len(options.searchString) > 0:
                query = query.filter(
                    (CVDb.firstname.ilike(f'%{options.searchString}%'))
                    | (CVDb.lastname.ilike(f'%{options.searchString}%'))
                    | (CVDb.poste.ilike(f'%{options.searchString}%'))
                )
            if(len(options.statusToCheck) == 0):
                return query.filter(CVDb.status.in_([ str(x) for x in [-1]]))
            if(len(options.statusToCheck) != 4):
                query = query.filter(CVDb.status.in_([ str(x) for x in options.statusToCheck]))

            if options.onlyMainCv:
                query = query.filter(CVDb.primary_cv == True)

            
        return query.order_by(CVDb.updated_at.desc())

    def find_all_by_user(self, id_user: str) -> list[CVData]:
        with self.session_factory() as db:
            cv_dbs = db.query(CVDb).filter(CVDb.id_user == id_user).all()
            return [self._db_to_domain(cv) for cv in cv_dbs]

    def find(self, cv_id: str) -> CVData | None:
        with self.session_factory() as db:
            cv_db = self._find(db, cv_id).one_or_none()
            return self._db_to_domain(cv_db)
        
    def change_status_cv(self, cv_id:str, new_status: int) -> None:
        with self.session_factory() as db:
            previous_data = self._find(db, cv_id)
            previous_data.update({**self._db_to_domain(previous_data.one_or_none()).dict(), "status": new_status})
            db.commit()

    
        
    def change_status_cv(self, cv_id:str, new_status: int) -> None:
        with self.session_factory() as db:
            previous_data = self._find(db, cv_id)
            previous_data.update({**self._db_to_domain(previous_data.one_or_none()).dict(), "status": new_status})
            db.commit()

    

    def delete(self, cv_id: str) -> None:
        with self.session_factory() as db:
            e = self._find(db, cv_id).one_or_none()
            if e is not None:
                db.delete(e)
                db.commit()

    def _find(self, db: Session, cv_id: str) -> Query[CVDb]:
        return db.query(CVDb).filter(CVDb.id == cv_id)

    def _db_to_domain(self, cv_db: CVDb | None) -> CVData | None:
        if cv_db is None:
            return None
        return CVData(
            id=cv_db.id,
            firstname=cv_db.firstname,
            lastname=cv_db.lastname,
            poste=cv_db.poste,
            introduction=cv_db.introduction,
            missions=[Mission(**a) for a in cv_db.missions],
            languages=[Language(**a) for a in cv_db.languages],
            educations= [Education(**a) for a in cv_db.educations],
            certifications=[Certification(**a) for a in cv_db.certifications],
            skills=[SkillsByDomain(**a) for a in cv_db.skills],
            id_user=cv_db.id_user, 
            comm_languages=cv_db.comm_languages,
            comm_educations=cv_db.comm_educations,
            comm_certifications=cv_db.comm_certifications,
            comm_skills=cv_db.comm_skills,
            comm_general=cv_db.comm_general,
            status=cv_db.status,
            label=cv_db.label,
            primary_cv=cv_db.primary_cv, 
            labelsAnnotation= cv_db.labelsAnnotation,
            originalFormat= cv_db.originalFormat
        )
