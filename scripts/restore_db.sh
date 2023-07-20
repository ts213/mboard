docker_file="docker compose -f scripts/dev.compose.yaml"

$docker_file cp ./backend/db.sql postgres-dev:/

$docker_file exec postgres-dev psql -U postgres -d board-db -f /db.sql
