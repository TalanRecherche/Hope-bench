from enum import Enum
from typing import AnyStr

from pydantic import BaseModel


class TemplateType(str, Enum):
    PPTX = 'PPTX'
    DOCX = 'DOCX'


class TemplateFormDto(BaseModel):
    id: str
    name: str
    active: bool


class Template(BaseModel):
    id: str
    name: str
    type: TemplateType
    fileName: str
    fileBlob: AnyStr
    active: bool

    def get_media_type(self) -> str | None:
        if self.type == TemplateType.DOCX:
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        if self.type == TemplateType.PPTX:
            return 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        return None
