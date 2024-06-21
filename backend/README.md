# Interface de saisi de CV

## Stack

Python 3

## Libs

- fastapi: web framework pour l'api
- uvicorn: web serveur déployer/démarrer l'appli
- python-multipart: gestion de l'upload de fichier
- pydantic: validation de donnée
- python-dotenv: injection d'un fichier `.env` avec l'ensemble des configs et variables d'env
- python-dateutil: module de parsing de date
- jinja2: moteur de templating (utiliser pour generer des fichiers pptx et word)
- docxtpl: generateur de documents word
- dependency_injector: librairie pour faire de l'injection de dépendance
- sqlalchemy: ORM pour interagir avec la base de donnée
- psycopg2: adapter PostgreSQL pour sqlalchemy


## Startup

```bash
python -m venv venv
pip install
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

## Database upgrade

Migration a run at startup in docker files. In local dev, you must run 
```bash
# in backend folder
alembic upgrade head
```

After updating database models (backend/src/repositories/models.py)

```bash
# in backend folder
alembic revision --autogenerate -m "MIGRATION_NAME"
alembic upgrade head
```
