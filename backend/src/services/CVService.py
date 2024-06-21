""" This module contains the API for the curriculum vitae creation"""
from fastapi import UploadFile

from ..models.CVModels import CVData, PartialCVData
from ..models.PageResult import PageResult
from ..models.User import User, Roles
from ..models.exceptions import ForbiddenException, NotFoundException
from ..repositories.CVRepository import CVRepository
from .CVParser.AbstractCVParser import AbstractCVParser
from ..services.UserService import UserService
from ..services.ReviewerService import ReviewerService

from ..models.SearchOptions import SearchOptions


class CVService:

    def __init__(self, cv_repository: CVRepository, cv_parser: AbstractCVParser):
        self.cv_repository: CVRepository = cv_repository
        self.cv_parser = cv_parser

    def create(self, user: User, dto: CVData):
        dto.id_user = user.id
        self.cv_repository.create(dto)

    def update(self, user: User, dto: CVData):
        self._get_user_cv_or_raise(user, dto.id)
        self.cv_repository.update(dto)

    def change_status_cv(self, dto: CVData, new_status: int):
        self.cv_repository.change_status_cv(dto.id, new_status)

    def search(self, user: User,
               options: SearchOptions, 
               user_service: UserService,
               reviewer_service: ReviewerService) -> PageResult[CVData]:   
        if not user.has_role(Roles.manager):
            # standard user can only see his CVs
            options.userId = user.id
            print("UserId overruled because not manager")
        data = self.cv_repository.search(options, user_service, reviewer_service)
        total = self.cv_repository.count(options, user_service, reviewer_service)
        return PageResult(elements=data, page=options.page, pageSize=options.pageSize, totalElements=total)


    def find(self, user: User, cv_id: str) -> CVData:
        return self._get_user_cv_or_raise(user, cv_id)

    def delete(self, user: User, cv_id: str):
        self._get_user_cv_or_raise(user, cv_id)
        self.cv_repository.delete(cv_id)

    def parse_cv(self, firstname: str, lastname: str, file: UploadFile) -> PartialCVData:
        return self.cv_parser.parse(firstname, lastname, file)

    def _get_user_cv_or_raise(self, user: User, cv_id: str) -> CVData:
        cv: CVData | None = self.cv_repository.find(cv_id)
        if cv is None:
            raise NotFoundException()
        if user.has_role(Roles.manager) or cv.id_user == user.id:
            return cv
        raise ForbiddenException()
