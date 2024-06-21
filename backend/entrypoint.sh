#!/bin/sh

pip install -r requirements.txt

# update database
# alembic merge heads
# alembic revision --autogenerate -m "MAJ Alembic, suppressions des versions"
alembic upgrade head
# alembic upgrade "682c9e0b10af"

# Hand off to the CMD
exec "$@"
