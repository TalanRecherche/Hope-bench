from fastapi import APIRouter, Depends, Request
from dependency_injector.wiring import inject, Provide
from ..containers import Container
from ..models.BusinessProposition import BusinessProposition
from ..models.User import User
from ..services import BusinessPropositionService

router = APIRouter(
    prefix="/business_proposition",
    tags=["business_proposition"],
    responses={404: {"description": "Not found"}},
)


@router.get("/")
@inject
async def find(request: Request,
               id_business_proposition: str,
               business_proposition_service: BusinessPropositionService = Depends(
                   Provide[Container.business_proposition_service])):
    return business_proposition_service.find(id_business_proposition)


@router.post("/", status_code=201)
@inject
async def create(request: Request,
                 business_proposition: BusinessProposition,
                 business_proposition_service: BusinessPropositionService = Depends(
                     Provide[Container.business_proposition_service])) -> BusinessProposition:
    return business_proposition_service.create(business_proposition)

@router.put("/{business_proposition_id}")
@inject
async def update(request: Request,
                 business_proposition: BusinessProposition,
                 business_proposition_service: BusinessPropositionService = Depends(Provide[Container.business_proposition_service])):
    return business_proposition_service.update(business_proposition)

@router.delete("/{business_proposition_id}")
@inject
async def delete_by_id(
        request: Request,
        business_proposition_id: str,
        business_proposition_service: BusinessPropositionService = Depends(Provide[Container.business_proposition_service]),
):
    return business_proposition_service.delete(business_proposition_id)

