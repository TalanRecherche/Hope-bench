import os

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.params import Depends
from fastapi.responses import JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from starlette.types import Scope
from starlette.exceptions import HTTPException as StarletteHTTPException

from .api import public_api, reviewer_api, users_api, business_proposition_api
from .api.auth import get_auth
from .containers import Container

load_dotenv()

# TODO: faire une meilleur configuration des CORS, pour l'instant ok en dev
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:8080",
]

container = Container()
db = container.db()

app = FastAPI()
app.container = container
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # allow_origins=["*"],
)

api_router = APIRouter(default_response_class=JSONResponse, dependencies=[Depends(get_auth)])
api_router.include_router(users_api.router)
api_router.include_router(reviewer_api.router)
api_router.include_router(business_proposition_api.router)

app.include_router(public_api.router)
app.include_router(api_router, prefix="/api/v1")


# static folder containing the frontend app built
class SPAStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope: Scope) -> Response:
        try:
            return await super().get_response(path, scope)
        except (HTTPException, StarletteHTTPException) as ex:
            if ex.status_code == 404:
                return await super().get_response("index.html", scope)
            else:
                raise ex


front_path = os.path.dirname(os.path.realpath(__file__)) + "/front"
app.mount("/", SPAStaticFiles(directory=front_path, html=True), name="front")
