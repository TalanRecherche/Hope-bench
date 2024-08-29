#!/bin/sh

# Merge any divergent heads
#alembic merge heads || true

# Check if the database is up to date, apply migrations if necessary
# alembic upgrade head || true

# Autogenerate a new migration file if there are pending changes (optional, based on your needs)
# alembic revision --autogenerate -m "MIGRATION_NAME" || true

# Apply the new migration
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