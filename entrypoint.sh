#!/bin/sh

# Merge any divergent heads (if necessary)
# alembic merge heads || true

# Apply the migrations
alembic upgrade head

# Add config to frontend part
echo "window.cvproaiConfig = {
  'KEYCLOAK_SERVER_URL': '$KEYCLOAK_SERVER_URL',
  'KEYCLOAK_REALM': '$KEYCLOAK_REALM',
  'KEYCLOAK_CLIENT_ID': '$KEYCLOAK_CLIENT_FRONT_ID',
  'BACKEND_BASE_URL': '/api/v1'
}" > /app/backend/src/front/env.js

# Add runtime configuration to the frontend part (if applicable)
echo "Configuring frontend..."
# Your configuration logic here

# Use the default command if no other command is passed
if [ $# -eq 0 ]; then
    echo "No command passed, using default: uvicorn src.main:app --proxy-headers --host 0.0.0.0 --port 8000"
    set -- uvicorn src.main:app --proxy-headers --host 0.0.0.0 --port 8000
fi

# Hand off to the CMD
exec "$@"