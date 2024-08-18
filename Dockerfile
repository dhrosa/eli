FROM python:3.12

RUN apt-get update
RUN apt-get install --yes pipx

RUN mkdir /code

WORKDIR /code
COPY pyproject.toml /code/
COPY src/ /code/src

ENV PATH="/root/.local/bin:$PATH"
RUN pipx install hatch

RUN hatch shell

WORKDIR /code/src
