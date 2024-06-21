from fastapi import APIRouter

router = APIRouter(
    prefix="/reviewers",
    tags=["reviewers"],
    responses={404: {"description": "Not found"}},
)



