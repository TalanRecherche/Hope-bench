from pydantic import BaseModel


class Computer(BaseModel):
    id_computer: str
    model: str


class Phone(BaseModel):
    id_phone: str
    model: str


class Transport(BaseModel):
    id_transport: str
    transport_mode: str


class ComputeProvider(BaseModel):
    id_compute_provider: str
    name: str
    region: str


class StorageProvider(BaseModel):
    id_storage_provider: str
    name: str
    region: str


class GPU(BaseModel):
    id: str
    name: str
