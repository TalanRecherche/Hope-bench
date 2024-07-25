#!/bin/sh

# update database
alembic upgrade heads

# add config to frontend part
echo "window.hopeBenchConfig = {
  'KEYCLOAK_SERVER_URL': '$KEYCLOAK_SERVER_URL',
  'KEYCLOAK_REALM': '$KEYCLOAK_REALM',
  'KEYCLOAK_CLIENT_ID': '$KEYCLOAK_CLIENT_FRONT_ID',
  'BACKEND_BASE_URL': '/api/v1'
}"  > /app/backend/src/front/env.js

