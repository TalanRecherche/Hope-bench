import logging

from fastapi import APIRouter, Depends, Request
from dependency_injector.wiring import inject, Provide
from ..containers import Container
from ..models.BusinessPropositionAnnotation import BusinessPropositionAnnotation
from ..models.User import User
from ..services.BusinessPropositionAnnotationService import BusinessPropositionAnnotationService

router = APIRouter(
    prefix="/business_proposition_annotation",
    tags=["business_proposition_annotation"],
    responses={404: {"description": "Not found"}},
)


@router.get("/")
@inject
async def find(request: Request,
               id_business_proposition_annotation: str,
               business_proposition_annotation_service: BusinessPropositionAnnotationService = Depends(
                   Provide[Container.business_proposition_annotation_repository])):
    return business_proposition_annotation_service.find(id_business_proposition_annotation)


@router.post("/", status_code=201)
@inject
async def create(request: Request,
                 business_proposition_annotation: BusinessPropositionAnnotation,
                 business_proposition_annotation_service: BusinessPropositionAnnotationService = Depends(
                     Provide[Container.business_proposition_service])) -> BusinessPropositionAnnotation:
    user: User = request.state.user
    return business_proposition_annotation_service.create(
        user.id,
        business_proposition_annotation,
    )

@router.put("/{business_proposition_annotation_id}")
@inject
async def update(request: Request,
                 business_proposition_annotation: BusinessPropositionAnnotation,
                 business_proposition_annotation_service: BusinessPropositionAnnotationService = Depends(Provide[Container.business_proposition_service])):
    user: User = request.state.user
    return business_proposition_annotation_service.update(business_proposition_annotation)

@router.delete("/{business_proposition_annotation_id}")
@inject
async def delete_by_id(
        request: Request,
        business_proposition_annotation_id: str,
        business_proposition_annotation_service: BusinessPropositionAnnotationService = Depends(Provide[Container.business_proposition_service]),
):
    user: User = request.state.user
    return business_proposition_annotation_service.delete(business_proposition_annotation_id)

