from enum import Enum
from typing import List


class Roles(Enum):
    template_manager = 'template_manager'
    manager = 'manager'


class User:
    id: str
    roles: List[Roles]
    first_name: str
    last_name: str
    mail: str
    first_name_manager: str
    last_name_manager: str
    mail_manager: str

    def __init__(self, id: str, roles: List[Roles], first_name: str, last_name : str, mail: str | None, first_name_manager: str | None, last_name_manager:str | None, mail_manager:str | None):
        self.id = id
        self.roles = roles
        self.first_name = first_name
        self.last_name = last_name
        self.mail = mail
        self.first_name_manager = first_name_manager
        self.last_name_manager = last_name_manager
        self.mail_manager = mail_manager

    def has_role(self, role: Roles) -> bool:
        return role in self.roles
