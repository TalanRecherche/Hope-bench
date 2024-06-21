import json

import dateparser
from openai.lib.azure import AzureOpenAI
import re

from . import AbstractCVParser
from ...config import OpenAIConfiguration
from ...models.CVModels import CVLabels, PartialCVData, Mission, Language, Education, Certification, SkillsByDomain

custom_functions = [
    {   'type': 'function',
        'function': {
            'name': 'extract_cv_info',
            'description': 'Commence par vérifier chaque phrase, en corrigeant toutes les fautes d\'orthographe, de grammaire, et de conjugaison du texte français de chaque phrase de ce texte, ainsi que les éventuels typo, sans reformuler les phrases.'+
            ' Extrait ensuite les informations de ce Curriculum Vitae pour remplir les champs demandés. Les champs doivent être remplis en Français, même si le document a des éléments en Anglais.',
            'parameters': {
                'type': 'object',
                'properties': {
                    # 'firstname': {'type': 'string', 'description': 'Prénom de la personne'},
                    # 'lastname': {'type': 'string', 'description': 'Nom de famille de la personne'},
                    'poste': {'type': 'string', 'description': 'Métier ou poste actuel de la personne'},
                    'introduction': {'type': 'string', 'description': 'Court résumé professionnel de la personne. Généralement situé au début du CV.'},
                    'missions': {'type': 'array', 'description': 'Liste des missions de la personne. Chaque mission est généralement séparée par des lignes vides, et commence par l\'entreprise, le poste, les dates, et le lieu de la mission. Ces informations sont généralement suivies d\'un descrptif de la mission, ainsi que des compétences et tâches de la mission.', 'items': {
                        'type': 'object', 'properties': {
                            'startDate': {'type': 'string', 'description': 'Date de début de la mission, parfois précédé par le mot "Depuis", format: YYYY-MM-DD'},
                            'endDate': {'type': 'string',
                                        'description': 'Date de fin (facultative) de la mission, format: YYYY-MM-DD'},
                            'company': {'type': 'string', 'description': 'Nom de l\'entreprise de la mission. Présent généralement dans l\'entête de la mission.'},
                            'poste': {'type': 'string', 'description': 'Poste durant la mission'},
                            'location' : {'type': 'string', 'description': 'Lieu de déroulement de la mission. Présent généralement dans l\'entête de la mission. Si pas trouvé, retourner une châine vide.'},
                            'description': {'type': 'string', 'description': 'Description du contenu de la mission'},
                            'tasks': {'type': 'array', 'description': 'Tâches réalisées dans le cadre de la mission. Ces tâches doivent être distinctes de celles présentes dans la section "Compétences" du CV, sauf si elles apparaissent aussi dans cette mission. Il ne doit pas y avoir de doublons avec les compétences présentes pour cette mission, définies dans le champs suivant.', 'items': {
                                'type': 'string', 'description': 'Descritpion de la tâche'
                            }},
                            'skills': {'type': 'array', 'description': 'Compétences utilisées pour cette mission. Ces compétences doivent être distinctes de celles présentes dans la section "Compétences" du CV, sauf si elles apparaissent aussi dans cette mission', 'items': {
                                'type': 'string', 'description': 'Nom de la compétence'
                            }}
                        }
                    }},
                    'languages': {'type': 'array', 'description': 'Langues parlées par la personnes', 'items': {
                        'type': 'object', 'properties': {
                            'name': {'type': 'string', 'description': 'Nom de la langue'},
                            'level': {'type': 'string', 'description': 'Niveau dans la langue. Si le niveau semble exprimé en pastilles, le convertir avec l\'echelle suivante de 1 à 5 pastilles : [Débutant, Intermédiaire, Avancé, Courant, Maternel]'},
                        }
                    }},
                    'educations': {'type': 'array', 'description': 'Ecole, université, ou tout autre diplôme',
                                'items': {
                                    'type': 'object', 'properties': {
                                        'name': {'type': 'string',
                                                    'description': 'Nom de l\'école, université, ou diplôme'},
                                        'year': {'type': 'integer', 'description': 'Année d\'obtention'},
                                    }
                                }},
                    'certifications': {'type': 'array', 'description': 'Certifications obtenues', 'items': {
                        'type': 'object', 'properties': {
                            'name': {'type': 'string', 'description': 'Nom de la certification'},
                            'date': {'type': 'string', 'description': 'Date d\'obtention de la certification, format: YYYY-MM-DD'},
                        }
                    }},
                    'skills': {'type': 'array', 'description': 'Compétences générales de la personnes, regroupées par domaine.', 'items': {
                        'type': 'object', 'properties': {
                            'domain': {'type': 'string', 'description': 'Nom du domaine. Ce nom de domaine doit être présent dans le texte, et ne pas être une reformulation du texte à l\'intérieur. Les compétences définies pour ce domaine sont généralement détaillées sous ce nom de domaine.'},
                            'skills': {'type': 'array', 'description': 'Compétences dans ce domaine', 'items': {
                                'type': 'string', 'description': 'Nom de la compétence'
                            }}
                        }
                    }}
                }
            }
        }
    }
]

