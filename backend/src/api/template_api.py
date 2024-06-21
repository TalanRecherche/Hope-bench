""" This module contains the API for the curriculum vitae creation"""
import io

from dependency_injector.wiring import inject, Provide
from fastapi import APIRouter, Depends, Form, UploadFile, File, Request
from fastapi.responses import StreamingResponse

from .auth import check_role, has_role
from ..containers import Container
from ..models.Template import TemplateFormDto
from ..models.User import Roles
from ..services.CVGenerator.CVFakeBuilder import generate_fake_cv
from ..services.TemplateService import TemplateService

router = APIRouter(
    prefix="/templates",
    tags=["templates"],
    responses={404: {"description": "Not found"}},
)


@router.get("")
@router.get("/")
@inject
async def search(request: Request,
                 active: bool | None = None,
                 template_service: TemplateService = Depends(Provide[Container.template_service])):
    if has_role(Roles.template_manager, request):
        templates = template_service.search(active)
    else:
        templates = template_service.search(True)
    return [
        {
            'id': template.id,
            'name': template.name,
            'type': template.type,
            'active': template.active,
            'fileName': template.fileName,
        }
        for template in templates
    ]


@router.post("", status_code=201)
@router.post("/", status_code=201)
@inject
async def create(
        request: Request,
        id=Form(), name=Form(), active=Form(), file: UploadFile = File(),
        template_service: TemplateService = Depends(Provide[Container.template_service])
):
    check_role(Roles.template_manager, request)
    dto = TemplateFormDto(id=id, name=name, active=active)
    template_service.create(dto, file)


@router.put("/{template_id}")
@inject
async def update(
        request: Request,
        template_id: str, name=Form(), active=Form(), file: UploadFile | None = None,
        template_service: TemplateService = Depends(Provide[Container.template_service])
):
    check_role(Roles.template_manager, request)
    dto = TemplateFormDto(id=template_id, name=name, active=active)
    template_service.update(dto, file)


@router.delete("/{template_id}")
@inject
async def delete(
        request: Request,
        template_id: str,
        template_service: TemplateService = Depends(Provide[Container.template_service])
):
    check_role(Roles.template_manager, request)
    return template_service.delete(template_id)


@router.get("/{template_id}/download", response_class=StreamingResponse)
@inject
async def download(
        request: Request,
        template_id: str,
        generate: bool = False,
        template_service: TemplateService = Depends(Provide[Container.template_service])
):
    check_role(Roles.template_manager, request)
    template = template_service.find(template_id)
    if generate is True:
        cv = generate_fake_cv()
        byte_io = template_service.generate(cv, template)
        filename = f"fake-{template.fileName}"
    else:
        byte_io = io.BytesIO(template.fileBlob)
        filename = template.fileName

    return StreamingResponse(byte_io,
                             media_type=template.get_media_type(),
                             headers={
                                 # Ajout d'un en-tête pour exposer le nom du fichier
                                 'Access-Control-Expose-Headers': 'Content-Disposition',
                                 # En-tête avec le nom du fichier
                                 'Content-Disposition': 'attachment; filename=' + filename
                             })
