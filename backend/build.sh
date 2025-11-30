#!/bin/bash

echo "🚀 Iniciando deploy do backend..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Migrações foram executadas manualmente via psql
# O banco de dados já está configurado e pronto
echo "✅ Dependências instaladas!"
echo "📊 Banco de dados já configurado manualmente"

echo "✅ Build completo!"
