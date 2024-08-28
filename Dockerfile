FROM python:3.12

RUN apt-get update
RUN apt-get install --yes pipx libpq-dev python3-dev

RUN addgroup django
RUN adduser --disabled-password --gecos '' --ingroup django  django

RUN mkdir /code
RUN mkdir /static

RUN chown -R django /code
RUN chown -R django /static

USER django

WORKDIR /code
COPY pyproject.toml /code/

ENV PATH="/home/django/.local/bin:$PATH"
RUN pipx install hatch

RUN touch eli.py
RUN hatch shell
RUN rm eli.py

WORKDIR /code/src
