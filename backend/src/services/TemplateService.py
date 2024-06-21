import io

from docxtpl import DocxTemplate
from fastapi import UploadFile

from .CVGenerator.CVContextBuilder import CVContextBuilder
from .CVGenerator.PptxTemplateGenerator import PptxTemplateGenerator
from ..models.CVModels import CVData
from ..models.Template import TemplateType, TemplateFormDto, Template
from ..models.exceptions import NotFoundException
from ..repositories.TemplateRepository import TemplateRepository
import pkg_resources


class TemplateService:
    def __init__(self, template_repository: TemplateRepository):
        self.template_repository = template_repository

    def search(self, active: bool | None) -> [Template]:
        return self.template_repository.find_all(active)

    def find(self, template_id: str) -> Template:
        tpl = self.template_repository.find(template_id)
        if tpl is None:
            raise NotFoundException()
        return tpl

    def create(self, dto: TemplateFormDto, file: UploadFile):
        template = Template(
            id=dto.id,
            name=dto.name,
            type=self._get_template_type(file),
            fileName=file.filename,
            fileBlob=file.file.read(),
            active=dto.active or False
        )
        self.template_repository.create(template)

    def update(self, dto: TemplateFormDto, file: UploadFile | None):
        template = {
            'name': dto.name,
            'active': dto.active
        }
        if file is not None:
            template = {
                'name': dto.name,
                'active': dto.active,
                'type': self._get_template_type(file),
                'fileName': file.filename,
                'fileBlob': file.file.read()
            }
        self.template_repository.save(dto.id, template)

    def _get_template_type(self, file: UploadFile | None, default: TemplateType | None = None):
        if file.filename.endswith('.docx'):
            return TemplateType.DOCX
        if file.filename.endswith('.pptx'):
            return TemplateType.PPTX
        return default

    def delete(self, template_id: str):
        self.template_repository.delete(template_id)

    def generate(self, data: CVData, template: Template) -> io.BytesIO:
        builder = CVContextBuilder(data)
        context = builder.build_context()
        byte_io = io.BytesIO()

        if template.type == TemplateType.DOCX:
            self._generate_docx(context, template, byte_io)
        elif template.type == TemplateType.PPTX:
            self._generate_pptx(context, template, byte_io)
        else:
            raise
        byte_io.seek(0)  # go to the beginning of the file-like object
        return byte_io

    def _generate_docx(self, context: dict, template: Template, output: io.BytesIO):
        tpl = DocxTemplate(io.BytesIO(template.fileBlob))
        print("Version de docxtpl ", pkg_resources.get_distribution("docxtpl").version)
        print("Version de python-docx ", pkg_resources.get_distribution("python-docx").version)
        pkg_resources.get_distribution("docxtpl").version

        tpl.render(context, autoescape=True)
        tpl.save(output)

    def _generate_pptx(self, context: dict, template: Template, output: io.BytesIO):
        generator = PptxTemplateGenerator(io.BytesIO(template.fileBlob), context)
        generator.process(output)
