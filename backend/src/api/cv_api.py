from datetime import datetime
from typing import List
from pydantic import BaseModel

from dependency_injector.wiring import inject, Provide
from fastapi import APIRouter, Depends, Request, UploadFile, File, Query, Form
from fastapi.responses import StreamingResponse, JSONResponse

from ..containers import Container
from ..models.CVModels import CVData
from ..models.User import User
from ..services.CVService import CVService
from ..services.TemplateService import TemplateService
from ..services.UserService import UserService
from ..services.ReviewerService import ReviewerService
from ..models.SearchOptions import SearchOptions

router = APIRouter(
    prefix="/cvs",
    tags=["cvs"],
    responses={404: {"description": "Not found"}},
)


# @router.get("/search")
# @inject
# async def search(
#         request: Request,
#         options: SearchOptions,
#         cv_service: CVService = Depends(Provide[Container.cv_service]),
#         user_service: UserService = Depends(Provide[Container.user_service])
# ):
#     print("Options de recherche : ", options)
#     user: User = request.state.user
#     return cv_service.search(user, SearchOptions(**options), user_service)

@router.get("/search")
@inject
async def search(
        request: Request,
        limitToAllowedCv: bool = Query(None),
        searchString: str = Query(None),
        userId: str = Query(None),
        selfSearch: bool = Query(None),
        statusToCheck: List[int] = Query(None), 
        onlyMainCv : bool = Query(None),
        cv_service: CVService = Depends(Provide[Container.cv_service]),
        user_service: UserService = Depends(Provide[Container.user_service]),
        reviewer_service: ReviewerService = Depends(Provide[Container.reviewer_service])
):
    options = SearchOptions(limitToAllowedCv=limitToAllowedCv, searchString=searchString, userId=userId, selfSearch=selfSearch, statusToCheck=statusToCheck, onlyMainCv=onlyMainCv)
    print("Options de recherche : ", options)
    user: User = request.state.user
    return cv_service.search(user, options, user_service, reviewer_service)

@router.post("", status_code=201)
@router.post("/", status_code=201)
@inject
async def create(request: Request,
                 cv_data: CVData,
                 cv_service: CVService = Depends(Provide[Container.cv_service])):
    user: User = request.state.user
    cv_service.create(user, cv_data)


@router.put("/{cv_id}")
@inject
async def update(request: Request,
                 cv_data: CVData,
                 cv_service: CVService = Depends(Provide[Container.cv_service])):
    user: User = request.state.user
    cv_service.update(user, cv_data)

@router.put("/{cv_id}/status/{new_status}")
@inject
async def update_status_cv(
        request: Request,
        cv_id: str, new_status: int,
        cv_service: CVService = Depends(Provide[Container.cv_service])
):
    user: User = request.state.user
    cv =  cv_service.find(user, cv_id)
    cv_service.change_status_cv(cv, new_status)


@router.put("/{cv_id}/principal")
@inject
async def define_cv_as_main_cv(
        request: Request,
        cv_id: str,
        cv_service: CVService = Depends(Provide[Container.cv_service]),
        user_service: UserService = Depends(Provide[Container.user_service]),
        reviewer_service: ReviewerService = Depends(Provide[Container.reviewer_service])
):
    user: User = request.state.user
    cv =  cv_service.find(user, cv_id)
    if cv.primary_cv:
        return
    options = SearchOptions(selfSearch=True, pageSize=200, userId=user.id)
    user: User = request.state.user
    lst_cv =  cv_service.search(user, options, user_service, reviewer_service)
    lst_cv_to_update: List[CVData] = []
    for x in lst_cv.elements:
        if x.primary_cv:
            # Need to update it to remove status as primary, but only if previous one was not valid, or if current one is valid
            if x.status == 3:
                if cv.status == 3:
                    lst_cv_to_update.append(x)
                else:
                    print("Un CV valide est déjà défini comme primaire, alors que le cv choisi ne l'est pas")
                    return
            else:
                lst_cv_to_update.append(x)
    for x in lst_cv_to_update:
        x.primary_cv = False
        cv_service.update(user, x)
    cv.primary_cv = True
    cv_service.update(user, cv)
    return

