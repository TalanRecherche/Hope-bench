from fastapi import APIRouter, Depends, Request
from dependency_injector.wiring import inject, Provide

from ..containers import Container
from ..services.OptionsService import OptionsService

router = APIRouter(
    prefix="/options",
    tags=["options"],
    responses={404: {"description": "Not found"}},
)

@router.get("/computer")
@inject
async def get_all_computers(request: Request,
                             options_service: OptionsService = Depends(Provide[Container.options_service])):
    return options_service.find_all_computers()

@router.get("/phone")
@inject
async def get_all_phones(request: Request,
                          options_service: OptionsService = Depends(Provide[Container.options_service])):
    return options_service.find_all_phones()

@router.get("/transport")
@inject
async def get_all_transports(request: Request,
                             options_service: OptionsService = Depends(Provide[Container.options_service])):
    return options_service.find_all_transports()

@router.get("/compute_provider")
@inject
async def get_all_compute_providers(request: Request,
                                    options_service: OptionsService = Depends(Provide[Container.options_service])):
    return options_service.find_all_compute_providers()

@router.get("/compute_provider/{name}")
@inject
async def get_all_by_name_compute_providers(request: Request,
                                            name: str,
                                            options_service: OptionsService = Depends(Provide[Container.options_service])):
    return options_service.find_all_by_name_compute_provider(name)

@router.get("/storage_provider")
@inject
async def get_all_storage_providers(request: Request,
                                    options_service: OptionsService = Depends(Provide[Container.options_service])):
    return options_service.find_all_storage_providers()

@router.get("/storage_provider/{name}")
@inject
async def get_all_by_name_storage_providers(request: Request,
                                            name: str,
                                            options_service: OptionsService = Depends(Provide[Container.options_service])):
    return options_service.find_all_by_name_storage_provider(name)

