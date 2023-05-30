FROM python:alpine3.18

WORKDIR /home/backend

ENV PYTHONUNBUFFERED=1

COPY requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

COPY backend/ .env gunicorn.conf.py ./

#RUN addgroup -S backendgroup &&  \
#    adduser -S backenduser -G backendgroup && \
#    chown backenduser:backendgroup -R ./
#
#USER backenduser

ENTRYPOINT sleep 4 && \
python manage.py migrate && \
gunicorn -c gunicorn.conf.py djangoconf.wsgi
