from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class Transport(BaseModel):
    transport_mode: str
    transport_distance: float
    average_journeys_per_month: float


class Computer(BaseModel):
    model: str
    number_provided: int
    provided_by_talan: bool


class Phones(BaseModel):
    model: str
    number_provided: int
    provided_by_talan: bool


class BusinessProposition(BaseModel):
    id_business_proposition: Optional[str] = None
    mission_name: Optional[str] = None
    client: Optional[str] = None
    start_date:  Optional[datetime] = None
    end_date:  Optional[datetime] = None
    localisation_talan: Optional[str] = None
    localisation_client: Optional[str] = None
    number_of_workers: Optional[int] = None
    mission_length_in_month: Optional[int] = None
    number_of_in_person_meetings_per_week: Optional[int] = None
    transports:  Optional[List[Transport]] = None
    number_of_emails_with_attachments_per_week: Optional[int] = None
    number_of_emails_without_attachments_per_week: Optional[int] = None
    hours_of_visioconference_per_week: Optional[int] = None
    camera_on: Optional[bool] = None
    computers:  Optional[List[Computer]] = None
    phones:  Optional[List[Phones]] = None
    storage_amount_in_terabytes: Optional[int] = None
    storage_length_in_month: Optional[int] = None
    number_of_backups: Optional[int] = None
    storage_provider: Optional[str] = None
    storage_location: Optional[str] = None
    compute_time: Optional[int] = None
    compute_provider: Optional[str] = None
    compute_location: Optional[str] = None
    compute_device: Optional[str] = None
    pages_printed_per_month: Optional[int] = None
    print_double_sided: Optional[bool] = None
