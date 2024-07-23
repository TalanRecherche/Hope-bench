#!/bin/sh

pip install -r requirements.txt

# update database
alembic upgrade head

# Hand off to the CMD
exec "$@"
