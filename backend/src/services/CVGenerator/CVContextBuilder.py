from datetime import date

import dateutil.parser

from ...models.CVModels import CVData
from ...models.Lang import Lang


def _str_to_date(s: str) -> date | None:
    if s:
        return dateutil.parser.parse(s)
    return None


def _year_month(s: str):
    d = _str_to_date(s)
    if d:
        return d.strftime("%Y-%m")
    return ''


def _year(s: str):
    d = _str_to_date(s)
    if d:
        return d.year
    return None


def _dates(start: str, end: str, lang: Lang):
    ymStart = _year_month(start)
    if end is None or end == '':
        if lang == Lang.FR:
            return 'Depuis {0}'.format(ymStart)
        else:
            return 'Since {0}'.format(ymStart)
    else:
        return '{0} - {1}'.format(ymStart, _year_month(end))


class CVContextBuilder:

    def __init__(self, cv_data: CVData, lang: Lang = Lang.FR):
        self.cv_data = cv_data
        self.lang = lang


    def _build_missions(self):
        return [
            # All fields in mission +
            mission.dict() | {
                # year-month dates
                'dates': _dates(mission.startDate, mission.endDate, self.lang)
            }
            for mission in self.cv_data.missions
        ]

    def _build_certifications(self):
        return [
            certif.dict() | {
                'year': _year(certif.date),
            }
            for certif in self.cv_data.certifications
        ]

    def build_context(self):
        return {
            'firstname': self.cv_data.firstname,
            'lastname': self.cv_data.lastname,
            'trigram': self.cv_data.trigram(),
            'poste': self.cv_data.poste,
            'introduction': self.cv_data.introduction,
            'skills_by_domain': self.cv_data.skills,
            'educations': self.cv_data.educations,
            'languages': self.cv_data.languages,
            'certifications': self._build_certifications(),
            'missions': self._build_missions(),
            'comm_languages': self.cv_data.comm_languages,
            'comm_educations': self.cv_data.comm_educations,
            'comm_certifications': self.cv_data.comm_certifications,
            'comm_skills': self.cv_data.comm_skills,
            'comm_general': self.cv_data.comm_general,
            'label': self.cv_data.label,
            'status': self.cv_data.status
        }
