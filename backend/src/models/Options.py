from uuid import UUID

from pydantic import BaseModel


class Computer(BaseModel):
    id_computer: UUID
    model: str


class Phone(BaseModel):
    id_phone: UUID
    model: str


class Transport(BaseModel):
    id_transport: UUID
    transport_mode: str


class ComputeProvider(BaseModel):
    id_compute_provider: UUID
    name: str
    region: str


class StorageProvider(BaseModel):
    id_storage_provider: UUID
    name: str
    region: str


class GPU(BaseModel):
    id: UUID
    name: str
