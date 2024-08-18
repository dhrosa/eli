FROM python:3.12

RUN apt-get update
RUN apt-get install --yes pipx libpq-dev python3-dev

RUN mkdir /code

WORKDIR /code
COPY pyproject.toml /code/

ENV PATH="/root/.local/bin:$PATH"
RUN pipx install hatch

RUN touch eli.py
RUN hatch shell
RUN rm eli.py

WORKDIR /code/src