@router.get("/{cv_id}")
@inject
async def find_by_id(
        request: Request,
        cv_id: str,
        cv_service: CVService = Depends(Provide[Container.cv_service]),
):
    user: User = request.state.user
    return cv_service.find(user, cv_id)


@router.delete("/{cv_id}")
@inject
async def delete_by_id(
        request: Request,
        cv_id: str,
        cv_service: CVService = Depends(Provide[Container.cv_service]),
):
    user: User = request.state.user
    return cv_service.delete(user, cv_id)


@router.post("/{cv_id}/generate/{template_id}", response_class=StreamingResponse)
@inject
async def generate_cv(
        request: Request,
        cv_id: str, template_id: str,
        cv_service: CVService = Depends(Provide[Container.cv_service]),
        template_service: TemplateService = Depends(Provide[Container.template_service])
):
    print(f"*************{cv_id} {template_id}")
    user: User = request.state.user
    cv = cv_service.find(user, cv_id)
    
    template = template_service.find(template_id)
    byte_io = template_service.generate(cv, template)
    date = datetime.now().strftime("%Y-%m")
    filename_output = f'{cv.trigram()}_{date}.{template.type.lower()}'
    return StreamingResponse(byte_io,
                             media_type=template.get_media_type(),
                             headers={
                                 # Ajout d'un en-tête pour exposer le nom du fichier
                                 'Access-Control-Expose-Headers': 'Content-Disposition',
                                 # En-tête avec le nom du fichier
                                 'Content-Disposition': 'attachment; filename=' + filename_output
                             })




@router.post("/generate/{template_id}", response_class=StreamingResponse)
@inject
async def generate_cv_customized(template_id: str, cv: CVData,
    # request: Request,
    template_service: TemplateService = Depends(Provide[Container.template_service])
):
    print(f"*************{template_id}  {cv.id}")
    print(cv)
    template = template_service.find(template_id)
    byte_io = template_service.generate(cv, template)
    date = datetime.now().strftime("%Y-%m")
    filename_output = f'{cv.trigram()}_{date}.{template.type.lower()}'
    return StreamingResponse(byte_io,
                             media_type=template.get_media_type(),
                             headers={
                                 # Ajout d'un en-tête pour exposer le nom du fichier
                                 'Access-Control-Expose-Headers': 'Content-Disposition',
                                 # En-tête avec le nom du fichier
                                 'Content-Disposition': 'attachment; filename=' + filename_output
                             })



# @router.post("/parse")  
# @inject
# async def parse_cv(
#         request: Request,
#         file: UploadFile = File(...),  # Using `File` for file uploads
#         firstname: str = Form(...),  # Using `Form` for form data
#         lastname: str = Form(...),
#         cv_service: CVService = Depends(Provide[Container.cv_service]),
# ):
#     print("API call:", firstname, lastname)
#     cv = await cv_service.parse_cv(firstname, lastname, file)
#     return JSONResponse(content=cv)

@router.post("/parse")  
@inject
async def parse_cv(
        request: Request,
        file: UploadFile = File(...),  # Using `File` for file uploads
        firstname: str = Form(...),  # Using `Form` for form data
        lastname: str = Form(...),
        cv_service: CVService = Depends(Provide[Container.cv_service]),
):
    print("API call:", firstname, lastname, file.filename)
    cv = cv_service.parse_cv(firstname, lastname, file)
    return cv

class TestData(BaseModel):
    file: UploadFile = File(...)
    firstname: str
    lastname: str

@router.post("/test")
async def test_form(
    file: UploadFile = File(...),  # Expecting a file
    firstname: str = Form(...),  # Other form data
    lastname: str = Form(...)
):
    print("Test endpoint: ", firstname, lastname, file.filename)  # Access the file's name
    # You can read the file contents or perform other operations here
    return JSONResponse({"status": "success"})