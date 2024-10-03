#! /bin/bash

exec gunicorn --bind 0.0.0.0:3000 \
     ${LIVE_RELOAD:+--reload --reload-extra-file /code/src} \
     --threads 32 \
     eli.wsgi:application
