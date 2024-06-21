from typing import List, Optional

from pydantic import BaseModel
from datetime import datetime
from functools import cmp_to_key


class Comment(BaseModel):
    date: str
    content: str
    active: bool #Active, solved
    dateSolve: Optional[str]
    author: str
    
    def __init__(self, **kwargs):    
        if "dateSolve" not in kwargs :
            kwargs["dateSolve"] = ""
        if "content" not in kwargs :
            kwargs["content"] = "emptyComment"
        if "date" not in kwargs :
            now = datetime.now()
            kwargs["date"] = now.strftime('%d-%m-%Y %H:%M')
        if "active" not in kwargs :
            kwargs["active"] = True
        if "author" not in kwargs :
            kwargs["author"] = "John Doe"
        super().__init__(**kwargs)


    def solve_comment(self):
        self.active = False
        now = datetime.now()
        self.dateSolve =  now.strftime('%d-%m-%Y')
    

class BaseModelWithComments(BaseModel):
    comments: Optional[List[Comment]] | None = []

    # update_order: bool

    def __init__(self, **kw):
        super().__init__(**kw)
        # self.update_order=False

    def get_comments(self):
        # if self.comments and self.update_order:
        #     self.update_order = False
        #     self.sort_comments()
        self.sort_comments()
        return self.comments


    def sort_comments(self):
        self.comments = sorted(self.comments, reverse=True, key=cmp_to_key(comment_sort_order))

    def add_comment(self, text, author):
        if self.comments is None:
            self.comments = []
        self.comments.insert(0, Comment(content=text, author=author))

    def has_comments(self):
        if self.comments is None:
            return False
        else:
            return len(self.comments) > 0

    def has_unresolved_comments(self):
        if self.comments is None:
            return False
        else:
            for comm in self.comments:
                if comm.active:
                    return True
            return False        


def cmp_date(d1: str, d2: str):
    dt1 = datetime.strptime(d1, "%d-%m-%Y %H:%M")
    dt2 = datetime.strptime(d2, "%d-%m-%Y %H:%M")
    if dt1 < dt2:
        return -1
    elif dt2 == dt1:
        return 0
    else:
        return 1


def comment_sort_order(x: Comment, y: Comment):
    if x.active:
        if y.active:
            return cmp_date(x.date, y.date)
        else :
            return 1
    else:
        if y.active:
            return -1
        else:
            return cmp_date(x.date, y.date)
            

class Mission(BaseModelWithComments):
    startDate: str
    endDate: Optional[str]
    company: str
    poste: str
    description: str
    tasks: List[str]
    skills: List[str]
    location: Optional[str]

    def __init__(self, **kwargs):    
        if "location" not in kwargs :
            kwargs["location"] = ""
        super().__init__(**kwargs)


class Language(BaseModel):
    name: str
    level: str


class Education(BaseModel):
    name: str
    year: int


class Certification(BaseModel):
    name: str
    date: str


class SkillsByDomain(BaseModel):
    domain: str
    skills: List[str]


class CVLabels(BaseModel):
    bulletForLanguageLevels: bool
    noSkillDomains: bool
    noCertifications: bool
    anonymized: bool
    noIntroduction: bool
    englishCV: bool

    def to_json(self):
        return {
            "bulletForLanguageLevels": self.bulletForLanguageLevels,
            "noSkillDomains": self.noSkillDomains,
            "noCertifications": self.noCertifications,
            "anonymized": self.anonymized,
            "noIntroduction": self.noIntroduction,
            "englishCV": self.englishCV
        }


class CVData(BaseModel):
    id: str
    firstname: str
    lastname: str
    poste: str
    introduction: str
    missions: List[Mission]
    languages: List[Language]
    educations: List[Education]
    certifications: List[Certification]
    skills: List[SkillsByDomain]
    id_user: Optional[str]
    comm_languages: BaseModelWithComments
    comm_educations: BaseModelWithComments
    comm_certifications: BaseModelWithComments
    comm_skills: BaseModelWithComments
    comm_general: BaseModelWithComments
    label: str
    status: int
    primary_cv: bool
    labelsAnnotation: CVLabels
    originalFormat: str

    def trigram(self):
        if(len(self.lastname[0:2].split(" ")) > 1):
            return (self.firstname[0] + self.lastname.split(" ")[0][0] + self.lastname.split(" ")[1][0]).upper()
        else:
            return (self.firstname[0] + self.lastname[0:2]).upper()
        
    def has_no_unresolved_comments_in_cv(self):
        return not(any(check_elem_has_unresolved_comments(x) for x in self.missions) or
                   check_elem_has_unresolved_comments(self.comm_general) or
                   check_elem_has_unresolved_comments(self.comm_languages) or
                   check_elem_has_unresolved_comments(self.comm_educations) or
                   check_elem_has_unresolved_comments(self.comm_certifications) or
                   check_elem_has_unresolved_comments(self.comm_skills))
    
    def sort_missions(self):
        pass


def check_elem_has_unresolved_comments(elem: BaseModelWithComments):
    if elem is None:
        return False
    else:
        return elem.has_unresolved_comments()

class PartialCVData(BaseModel):
    firstname: Optional[str]
    lastname: Optional[str]
    poste: Optional[str]
    introduction: Optional[str]
    missions: Optional[List[Mission]]
    languages:  Optional[List[Language]]
    educations:  Optional[List[Education]]
    certifications:  Optional[List[Certification]]
    skills:  Optional[List[SkillsByDomain]]
    comm_languages:  Optional[BaseModelWithComments]
    comm_educations:  Optional[BaseModelWithComments]
    comm_certifications:  Optional[BaseModelWithComments]
    comm_skills:  Optional[BaseModelWithComments]
    comm_general:  Optional[BaseModelWithComments]
    label: Optional[str]
    status: Optional[int]
    primary_cv: Optional[bool]
    labelsAnnotation: Optional[CVLabels]
    originalFormat: Optional[str]

    def has_no_unresolved_comments_in_cv(self):
        return not((self.missions is not None and any(check_elem_has_unresolved_comments(x) for x in self.missions)) or
                   (check_elem_has_unresolved_comments(self.comm_languages)) or
                   (check_elem_has_unresolved_comments(self.comm_educations)) or
                   (check_elem_has_unresolved_comments(self.comm_certifications)) or
                   (check_elem_has_unresolved_comments(self.comm_skills)) or
                   check_elem_has_unresolved_comments(self.comm_general))
