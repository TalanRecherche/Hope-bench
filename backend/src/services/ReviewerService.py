from ..repositories.ReviewersRepository import ReviewerRepository

class ReviewerService:

    def __init__(self, reviewer_repository: ReviewerRepository):
        self.reviewer_repository = reviewer_repository

    def find_ids_reviewed_by_id(self, id):
        return self.reviewer_repository.find_ids_reviewed_by_id(id)