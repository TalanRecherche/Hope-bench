import logging

from fastapi import APIRouter, Depends, Request
from dependency_injector.wiring import inject, Provide
from pydantic import BaseModel

from ..containers import Container
from ..models.BusinessPropositionFile import BusinessPropositionFile
from ..services.BusinessPropositionFileService import BusinessPropositionFileService

router = APIRouter(
    prefix="/business_proposition_file",
    tags=["business_proposition_file"],
    responses={404: {"description": "Not found"}},
)


@router.get("/")
@inject
async def find(request: Request,
               id_business_proposition_annotation: str,
               business_proposition_file_service: BusinessPropositionFileService = Depends(
                   Provide[Container.business_proposition_file_service])):
    return business_proposition_file_service.find(id_business_proposition_annotation)


class PaginatedBusinessPropositionFile(BaseModel):
    page: int
    pageSize: int
    totalElements: int
    elements: list[BusinessPropositionFile]


@router.get("/paginated")
@inject
async def find_paginated(
    request: Request,
    page: int = 1,  # Default to page 1 if not specified
    page_size: int = 10,  # Default page size to 10 if not specified
    business_proposition_file_service: BusinessPropositionFileService = Depends(
        Provide[Container.business_proposition_file_service])
) -> PaginatedBusinessPropositionFile:
    offset = (page - 1) * page_size
    limit = page_size

    pages = PaginatedBusinessPropositionFile(
        page=page,
        pageSize=page_size,
        totalElements=business_proposition_file_service.find_number_of_pages(page_size),
        elements=business_proposition_file_service.find_paginated(offset=offset, limit=limit)
    )

    return pages


@router.post("/", status_code=201)
@inject
async def create(request: Request,
                 business_proposition_file: BusinessPropositionFile,
                 business_proposition_file_service: BusinessPropositionFileService = Depends(
                     Provide[Container.business_proposition_file_service])) -> BusinessPropositionFile:
    return business_proposition_file_service.create(
        business_proposition_file,
    )

@router.put("/{business_proposition_file_id}")
@inject
async def update(request: Request,
                 business_proposition_file: BusinessPropositionFile,
                 business_proposition_file_service: BusinessPropositionFileService = Depends(Provide[Container.business_proposition_file_service])):
    return business_proposition_file_service.update(business_proposition_file)
