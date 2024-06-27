import logging

from .repositories.ReviewersRepository import ReviewerRepository
from .services.ReviewerService import ReviewerService
from dependency_injector import containers, providers
from dotenv import load_dotenv

from .config import Configuration
from .repositories.UserRepository import UserRepository
from .repositories.database import Database
from .services.UserService import UserService

load_dotenv()

logger = logging.getLogger(__name__)


class Container(containers.DeclarativeContainer):
    # includes all modules with @inject annotations
    wiring_config = containers.WiringConfiguration(modules=[".api.users_api"])

    db = providers.Singleton(Database, db_url=Configuration.database_url)

    user_repository = providers.Factory(UserRepository, session_factory=db.provided.session)
    reviewer_repository = providers.Factory(ReviewerRepository, session_factory=db.provided.session)

    user_service = providers.Factory(
        UserService,
        user_repository=user_repository
    )
    
    reviewer_service = providers.Factory(
        ReviewerService,
        reviewer_repository=reviewer_repository
    )