from ..CVGenerator.CVFakeBuilder import generate_fake_cv
from . import AbstractCVParser
from ...models.CVModels import PartialCVData


class FakeCVParser(AbstractCVParser.AbstractCVParser):

    def _parse_cv(self, text: str,  firstname: str, lastname: str) -> PartialCVData:
        cvData = generate_fake_cv()
        partial = PartialCVData(**cvData.dict())
        partial.firstname = firstname
        partial.lastname = lastname

        return partial
