FROM python:alpine3.18

WORKDIR /home/backend

ENV PYTHONUNBUFFERED=1

COPY backend/requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

COPY backend/ .env scripts/gunicorn.conf.py ./

RUN adduser -S 1000 -G users

USER 1000

ENTRYPOINT sleep 4 && \
python manage.py migrate && \
gunicorn -c gunicorn.conf.py djangoconf.wsgi
