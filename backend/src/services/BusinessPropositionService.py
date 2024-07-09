from ..models.BusinessProposition import BusinessProposition
from ..models.User import User
from ..repositories import BusinessPropositionRepository
from ..repositories.UserBusinessPropositionTableRepository import UserBusinessPropositionTableRepository


class BusinessPropositionService:
    def __init__(self, business_proposition_repository: BusinessPropositionRepository,
                 user_business_proposition_table_repository: UserBusinessPropositionTableRepository):
        self.business_proposition_repository = business_proposition_repository
        self.user_business_proposition_table_repository = user_business_proposition_table_repository

    def find(self, id_business_proposition: str) -> BusinessProposition | None:
        return self.business_proposition_repository.find(id_business_proposition)

    def create(self, dto: BusinessProposition, user_id: str) -> BusinessProposition:
        new_business_proposition = self.business_proposition_repository.create(dto)
        self.user_business_proposition_table_repository.create(new_business_proposition.id_business_proposition, user_id)
        return new_business_proposition

    def update(self, dto: BusinessProposition) -> BusinessProposition:
        return self.business_proposition_repository.update(dto)

    def delete(self, business_proposition_id: str):
        self.business_proposition_repository.delete(business_proposition_id)



