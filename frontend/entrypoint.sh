#!/bin/sh

npm install

# Hand off to the CMD
exec "$@"
