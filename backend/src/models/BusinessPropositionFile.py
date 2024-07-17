from datetime import datetime

from pydantic import BaseModel


class BusinessPropositionFile(BaseModel):
    id_business_proposition: str
    file_name: str
    format: str
    confidential: bool
    added_at: datetime
    data: bytes
