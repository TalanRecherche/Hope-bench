from pydantic import BaseModel


class UserBusinessPropositionTable(BaseModel):
    id_business_proposition: str
    id_user: str