back_up_working_spell_checking_custom_functions = [
    {   'type': 'function',
        'function': {
            'name': 'extract_cv_info',
            'description': 'Commence par vérifier chaque phrase, en corrigeant toutes les fautes d\'orthographe, de grammaire, et de conjugaison du texte français de chaque phrase de ce texte, ainsi que les éventuels typo, sans reformuler les phrases.'+
            ' Extrait ensuite les informations de ce Curriculum Vitae pour remplir les champs demandés.',
            'parameters': {
                'type': 'object',
                'properties': {
                    # 'firstname': {'type': 'string', 'description': 'Prénom de la personne'},
                    # 'lastname': {'type': 'string', 'description': 'Nom de famille de la personne'},
                    'poste': {'type': 'string', 'description': 'Métier ou poste actuel de la personne'},
                    'introduction': {'type': 'string', 'description': 'Court résumé professionnel de la personne'},
                    'missions': {'type': 'array', 'description': 'Liste des missions de la personne', 'items': {
                        'type': 'object', 'properties': {
                            'startDate': {'type': 'string', 'description': 'Date de début de la mission, parfois précédé par le mot "Depuis", format: YYYY-MM-DD'},
                            'endDate': {'type': 'string',
                                        'description': 'Date de fin (facultative) de la mission, format: YYYY-MM-DD'},
                            'company': {'type': 'string', 'description': 'Nom de l\'entreprise de la mission'},
                            'poste': {'type': 'string', 'description': 'Poste durant la mission'},
                            'location' : {'type': 'string', 'description': 'Lieu de déroulement de la mission'},
                            'description': {'type': 'string', 'description': 'Description du contenu de la mission'},
                            'tasks': {'type': 'array', 'description': 'Tasks executed during the mission. They can\'t be inside the skills sections unless ', 'items': {
                                'type': 'string', 'description': 'Description of the task'
                            }},
                            'skills': {'type': 'array', 'description': 'Skills used during the mission', 'items': {
                                'type': 'string', 'description': 'Name of the skill'
                            }}
                        }
                    }},
                    'languages': {'type': 'array', 'description': 'Langues parlées par la personnes', 'items': {
                        'type': 'object', 'properties': {
                            'name': {'type': 'string', 'description': 'Nom de la langue'},
                            'level': {'type': 'string', 'description': 'Niveau dans la langue'},
                        }
                    }},
                    'educations': {'type': 'array', 'description': 'Ecole, université, ou tout autre diplôme',
                                'items': {
                                    'type': 'object', 'properties': {
                                        'name': {'type': 'string',
                                                    'description': 'Nom de l\'école, université, ou diplôme'},
                                        'year': {'type': 'integer', 'description': 'Année d\'obtention'},
                                    }
                                }},
                    'certifications': {'type': 'array', 'description': 'Certifications obtenues', 'items': {
                        'type': 'object', 'properties': {
                            'name': {'type': 'string', 'description': 'Nom de la certification'},
                            'date': {'type': 'string', 'description': 'Date d\'obtention de la certification, format: YYYY-MM-DD'},
                        }
                    }},
                    'skills': {'type': 'array', 'description': 'Compétences générales de la personnes, regroupées par domaine', 'items': {
                        'type': 'object', 'properties': {
                            'domain': {'type': 'string', 'description': 'Nom du domaine'},
                            'skills': {'type': 'array', 'description': 'Compétences dans ce domaine', 'items': {
                                'type': 'string', 'description': 'Nom de la compétence'
                            }}
                        }
                    }}
                }
            }
        }
    }
]


