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
    mission_name: str
    client: str
    start_date: datetime
    end_date: datetime
    localisation_talan: str
    localisation_client: str
    number_of_workers: int
    mission_length_in_month: int
    number_of_in_person_meetings_per_week: int
    transports: List[Transport]
    number_of_emails_with_attachments_per_week: int
    number_of_emails_without_attachments_per_week: int
    hours_of_visioconference_per_week: int
    camera_on: bool
    computers: List[Computer]
    phones: List[Phones]
    storage_amount_in_terabytes: int
    storage_length_in_month: int
    number_of_backups: int
    storage_provider: str
    storage_location: str
    compute_time: int
    compute_provider: str
    compute_location: str
    compute_device: str
    pages_printed_per_month: int
    print_double_sided: bool
