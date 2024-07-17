
from typing import List
from ..repositories.UserRepository import UserRepository
from ..models.User import User

class UserService:

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def find(self, user_id) -> User | None:
        return self.user_repository.find(user_id)

    def find_underlings(self, user_id) -> [User]:
        return self.user_repository.find_underlings(user_id)

    def get_full_name(self, user_id) -> str | None:
        user = self.user_repository.find(user_id)
        if user is None:
            return None
        return user.first_name + " " + user.last_name
