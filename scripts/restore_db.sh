docker compose -f dev.compose.yaml cp ../db.sql postgres-dev:/

psql -U postgres -d board-db -f db.sql
