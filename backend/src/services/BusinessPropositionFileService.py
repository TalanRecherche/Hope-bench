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

    def find_paginated(self, offset: int, limit: int) -> list[BusinessPropositionFile] | None:
        paginated_files = self.business_proposition_file_repository.find_paginated(offset, limit)
        return paginated_files

    def find_number_of_pages(self, page_size: int) -> int:
        return self.business_proposition_file_repository.count() // page_size + 1
