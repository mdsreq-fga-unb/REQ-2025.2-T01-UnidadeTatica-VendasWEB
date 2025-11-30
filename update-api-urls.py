#!/usr/bin/env python3
import os
import re

# Diretório base do frontend
FRONTEND_DIR = "frontend/my-app/src"

# Arquivos para atualizar
files_to_update = [
    "pages/Home.jsx",
    "pages/Carrinho.jsx",
    "pages/MeusPedidos.jsx",
    "pages/Perfil.jsx",
    "pages/AdminDashboard.jsx",
    "components/ProductsManagement.jsx",
    "components/OrdersManagement.jsx",
    "components/ReportsManagement.jsx",
]

def update_file(filepath):
    """Atualiza um arquivo substituindo URLs hardcoded por API_URL"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Verificar se já tem o import
        has_import = "import { API_URL }" in content or "import { API_URL }" in content
        
        # Adicionar import se não existir
        if not has_import:
            # Encontrar a primeira linha de import React
            lines = content.split('\n')
            import_index = 0
            for i, line in enumerate(lines):
                if line.strip().startswith('import'):
                    import_index = i + 1
            
            # Adicionar import após os outros imports
            lines.insert(import_index, "import { API_URL } from '../config';")
            content = '\n'.join(lines)
        
        # Substituir URLs
        content = re.sub(
            r"'http://localhost:4000",
            r"`${API_URL}",
            content
        )
        content = re.sub(
            r'"http://localhost:4000',
            r"`${API_URL}",
            content
        )
        content = re.sub(
            r"`http://localhost:4000",
            r"`${API_URL}",
            content
        )
        
        # Escrever de volta
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Atualizado: {filepath}")
        return True
    except Exception as e:
        print(f"❌ Erro em {filepath}: {e}")
        return False

def main():
    print("🔄 Atualizando URLs da API no frontend...")
    
    updated = 0
    for file in files_to_update:
        filepath = os.path.join(FRONTEND_DIR, file)
        if os.path.exists(filepath):
            if update_file(filepath):
                updated += 1
        else:
            print(f"⚠️ Arquivo não encontrado: {filepath}")
    
    print(f"\n✅ {updated}/{len(files_to_update)} arquivos atualizados!")

if __name__ == "__main__":
    main()
