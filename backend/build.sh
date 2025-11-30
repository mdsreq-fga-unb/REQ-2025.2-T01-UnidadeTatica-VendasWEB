#!/bin/bash

echo "🚀 Iniciando deploy do backend..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Executar migrações via Node.js (funciona melhor com SSL)
echo "🗄️ Executando migrações..."
npm run migrate || echo "⚠️ Algumas migrações podem já estar aplicadas"

echo "✅ Build completo!"
