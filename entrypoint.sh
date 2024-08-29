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

# Add runtime configuration to the frontend part (if applicable)
echo "Configuring frontend..."
# Your configuration logic here

# Use the default command if no other command is passed
if [ -z "$@" ]; then
    echo "No command passed, using default: uvicorn src.main:app --proxy-headers --host 0.0.0.0 --port 8000"
    set -- uvicorn src.main:app --proxy-headers --host 0.0.0.0 --port 8000
fi


# Hand off to the CMD
exec "$@"