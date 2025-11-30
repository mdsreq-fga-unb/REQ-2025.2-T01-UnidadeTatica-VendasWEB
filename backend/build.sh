#!/bin/bash

echo "🚀 Iniciando deploy do backend..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Executar migrações do banco de dados
echo "🗄️ Executando migrações..."
if [ -d "migrations" ]; then
  for migration in migrations/*.sql; do
    if [ -f "$migration" ]; then
      echo "Executando: $migration"
      mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$migration" || echo "⚠️ Migração já executada ou erro: $migration"
    fi
  done
fi

echo "✅ Build completo!"
