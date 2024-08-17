FROM python:3.12
RUN groupadd django
RUN useradd -m django -g django

RUN apt-get update
RUN apt-get install --yes pipx

RUN mkdir /code
RUN chgrp -R django /code
RUN chmod -R g+rwx /code
USER django

WORKDIR /code
COPY pyproject.toml /code/
COPY src/ /code/src

ENV PATH="/home/django/.local/bin:$PATH"
RUN pipx install hatch

RUN hatch build
