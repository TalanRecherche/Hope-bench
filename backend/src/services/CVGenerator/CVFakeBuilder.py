from random import randrange

from faker import Faker

from ...models.CVModels import CVLabels, Language, Education, Certification, SkillsByDomain, Mission, CVData, BaseModelWithComments


def generate_fake_mission(faker: Faker) -> Mission:
    return Mission(
        startDate=faker.date(),
        endDate=faker.random_element(elements=(faker.date(), None)),
        company=faker.company(),
        poste=faker.job(),
        description=faker.text(),
        tasks=[faker.catch_phrase() for _ in range(randrange(4, 8))],
        skills=[faker.word() for _ in range(randrange(4, 8))],
        location=faker.city()
    )


def generate_fake_language(faker: Faker) -> Language:
    return Language(
        name=faker.language_code(),
        level=faker.random_element(elements=('Bilingue', 'Courant', 'Professionnel'))
    )


def generate_fake_education(faker: Faker) -> Education:
    return Education(
        name=faker.name(),
        year=faker.random_int(min=1990, max=2030),
    )


def generate_fake_certification(faker: Faker) -> Certification:
    return Certification(
        name=faker.name(),
        date=faker.date()
    )


def generate_fake_skill(faker: Faker) -> SkillsByDomain:
    return SkillsByDomain(
        domain=faker.name(),
        skills=[faker.word() for _ in range(randrange(4, 8))]
    )


def generate_fake_cv():
    faker = Faker()
    return CVData(
        id='fake_id',
        firstname=faker.first_name(),
        lastname=faker.last_name(),
        poste=faker.job(),
        introduction=faker.paragraph(5),
        missions=[generate_fake_mission(faker) for _ in range(3)],
        languages=[generate_fake_language(faker) for _ in range(3)],
        educations=[generate_fake_education(faker) for _ in range(2)],
        certifications=[generate_fake_certification(faker) for _ in range(4)],
        skills=[generate_fake_skill(faker) for _ in range(5)],
        id_user='fake_id',
        comm_languages=BaseModelWithComments(comments=[]),
        comm_educations=BaseModelWithComments(comments=[]),
        comm_certifications=BaseModelWithComments(comments=[]),
        comm_skills=BaseModelWithComments(comments=[]),
        comm_general=BaseModelWithComments(comments=[]),
        label="FakeCV",
        status=0, 
        primary_cv=False,
        labelsAnnotation= CVLabels( bulletForLanguageLevels= False,
                                   noSkillDomains= False,
                                   noCertifications= False,
                                   anonymized= False,
                                   noIntroduction= False, 
                                   englishCV= False),
        originalFormat="docx"
    )
