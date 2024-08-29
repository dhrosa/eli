#! /bin/bash

echo "Waiting for database to be ready..."
timeout 90s bash -c "until pg_isready --host db; do sleep 0.1; done"
echo "Database ready."
exec ./manage.py migrate
