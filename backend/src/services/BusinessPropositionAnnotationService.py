from ..models.BusinessPropositionAnnotation import BusinessPropositionAnnotation
from ..repositories import BusinessPropositionAnnotationRepository
from ..repositories.AnnotationAffectationRepository import AnnotationAffectationRepository


class BusinessPropositionAnnotationService:
    def __init__(self, business_proposition_annotation_repository: BusinessPropositionAnnotationRepository,
                 annotation_affectation_repository: AnnotationAffectationRepository):
        self.business_proposition_annotation_repository = business_proposition_annotation_repository
        self.annotation_affectation_repository = annotation_affectation_repository

    def find(self, id_business_proposition_annotation: str) -> BusinessPropositionAnnotation | None:
        return self.business_proposition_annotation_repository.find(id_business_proposition_annotation)

    def create(self, user_id: str, business_proposition_annotation: BusinessPropositionAnnotation)\
            -> BusinessPropositionAnnotation:
        new_business_proposition_annotation = self.business_proposition_annotation_repository.create(
            business_proposition_annotation
        )
        self.annotation_affectation_repository.update_annotation_id(
            id_user=user_id,
            id_business_proposition_file=new_business_proposition_annotation.id_business_proposition_file,
            annotation_id=new_business_proposition_annotation.id_business_proposition_annotation
        )
        return new_business_proposition_annotation

    def update(self, dto: BusinessPropositionAnnotation) -> BusinessPropositionAnnotation:
        return self.business_proposition_annotation_repository.update(dto)

    def delete(self, business_proposition_annotation_id: str):
        self.business_proposition_annotation_repository.delete(business_proposition_annotation_id)

    def finish_annotation(self, user_id: str, business_proposition_annotation_id: str):
        self.annotation_affectation_repository.update_status(
            id_user=user_id,
            id_business_proposition_file=business_proposition_annotation_id,
            status='annotated'
        )


