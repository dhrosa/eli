FROM python:3.12

RUN apt-get update
RUN apt-get install --yes pipx libpq-dev python3-dev postgresql-client

RUN addgroup django
RUN adduser --disabled-password --gecos '' --ingroup django  django

RUN mkdir -p /code/src /static /jsx-out

RUN chown -R django /code /static /jsx-out

USER django

WORKDIR /code
COPY pyproject.toml .

ENV PATH="/home/django/.local/bin:$PATH"
RUN pipx install hatch

RUN touch eli.py
RUN hatch shell
RUN rm eli.py

COPY ./src src/

WORKDIR /code/src
