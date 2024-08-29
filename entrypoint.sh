#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Update the database: merge any divergent heads
alembic merge heads || true

# Autogenerate a new migration file (if needed)
alembic revision --autogenerate -m "MIGRATION_NAME" || true

# Apply the latest migrations
alembic upgrade head

# add config to frontend part
echo "window.cvproaiConfig = {
  'KEYCLOAK_SERVER_URL': '$KEYCLOAK_SERVER_URL',
  'KEYCLOAK_REALM': '$KEYCLOAK_REALM',
  'KEYCLOAK_CLIENT_ID': '$KEYCLOAK_CLIENT_FRONT_ID',
  'BACKEND_BASE_URL': '/api/v1'
}"  > /app/backend/src/front/env.js


# Hand off to the CMD
exec "$@"