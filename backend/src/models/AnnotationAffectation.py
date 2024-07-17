from pydantic import BaseModel


class AnnotationAffectation(BaseModel):
    id_business_proposition_annotation: str
    id_user: str