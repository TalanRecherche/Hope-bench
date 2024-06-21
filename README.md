# API pour la création de curriculum vitae

Ce projet contient une API pour la saisie de données pour le projet Hope IA

## Prérequis

- Docker installé sur votre machine. Si ce n'est pas le cas, vous pouvez le télécharger et l'installer depuis le site officiel de [Docker](https://www.docker.com/get-started).

## Comment démarrer

1. Ouvrir un terminal à l'endroit où vous souhaitez récupérer le projet. Puis, clonez ce dépôt git :
    ```bash
    git clone https://gitlab.com/SBenRetD/hope_ia.git
    cd 
    ```

2. Pour démarrer l'application avec Docker, exécutez :
    ```bash
    docker-compose up
    ```

## Utilisation

### Frontend

Pour accéder à l'application, ouvrez votre navigateur et rendez-vous à l'adresse : 
```
http://localhost:8080
```

### Backend

#### Interagir avec l'API

FastAPI est équipé de [Swagger UI](https://swagger.io/tools/swagger-ui/), ce qui permet d'interagir facilement avec l'API directement depuis un navigateur web.

Pour accéder à Swagger UI et voir les différents endpoints disponibles :

1. Ouvrez votre navigateur.
2. Naviguez vers :
```
http://localhost:8000/docs
```

3. Ici, vous pouvez voir toutes les routes disponibles et même tester l'API directement à partir de cette interface en cliquant sur les différents endpoints, puis sur le bouton "Try it out" et enfin sur "Execute".

### Authent avec Keycloak

Url de configuration pour le backend: http://localhost:9090/realms/cvproai/.well-known/openid-configuration

Les users pré-configurés sont :
- test/test : aucun role
- manager/manager : role `manager`
- admin/admin : role `manager` et `template_manager`

#### export realm modifications

```bash
# get container id of running keycloak
docker container list
docker exec -it <CONTAINER_ID> bash
# inside container
/opt/keycloak/bin/kc.sh export --dir /opt/keycloak/data/import --realm cvproai --users same_file
```

Files will be exported in the mounted volumes


## Production

```bash
docker login gencvsynthe.azurecr.io
docker build --platform linux/amd64 -f Dockerfile.prod -t gencvsynthe.azurecr.io/cvproai:latest .
docker tag gencvsynthe.azurecr.io/cvproai:latest gencvsynthe.azurecr.io/cvproai:{COMMIT_HASH_8}
docker push gencvsynthe.azurecr.io/cvproai:latest
docker push gencvsynthe.azurecr.io/cvproai:{COMMIT_HASH_8}
```

L'image `Dockerfile.prod` contient l'application complète (front + back) buildé et prête à démarrer.
