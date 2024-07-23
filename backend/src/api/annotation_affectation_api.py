from dependency_injector.wiring import inject, Provide
from fastapi import APIRouter, Depends, Request

from backend.src.containers import Container
from backend.src.models.AnnotationAffectation import AnnotationAffectation
from backend.src.models.User import User
from backend.src.services.AnnotationAffectationService import AnnotationAffectationService

router = APIRouter(
    prefix="/annotation_affectation",
    tags=["annotation_affectation"],
    responses={404: {"description": "Not found"}},
)


@router.post("/", status_code=201)
@inject
async def create(request: Request,
                 annotation_affectation: AnnotationAffectation,
                 annotation_affectation_service: AnnotationAffectationService = Depends(
                     Provide[Container.business_proposition_service])) -> AnnotationAffectation:
    return annotation_affectation_service.create_annotation_affectation(
        annotation_affectation,
    )

