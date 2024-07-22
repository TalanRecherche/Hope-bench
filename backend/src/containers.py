import logging

from .repositories.AnnotationAffectationRepository import AnnotationAffectationRepository
from .repositories.BusinessPropositionAnnotationRepository import BusinessPropositionAnnotationRepository
from .repositories.BusinessPropositionFileRepository import BusinessPropositionFileRepository
from dependency_injector import containers, providers
from dotenv import load_dotenv

from .config import Configuration
from .repositories.UserRepository import UserRepository
from .repositories.database import Database
from .services.UserService import UserService
from .services.BusinessPropositionAnnotationService import BusinessPropositionAnnotationService
from .services.BusinessPropositionFileService import BusinessPropositionFileService

load_dotenv()

logger = logging.getLogger(__name__)


class Container(containers.DeclarativeContainer):
    # includes all modules with @inject annotations
    wiring_config = containers.WiringConfiguration(modules=[".api.users_api", ".api.business_proposition_api", ".api.business_proposition_file_api"])

    db = providers.Singleton(Database, db_url=Configuration.database_url)

    user_repository = providers.Factory(UserRepository, session_factory=db.provided.session)
    business_proposition_annotation_repository = providers.Factory(BusinessPropositionAnnotationRepository, session_factory=db.provided.session)
    business_proposition_file_repository = providers.Factory(BusinessPropositionFileRepository, session_factory=db.provided.session)
    user_business_proposition_table_repository = providers.Factory(AnnotationAffectationRepository, session_factory=db.provided.session)


    user_service = providers.Factory(
        UserService,
        user_repository=user_repository
    )

    business_proposition_service = providers.Factory(
        BusinessPropositionAnnotationService,
        business_proposition_annotation_repository=business_proposition_annotation_repository,
        annotation_affectation_repository=user_business_proposition_table_repository,
    )

    business_proposition_file_service = providers.Factory(
        BusinessPropositionFileService,
        business_proposition_file_repository=business_proposition_file_repository
    )
