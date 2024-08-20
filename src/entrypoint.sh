#! /bin/bash

if [[ -z "${USE_RUNSERVER}" ]]; then
    exec gunicorn --bind 0.0.0.0:3000 eli.wsgi:application
else
    exec ./manage.py runserver 0.0.0.0:3000 
fi
