#!/bin/bash

docker="docker compose -f scripts/dev.compose.yaml"

function terminate {
  echo -e '\nStopping...\n'
  $docker stop
  pkill screen
  exit 0
}

function startScreen {
  echo "${@}"
  screen -d -m "$@"
}

trap terminate SIGINT

$docker up -d
startScreen python backend/manage.py runserver
startScreen npm run dev
echo http://localhost:5173

while true; do
  sleep 3600000
done
