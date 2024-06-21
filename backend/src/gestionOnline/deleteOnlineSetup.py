from keycloak import KeycloakAdmin
from sqlalchemy import create_engine, text
from organigrammeManager import createOrganigramme

talan=True

organigramme = createOrganigramme(talan)
ids = []

# Initialiser la connexion à Keycloak en tant qu'administrateur
keycloak_admin = KeycloakAdmin(server_url="https://kccv.azurewebsites.net/auth",
                               username="admin",
                               password="CV4Talan:-)",
                               realm_name="cvproai",
                               client_id="admin-cli")

for user in organigramme.keys() :
    username = user.split("@")[0]
    # Rechercher l'utilisateur par nom d'utilisateur
    user_id = keycloak_admin.get_users(query={"username": username})[0]["id"]
    if user_id:
        keycloak_admin.delete_user(user_id=user_id)
        ids.append(user_id)


#-----------------------------------------------------------------------------SUPPRIMER DE LA BDD---------------------------------------------------------------
# Paramètres de connexion
'''server = 'cvproaibdd.postgres.database.azure.com'
database = 'cvproaiprod'
username = 'cvproaiadmin'
password = 'pergo123!'
port = 5432  # Port par défaut pour PostgreSQL

# Chaîne de connexion SQLAlchemy
connection_string = f"postgresql://{username}:{password}@{server}:{port}/{database}"


engine = create_engine(connection_string)
connection = engine.connect()
transaction = connection.begin()

try:
    # Supposons que `organigramme` et `ids` sont disponibles et ont été chargés ou définis préalablement
    
    # Parcourir l'organigramme pour supprimer les utilisateurs spécifiques
    for id in ids:
        # Préparer la requête de suppression
        delete_query = text("DELETE FROM users WHERE id_users = :id_users")
        
        # Exécuter la requête de suppression
        connection.execute(delete_query, {'id_users': id})

    transaction.commit()
    print("Les utilisateurs spécifiés ont été supprimés avec succès.")
except Exception as e:
    # En cas d'erreur, annuler les modifications
    transaction.rollback()
    print(f"Une erreur est survenue : {e}")
finally:
    # Fermer la connexion
    connection.close()'''