from keycloak import KeycloakAdmin
from sqlalchemy import create_engine, text
from organigrammeManager import createOrganigramme

talan=True

organigramme = createOrganigramme(talan)
print(organigramme)

ids = {}

###--------------METTRE LES INFORMATIONS DANS LE KEYCLOAK-------------------------------------------------
# Initialiser la connexion à Keycloak en tant qu'administrateur
keycloak_admin = KeycloakAdmin(server_url="https://kccv.azurewebsites.net/auth",
                               username="admin",
                               password="CV4Talan:-)",
                               realm_name="cvproai")

#Récupération des ID des rôle de cvproai-front
#Recupération du client 'cvproai-front'
clients = keycloak_admin.get_clients()
for c in clients :
    if c["clientId"] == 'cvproai-front' :
        cvproaiFront = c
        break

# Rechercher les rôles dans le client cvproai-front
list_roles = keycloak_admin.get_client_roles(cvproaiFront['id'])
roles = {}
for r in list_roles :
    roles[r['name']] = r

# Récupérer l'ID de l'utilisateur
'''manager = keycloak_admin.get_users(query={"username": "manager"})
if not manager:
    print("User not found.")
    exit()
manager_id = manager[0]['id']

# Obtenir les rôles effectifs de l'utilisateur
effective_roles = keycloak_admin.get_realm_roles_of_user(user_id=manager_id)
print("Effective roles (including inherited roles) for the user are:")
for role in effective_roles:
    print(role['name'])
    print(role['id'])'''

for user in organigramme.keys() :
    # Rechercher l'utilisateur par nom d'utilisateur
    username = user.split("@")[0]
    users = keycloak_admin.get_users(query={"username": username})

    # Vérifier si l'utilisateur existe
    if users:
        print(f"L'utilisateur {username} existe déjà.")
    else:
        print(f"L'utilisateur {username} n'existe pas.")
        # Créer un nouvel utilisateur
        new_user = {
            "username": username,
            "email": f"{user}",
            "firstName" : organigramme[user][0],
            "lastName" : organigramme[user][1],
            "enabled": True,
            "credentials": [{"type": "password", "value": username, "temporary": True}]
        }
        user_id = keycloak_admin.create_user(payload=new_user)
        print("New user created with ID:", user_id)

        #On stocke l'id pour la bdd
        ids[user] = user_id
        
        if organigramme[user][5] : #Si la personne manage, on lui donne la vue manager sur cvproai
            print("Give manager view to ", username)
            keycloak_admin.assign_client_role(client_id=cvproaiFront['id'], user_id=user_id, roles=[roles["manager"]])

###--------------METTRE LES INFORMATIONS DANS LA BDD------------------------------------------------------

from sqlalchemy import create_engine

# Paramètres de connexion
server = 'cvproaibdd.postgres.database.azure.com'
database = 'cvproaiprod'
username = 'cvproaiadmin'
password = 'pergo123!'
port = 5432  # Port par défaut pour PostgreSQL

print(ids)
print(organigramme)

# Chaîne de connexion SQLAlchemy
#connection_string = f"postgresql://{username}:{password}@{server}:{port}/{database}"
connection_string = 'postgresql://postgres:postgres@localhost/cvproai'

engine = create_engine(connection_string)
connection =  engine.connect()
transaction = connection.begin()

for user in organigramme.keys() :
    # insertion avec tous les champs (y compris les facultatifs)
    insert_query = text("""
    INSERT INTO users (id_users, firstname, lastname, mail, firstname_manager, lastname_manager, mail_manager)
    VALUES (:id_users, :firstname, :lastname, :mail, :firstname_manager, :lastname_manager, :mail_manager)
    """)
    connection.execute(insert_query, {
        'id_users': ids[user],
        'firstname': organigramme[user][0],
        'lastname': organigramme[user][1],
        'mail': user,
        'firstname_manager': organigramme[user][2],
        'lastname_manager': organigramme[user][3],
        'mail_manager': organigramme[user][4]
    })
        
transaction.commit()
connection.close()

