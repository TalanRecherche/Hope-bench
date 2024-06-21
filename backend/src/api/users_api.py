from ..services.ReviewerService import ReviewerService
from fastapi import APIRouter, Request
from dependency_injector.wiring import inject, Provide
from fastapi import APIRouter, Depends, Request
from ..containers import Container
from ..services.UserService import UserService

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

@router.get("")
@router.get("/")
@inject
async def find(request: Request,
                 id_user: str,
                 user_service: UserService = Depends(Provide[Container.user_service])):
    return user_service.find(id_user)

@router.get("/reviewed_and_underlings/{userID}")
@inject
async def find_reviewed_and_underlings(request: Request,
                 userID: str,
                 user_service: UserService = Depends(Provide[Container.user_service]),
                 reviewer_service: ReviewerService = Depends(Provide[Container.reviewer_service])):
    return user_service.find_reviewed_and_underlings_id(userID, reviewer_service)


@router.get("")
@router.get("/full_name/{userID}")
@inject
async def find(request: Request,
                 userID: str,
                 user_service: UserService = Depends(Provide[Container.user_service])):
    return user_service.get_full_name(userID)

