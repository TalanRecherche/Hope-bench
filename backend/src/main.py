import os

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html, get_swagger_ui_oauth2_redirect_html
from fastapi.responses import JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.types import Scope
import uvicorn

from .api.auth import get_auth, oauth2_scheme
from .api import public_api, users_api, business_proposition_api, business_proposition_file_api, options_api
from .containers import Container

load_dotenv()

# TODO: faire une meilleur configuration des CORS, pour l'instant ok en dev
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:8080",
    "http://localhost:9090",
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

api_router = APIRouter(default_response_class=JSONResponse, dependencies=[])
api_router.include_router(users_api.router)
api_router.include_router(business_proposition_api.router)
api_router.include_router(business_proposition_file_api.router)
api_router.include_router(options_api.router)

app.include_router(public_api.router)
app.include_router(api_router, prefix="/api/v1")

# Secure the docs endpoint with OAuth2
docs_router = APIRouter(dependencies=[])

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url, title=app.title + " - Docs"
    )

@app.get("/docs/oauth2-redirect", include_in_schema=False)
async def swagger_ui_redirect():
    return get_swagger_ui_oauth2_redirect_html()

docs_router.add_api_route(
    path="/docs",
    endpoint=custom_swagger_ui_html,
    methods=["GET"],
    include_in_schema=False,
)

docs_router.add_api_route(
    path="/docs/oauth2-redirect",
    endpoint=swagger_ui_redirect,
    methods=["GET"],
    include_in_schema=False,
)

app.include_router(docs_router)

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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)