
from typing import List
from ..services import ReviewerService
from ..repositories.UserRepository import UserRepository
from ..models.User import User

class UserService:

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def find(self, user_id) -> User | None:
        return self.user_repository.find(user_id)

    def find_underlings(self, user_id) -> [User]:
        return self.user_repository.find_underlings(user_id)

    def find_reviewed_and_underlings_id(self, userId: str, reviewer_service: ReviewerService) -> List[str]:
        return self.user_repository.find_reviewed_and_underlings_id(userId, reviewer_service)
    
    def get_full_name(self, user_id) -> str:
        user = self.user_repository.find(user_id)
        return user.firstname + " " + user.lastname
