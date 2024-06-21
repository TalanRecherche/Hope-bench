import logging

from .repositories.ReviewersRepository import ReviewerRepository
from .services.ReviewerService import ReviewerService
from dependency_injector import containers, providers
from dotenv import load_dotenv

from .config import Configuration
from .services.CVParser.FakeCVParser import FakeCVParser
from .services.CVParser.OpenAICVParser import OpenAICVParser
from .repositories.CVRepository import CVRepository
from .repositories.TemplateRepository import TemplateRepository
from .repositories.UserRepository import UserRepository
from .repositories.database import Database
from .services.CVService import CVService
from .services.TemplateService import TemplateService
from .services.UserService import UserService

load_dotenv()

logger = logging.getLogger(__name__)


class Container(containers.DeclarativeContainer):
    # includes all modules with @inject annotations
    wiring_config = containers.WiringConfiguration(modules=[".api.cv_api", ".api.template_api", ".api.users_api"])

    db = providers.Singleton(Database, db_url=Configuration.database_url)

    cv_repository = providers.Factory(CVRepository, session_factory=db.provided.session)
    template_repository = providers.Factory(TemplateRepository, session_factory=db.provided.session)
    user_repository = providers.Factory(UserRepository, session_factory=db.provided.session)
    reviewer_repository = providers.Factory(ReviewerRepository, session_factory=db.provided.session)

    if Configuration.openai is None:
        logging.warning("OpenAIConfiguration is not set, using FakeCVParser")
        cv_parser = providers.Factory(FakeCVParser)
    else:
        logging.warning("OpenAIConfiguration is set, using OpenAICVParser")
        cv_parser = providers.Factory(OpenAICVParser, config=Configuration.openai)

    template_service = providers.Factory(
        TemplateService,
        template_repository=template_repository
    )
    cv_service = providers.Factory(
        CVService,
        cv_repository=cv_repository,
        cv_parser=cv_parser
    )

    user_service = providers.Factory(
        UserService,
        user_repository=user_repository
    )
    
    reviewer_service = providers.Factory(
        ReviewerService,
        reviewer_repository=reviewer_repository
    )