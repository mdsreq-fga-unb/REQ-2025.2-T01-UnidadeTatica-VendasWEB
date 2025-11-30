#!/bin/bash

echo "🚀 Iniciando deploy do backend..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Detectar tipo de banco de dados
if [ "$DB_PORT" == "5432" ] || [ "$DB_TYPE" == "postgres" ]; then
  echo "🐘 PostgreSQL detectado - executando migrações..."
  MIGRATIONS_DIR="migrations/postgres"
  
  # Executar migrações do PostgreSQL
  for migration in $MIGRATIONS_DIR/*.sql; do
    if [ -f "$migration" ]; then
      echo "Executando: $migration"
      PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f "$migration" || echo "⚠️ Migração já executada ou erro: $migration"
    fi
  done
else
  echo "🐬 MySQL detectado - executando migrações..."
  MIGRATIONS_DIR="migrations"
  
  # Executar migrações do MySQL
  for migration in $MIGRATIONS_DIR/*.sql; do
    if [ -f "$migration" ]; then
      echo "Executando: $migration"
      mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$migration" || echo "⚠️ Migração já executada ou erro: $migration"
    fi
  done
fi

echo "✅ Build completo!"
