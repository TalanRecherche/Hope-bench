#!/bin/sh

# Alembic migrations
echo "Applying Alembic migrations..."
alembic upgrade head

# Add config to frontend part
echo "Configuring frontend..."
echo "window.cvproaiConfig = {
  'KEYCLOAK_SERVER_URL': '$KEYCLOAK_SERVER_URL',
  'KEYCLOAK_REALM': '$KEYCLOAK_REALM',
  'KEYCLOAK_CLIENT_ID': '$KEYCLOAK_CLIENT_FRONT_ID',
  'BACKEND_BASE_URL': '/api/v1'
}" > /app/backend/src/front/env.js

# Debugging: Check if any command is passed
echo "Number of arguments: $#"
echo "Command passed: $@"
echo "PATH is: $PATH"


# Use the default command if no other command is passed
DEFAULT_CMD="uvicorn src.main:app --proxy-headers --host 0.0.0.0 --port 8000"
if [ $# -eq 0 ]; then
    echo "No command passed, using default: $DEFAULT_CMD"
    set -- $DEFAULT_CMD
fi

# Print the final command to be executed
echo "Executing command: $@"

# Execute the command
exec "$@"