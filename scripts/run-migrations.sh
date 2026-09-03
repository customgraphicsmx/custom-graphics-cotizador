#!/bin/sh
set -eu

docker compose up -d db

docker compose exec -T db sh -lc 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<'SQL'
CREATE TABLE IF NOT EXISTS schema_migrations (
  name text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);
SQL

for migration in db/migrations/*.sql; do
  [ -f "$migration" ] || continue
  name=$(basename "$migration")
  applied=$(docker compose exec -T db sh -lc 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "SELECT 1 FROM schema_migrations WHERE name = '\''$1'\''"' sh "$name")
  if [ "$applied" = "1" ]; then
    echo "Migration already applied: $name"
    continue
  fi
  {
    printf 'BEGIN;\n'
    cat "$migration"
    printf "\nINSERT INTO schema_migrations(name) VALUES ('%s');\nCOMMIT;\n" "$name"
  } | docker compose exec -T db sh -lc 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
  echo "Applied migration: $name"
done
