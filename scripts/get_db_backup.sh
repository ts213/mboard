#!/bin/bash

set -o allexport; source .env; set +o allexport

ssh "-p ${SSH_PORT}" -t "${SSH_USER}@${SSH_IP}" "\
cd ${SSH_USER}; \
docker compose exec postgres pg_dump --clean -f db.sql -U ${DB_USER} ${DB_NAME}; \
docker compose cp postgres:/db.sql ../; \
exit; \
"

rsync -rv -e "ssh -p ${SSH_PORT}" \
--remove-source-files \
--progress "${SSH_USER}@${SSH_IP}:/home/${SSH_USER}/db.sql" ./backend/
