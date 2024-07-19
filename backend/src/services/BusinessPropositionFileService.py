from ..models.BusinessPropositionFile import BusinessPropositionFile
from ..repositories import BusinessPropositionFileRepository


class BusinessPropositionFileService:
    def __init__(self, business_proposition_file_repository: BusinessPropositionFileRepository):
        self.business_proposition_file_repository = business_proposition_file_repository

    def find(self, id_business_proposition_file: str) -> BusinessPropositionFile | None:
        return self.business_proposition_file_repository.find(id_business_proposition_file)

    def create(self, business_proposition_file: BusinessPropositionFile)\
            -> BusinessPropositionFile:
        new_business_proposition_file = self.business_proposition_file_repository.create(
            business_proposition_file
        )
        return new_business_proposition_file

    def update(self, dto: BusinessPropositionFile) -> BusinessPropositionFile:
        return self.business_proposition_file_repository.update(dto)

    def delete(self, business_proposition_file_id: str):
        self.business_proposition_file_repository.delete(business_proposition_file_id)