class OpenAICVParser(AbstractCVParser.AbstractCVParser):

    def __init__(self, config: OpenAIConfiguration):
        self.config = config
        super().__init__()

    def _parse_cv(self, text: str,  firstname: str, lastname: str) -> PartialCVData:

        # print(text)
        print("Name : ", firstname, " ", lastname)
        client = AzureOpenAI(
            api_key=self.config.api_key,
            api_version=self.config.api_version,
            azure_deployment=self.config.model,
            azure_endpoint=self.config.endpoint
        )
        
        with open('exampleRequest.txt', 'w') as f:
            for x in text:
                f.write(x)
        
        text = self.try_change_pov_first_to_third(text)
        with open('exampleRequestMidTreatment.txt', 'w') as f:
            for x in text:
                f.write(x)

        # text = self.try_anonymize(text)
        # Anonymize seems to destroy the str, need to check and fix this

        text = self.try_anonymize_with_known_name(text, firstname, lastname)

        with open('exampleRequestPostTreatment.txt', 'w') as f:
            for x in text:
                f.write(x)

        response = client.chat.completions.create(
            model=self.config.model,
            messages=[{'role': 'user', 'content': text}],
            tools=custom_functions,
            tool_choice='auto',
            temperature=0.1,
            top_p=0.95,
            frequency_penalty=0,
            presence_penalty=0,
            stop=None
        )

        response_message = response.choices[0].message
        if response_message.tool_calls[0].function:
            cv_json = json.loads(response_message.tool_calls[0].function.arguments)
            return self.cv_json_to_partial(cv_json)
        else:
            raise Exception('No function call found in response')

    def cv_json_to_partial(self, cv_json) -> PartialCVData:
        missions = cv_json.get('missions')
        languages = cv_json.get('languages')
        educations = cv_json.get('educations')
        certifications = cv_json.get('certifications')
        skills = cv_json.get('skills')
        cvData = PartialCVData(
            # firstname=cv_json.get('firstname'),
            # lastname=cv_json.get('lastname'),
            firstname="",
            lastname="",
            poste=cv_json.get('poste'),
            introduction=cv_json.get('introduction'),
            missions=None if missions is None else [Mission(**a) for a in missions],
            languages=None if languages is None else [Language(**a) for a in languages],
            educations=None if educations is None else [Education(**a) for a in educations],
            certifications=None if certifications is None else[Certification(**a) for a in certifications],
            skills=None if skills is None else [SkillsByDomain(**a) for a in skills],
            comm_languages=None,
            comm_educations=None,
            comm_certifications=None,
            comm_skills=None,
            comm_general=None,
            label=" ",
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
        if cvData.missions is not None:
            for mission in cvData.missions:
                mission.startDate = self.try_format_date(mission.startDate)
                mission.endDate = self.try_format_date(mission.endDate)
        if cvData.certifications is not None:
            for certification in cvData.certifications:
                certification.date = self.try_format_date(certification.date)

        return cvData

    def try_format_date(self, strDate: str | None) -> str | None:
        try:
            if strDate:
                date = dateparser.parse(strDate)
                return date.strftime("%Y-%m-%d")
        except Exception as e:
            print(f"Failed to parse date {strDate} : {e}")
        return None
    
    def try_change_pov_first_to_third(self, strFullText: str | None) -> str | None:
        try:

            raw_text = strFullText
            client = AzureOpenAI(
                api_key=self.config.api_key,
                api_version=self.config.api_version,
                azure_deployment=self.config.model,
                azure_endpoint=self.config.endpoint
            )

            response = client.chat.completions.create(
                model=self.config.model,
                messages=[{'role': 'user', 'content': "Dans le texte qui va t'être donné, transforme toute phrase à la 1ere personne en une phrase à la 3eme personne, sans reformuler le texte. Ne retire aucune ligne, même si la ligne ne contient pas de texte. Le texte est le suivant : \n" + strFullText}],
                temperature=0.1,
                top_p=0.95,
                frequency_penalty=0,
                presence_penalty=0,
                stop=None
            )

            return response.choices[0].message.content

        except Exception as e:
            print(f"Failed to change to third person : {e}")
        return None

    def try_anonymize(self, strFullText: str | None) -> str | None:
        try: 
            if strFullText:
                # Find name and surname
                # Compute trigram
                # Parse in four rounds : Name + Surname, Surname + name, name, surname. Replace with trigramm each time.

                raw_text = strFullText
                client = AzureOpenAI(
                    api_key=self.config.api_key,
                    api_version=self.config.api_version,
                    azure_deployment=self.config.model,
                    azure_endpoint=self.config.endpoint
                )

                response = client.chat.completions.create(
                    model=self.config.model,
                    messages=[{'role': 'user', 'content': "Donne moi le prénom et nom de la personne à qui appartient ce CV. Ne répond que le prénom puis le nom. Le texte est le suivant : \n" + strFullText}],
                    temperature=0.1,
                    top_p=0.95,
                    frequency_penalty=0,
                    presence_penalty=0,
                    stop=None
                )
                fullname = response.choices[0].message.content
                name = fullname.split(" ")[0]
                surname = " ".join(fullname.split(" ")[1:])

                trigram = name[0]
                if len(surname.split(" ")) == 1:
                    trigram +=  surname.replace(" ", "")[0:2]
                else:
                    trigram +=  surname.split(" ")[0][0]
                    trigram +=  surname.split(" ")[1][0]

                trigram = trigram.upper()
                if len(name+ surname) > 0:
                    raw_text = re.sub(name + " " + surname, trigram, raw_text, flags=re.IGNORECASE)
                    raw_text = re.sub(surname + " " + name, trigram, raw_text, flags=re.IGNORECASE)
                    if len(name) > 0:
                        raw_text = re.sub(name, trigram, raw_text, flags=re.IGNORECASE)
                    if len(surname) > 0:
                        raw_text = re.sub(surname, trigram, raw_text, flags=re.IGNORECASE)

                return name + " " +  surname + "\n" + raw_text

        except Exception as e:
            print(f"Failed to anonymize text : {e}")
        return None
    
    def try_anonymize_with_known_name(self, strFullText: str | None, firstname: str, lastname: str) -> str | None:
        try: 
            if strFullText:
                # Find name and surname
                # Compute trigram
                # Parse in four rounds : Name + Surname, Surname + name, name, surname. Replace with trigramm each time.

                raw_text = strFullText

                trigram = firstname[0]
                if len(lastname.split(" ")) == 1:
                    trigram +=  lastname.replace(" ", "")[0:2]
                else:
                    trigram +=  lastname.split(" ")[0][0]
                    trigram +=  lastname.split(" ")[1][0]

                trigram = trigram.upper()
                if len(firstname+ lastname) > 0:
                    raw_text = re.sub(firstname + " " + lastname, trigram, raw_text, flags=re.IGNORECASE)
                    raw_text = re.sub(lastname + " " + firstname, trigram, raw_text, flags=re.IGNORECASE)
                    if len(firstname) > 0:
                        raw_text = re.sub(firstname, trigram, raw_text, flags=re.IGNORECASE)
                    if len(lastname) > 0:
                        raw_text = re.sub(lastname, trigram, raw_text, flags=re.IGNORECASE)

                return firstname + " " +  lastname + "\n" + raw_text

        except Exception as e:
            print(f"Failed to anonymize text : {e}")
        return None

