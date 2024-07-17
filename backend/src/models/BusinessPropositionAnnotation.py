from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, validator


class Transport(BaseModel):
    transport_mode: Optional[str]
    transport_distance: Optional[float]
    average_journeys_per_month: Optional[float]


class Computer(BaseModel):
    model: Optional[str]
    number_provided: Optional[int]
    provided_by_talan: Optional[bool]


class Phones(BaseModel):
    model: Optional[str]
    number_provided: Optional[int]
    provided_by_talan: Optional[bool]


class BusinessPropositionAnnotation(BaseModel):
    id_business_proposition_annotation: Optional[str] = None
    id_business_proposition_file: str
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

    @validator('start_date', 'end_date', pre=True, allow_reuse=True)
    def parse_date(cls, value):
        if value is None:
            return None
        if type(value) == str:
            try:
                return datetime.strptime(value, "%Y-%m-%d")
            except ValueError:
                raise ValueError(f"Date {value} is not in the correct format YYYY-MM-DD")