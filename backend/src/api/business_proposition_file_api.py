import logging

from fastapi import APIRouter, Depends, Request
from dependency_injector.wiring import inject, Provide
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
                   Provide[Container.business_proposition_annotation_repository])):
    return business_proposition_file_service.find(id_business_proposition_annotation)


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
                 business_proposition_file_service: BusinessPropositionFileService = Depends(Provide[Container.business_proposition_service])):
    return business_proposition_file_service.update(business_proposition_file)
