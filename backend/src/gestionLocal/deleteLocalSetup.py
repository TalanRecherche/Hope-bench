from keycloak import KeycloakAdmin
from sqlalchemy import create_engine, text
from organigrammeManager import createOrganigramme

list_mail = ["steve.bellart@talan.com", "nicolas.de-bufala@talan.com",
             "julie.debuire@talan.com", "bintougbe.bayo@talan.com",
             "laurent.cervoni@talan.com"]

#list_mail = []

organigramme = createOrganigramme(list_mail=list_mail)

# Initialiser la connexion à Keycloak en tant qu'administrateur
keycloak_admin = KeycloakAdmin(server_url="http://localhost:9090/auth",
                               username="admin",
                               password="admin",
                               realm_name="cvproai",
                               client_id="admin-cli")

for user in organigramme.keys() :
    username = user.split("@")[0]
    # Rechercher l'utilisateur par nom d'utilisateur
    user_id = keycloak_admin.get_users(query={"username": username})[0]["id"]
    if user_id:
        keycloak_admin.delete_user(user_id=user_id)

#-----------------------------------------------------------------------------SUPPRIMER DE LA BDD---------------------------------------------------------------
# Connexion à la base de données
'''engine = create_engine('postgresql://postgres:postgres@localhost/cvproai')
connection = engine.connect()
transaction = connection.begin()

try:
    # Supposons que `organigramme` et `ids` sont disponibles et ont été chargés ou définis préalablement
    
    # Parcourir l'organigramme pour supprimer les utilisateurs spécifiques
    for id in user_id:
        # Préparer la requête de suppression
        delete_query = text("DELETE FROM users WHERE id_users = :id_users")
        
        # Exécuter la requête de suppression
        connection.execute(delete_query, {'id_users': ids[user]})

    transaction.commit()
    print("Les utilisateurs spécifiés ont été supprimés avec succès.")
except Exception as e:
    # En cas d'erreur, annuler les modifications
    transaction.rollback()
    print(f"Une erreur est survenue : {e}")
finally:
    # Fermer la connexion
    connection.close()'''