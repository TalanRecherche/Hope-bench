from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class AnnotationAffectation(BaseModel):
    id_business_proposition_file: str
    id_user: str
    id_business_proposition_annotation: Optional[str]
    status: Enum('status', ['assigned', 'in-progress', 'annotated', 'verified']) = 'assigned'
    last_update: Optional[datetime]
