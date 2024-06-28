from ..models.BusinessProposition import BusinessProposition
from ..models.User import User
from ..repositories import BusinessPropositionRepository


class BusinessPropositionService:
    def __init__(self, business_proposition_repository: BusinessPropositionRepository):
        self.business_proposition_repository = business_proposition_repository

    def find(self, id_business_proposition: str) -> BusinessProposition | None:
        return self.business_proposition_repository.find(id_business_proposition)

    def create(self, dto: BusinessProposition) -> BusinessProposition:
        return self.business_proposition_repository.create(dto)

    def update(self, dto: BusinessProposition) -> BusinessProposition:
        return self.business_proposition_repository.update(dto)

    def delete(self, business_proposition_id: str):
        self.business_proposition_repository.delete(business_proposition_id)



