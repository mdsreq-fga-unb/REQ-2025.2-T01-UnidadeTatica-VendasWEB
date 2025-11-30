#!/bin/bash

echo "🔄 Substituindo URLs hardcoded por variáveis de ambiente..."

# Frontend files
FRONTEND_DIR="frontend/my-app/src"

files=(
  "$FRONTEND_DIR/context/AuthContext.jsx"
  "$FRONTEND_DIR/context/CartContext.jsx"
  "$FRONTEND_DIR/pages/AdminDashboard.jsx"
  "$FRONTEND_DIR/pages/CategoryPage.jsx"
  "$FRONTEND_DIR/pages/Carrinho.jsx"
  "$FRONTEND_DIR/pages/Home.jsx"
  "$FRONTEND_DIR/pages/MeusPedidos.jsx"
  "$FRONTEND_DIR/pages/Perfil.jsx"
  "$FRONTEND_DIR/components/ProductsManagement.jsx"
  "$FRONTEND_DIR/components/OrdersManagement.jsx"
  "$FRONTEND_DIR/components/ReportsManagement.jsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processando: $file"
    # Adicionar import do config no topo do arquivo se não existir
    if ! grep -q "import.*config" "$file"; then
      sed -i '' "1i\\
import { API_URL } from '../config';\\
" "$file" 2>/dev/null || sed -i "1i import { API_URL } from '../config';" "$file"
    fi
    
    # Substituir localhost:4000 por variável
    sed -i '' "s|'http://localhost:4000|\`\${API_URL}|g" "$file" 2>/dev/null || sed -i "s|'http://localhost:4000|\`\${API_URL}|g" "$file"
    sed -i '' "s|\`http://localhost:4000|\`\${API_URL}|g" "$file" 2>/dev/null || sed -i "s|\`http://localhost:4000|\`\${API_URL}|g" "$file"
  fi
done

echo "✅ URLs atualizadas com sucesso!"
