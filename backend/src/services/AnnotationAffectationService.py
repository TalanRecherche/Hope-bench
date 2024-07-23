from ..models.AnnotationAffectation import AnnotationAffectation


class AnnotationAffectationService:
    def __init__(self, annotation_affectation_repository):
        self.annotation_affectation_repository = annotation_affectation_repository

    def get_annotation_affectation(self, user_id: str, business_proposition_file_id: str)\
            -> AnnotationAffectation | None:
        return self.annotation_affectation_repository.read(user_id, business_proposition_file_id)

    def get_annotation_affectations_by_user(self, user_id: str) -> list[AnnotationAffectation]:
        return self.annotation_affectation_repository.get_annotation_affectations_by_user(user_id)

    def get_annotation_affectations_by_file(self, business_proposition_file_id) -> list[AnnotationAffectation]:
        return self.annotation_affectation_repository.get_annotation_affectations_by_file(business_proposition_file_id)

    def get_annotation_affectations_by_status(self, status):
        return self.annotation_affectation_repository.get_annotation_affectations_by_status(status)

    def create_annotation_affectation(self, annotation_affectation: AnnotationAffectation)\
            -> AnnotationAffectation | None:
        return self.annotation_affectation_repository.create_annotation_affectation(annotation_affectation)

    def delete_annotation_affectation(self, user_id: str, business_proposition_file_id: str):
        return self.annotation_affectation_repository.delete_annotation_affectation(
            user_id=user_id,
            business_proposition_file_id=business_proposition_file_id
        )
