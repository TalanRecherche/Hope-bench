import logging
import os

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


def getConfig(key: str, default=None, required=True):
    value = os.getenv(key)
    if not value:
        logger.warning(f"Config variable {key} is not set")
        if required is True:
            raise Exception(f"Config variable {key} is not set")
    return value or default


class AuthConfiguration:
    def __init__(self):
        self.server_url = getConfig("KEYCLOAK_SERVER_URL")
        # Fix bug config with keycloak
        if not self.server_url.endswith('/'):
            self.server_url += '/'
        self.realm = getConfig("KEYCLOAK_REALM")
        self.authorization_url = getConfig("KEYCLOAK_AUTHORIZATION_URL")
        self.token_url = getConfig("KEYCLOAK_TOKEN_URL")
        self.client_front_id = getConfig("KEYCLOAK_CLIENT_FRONT_ID")

class Configuration:
    database_url = getConfig("DATABASE_URL")
    auth = AuthConfiguration()
