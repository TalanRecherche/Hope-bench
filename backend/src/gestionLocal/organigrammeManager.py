import requests
from dotenv import load_dotenv
import os

def createOrganigramme(talan=False) :

    if not talan :
        organigramme = {"user.1@talan.com" : ("user", "1", "manager", "123", "manager.123@talan.com", False), # manager de la personne, si oui ou non la personne manage des gens
                        "user.2@talan.com" : ("user", "2", "manager", "123", "manager.123@talan.com", False),
                        "user.3@talan.com" : ("user", "3", "manager", "123", "manager.123@talan.com", False),
                        "user.4@talan.com" : ("user", "4", "manager", "46", "manager.46@talan.com", False),
                        "user.5@talan.com" : ("user", "5", "", "", "", False),
                        "user.6@talan.com" : ("user", "6", "manager", "46", "manager.46@talan.com", False),
                        "manager.123@talan.com" : ("manager", "123", "", "", "", True),
                        "manager.46@talan.com" : ("manager", "46", "", "", "", True)
                        }
    else :
        list_mail_orga = ["steve.bellart@talan.com",
             "nicolas.de-bufala@talan.com",
             "julie.debuire@talan.com",
             "martine.towanou@talan.com",
             "bintougbe.bayo@talan.com",
             "laurent.cervoni@talan.com"]
        
        list_mail_manager = ["cedric.buffeteau@talan.com",
                     "thierry.jaccottet@talan.com",
                     "anais.boismoreau@talan.com",
                     "sarah.aboke@talan.com",
                     "laurent.gasnier@talan.com",
                     "etienne.borczuch@talan.com",
                     "youssef.azzioui@talan.com",
                     "clara.gayou@talan.com",
                     "sofia.ouahbi@talan.com",
                     "pharath.rajkumar@talan.com",
                     "abdelkrim.haddani@talan.com",
                     "sonia.sayadi@talan.com",
                     "caroline.dobozy@talan.com",
                     "christia.el-tawil@talan.com",
                     "ali.idelhadj@talan.com",
                     "guillaume.mireur@talan.com"]
        
        list_mail_consultant = ["francois.gajic@talan.com",
                        "romane.reibaud@talan.com",
                        "romaryc.pelissie@talan.com",
                        "abderrahmane.sahabi@talan.com",
                        "lea.rielland@talan.com",
                        "nour.hebaili@talan.com",
                        "manon.leclercq@talan.com",
                        "nicolas.sayo@talan.com",
                        "camille.pili@talan.com",
                        "edwin.dumas@talan.com",
                        "julie.salord@talan.com",
                        "julia.pont@talan.com",
                        "cyprien.arethuse@talan.com",
                        "stanislas.rossell@talan.com",
                        "jawad.mlih@talan.com",
                        "victor.lacoste@talan.com",
                        "sabrine.missaoui@talan.com",
                        "sarah.mahmoud@talan.com",
                        "arnaud.airault@talan.com",
                        "elnaz.moghimi@talan.com"]
        
        list_mail = list_mail_orga + list_mail_manager + list_mail_consultant
        organigramme = {}
        # Charger les variables d'environnement depuis le fichier .env
        load_dotenv("backend/src/.env")
        print(os.getenv("MICROSOFT_GRAPH_ID"))

        # Vos informations d'identification
        client_id = os.getenv("MICROSOFT_GRAPH_ID")
        client_secret = os.getenv("MICROSOFT_GRAPH_SECRET")
        tenant = os.getenv("MICROSOFT_GRAPH_TENANT")
        audience = os.getenv("MICROSOFT_GRAPH_AUDIENCE")

        # L'endpoint pour obtenir le token
        token_url = f'https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token'

        # Les données nécessaires pour obtenir le token
        token_data = {
            'grant_type': 'client_credentials',
            'client_id': client_id,
            'client_secret': client_secret,
            'scope': 'https://graph.microsoft.com/.default'  # Spécifiez l'étendue pour laquelle le token est demandé
        }

        # Obtenir le token
        token_r = requests.post(token_url, data=token_data)
        token = token_r.json().get('access_token')

        # Vérifier si le token a été obtenu avec succès
        if not token:
            raise Exception("Impossible d'obtenir le token")

        # Utiliser le token pour faire une requête GET
        headers = {
            'Authorization': f'Bearer {token}',
        }

        # L'URL de l'API que vous voulez accéder

        for people in list_mail :
            api_url = f'https://graph.microsoft.com/v1.0/users/{people}'
            response = requests.get(api_url, headers=headers).json()
            print(response)
            response_manager = requests.get(api_url+"/manager", headers=headers).json()
            is_manager = requests.get(api_url+"/directReports", headers=headers).json().get("value") != []
            if not "error" in response_manager.keys() : 
                organigramme[people] = (response.get("givenName"), response.get("surname"), response_manager.get("givenName"), response_manager.get("surname"), response_manager.get("mail"), is_manager)
            else :
                organigramme[people] = (response.get("givenName"), response.get("surname"), "", "", "", is_manager)

    return organigramme