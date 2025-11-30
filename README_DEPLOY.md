# 🎖️ Unidade Tática - E-commerce

Sistema completo de e-commerce para equipamentos táticos militares.

## 📋 Stack Tecnológica

**Backend:**
- Node.js 18+ com Express
- MySQL 8.0
- JWT Authentication
- Bcrypt para senhas
- Multer para upload de imagens

**Frontend:**
- React 19
- Vite
- React Router v6
- Context API (Auth + Cart)

**DevOps:**
- Docker & Docker Compose
- Render (Produção)

## 🚀 Quick Start - Desenvolvimento

### 1. Clone o repositório
```bash
git clone https://github.com/mdsreq-fga-unb/REQ-2025.2-T01-UnidadeTatica-VendasWEB.git
cd REQ-2025.2-T01-UnidadeTatica-VendasWEB
```

### 2. Configurar variáveis de ambiente

**Backend:**
```bash
cd backend
cp .env.example .env
```

**Frontend:**
```bash
cd frontend/my-app
cp .env.example .env
```

### 3. Iniciar com Docker
```bash
docker compose up --build
```

### 4. Acessar aplicação
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000
- **MySQL**: localhost:3306

### 5. Login Admin Padrão
- **Email**: admin
- **Senha**: senha123

## 📦 Deploy no Render

### Método Automático (Recomendado)

1. **Push para GitHub**
```bash
git add .
git commit -m "Deploy para Render"
git push origin dev
```

2. **No Render Dashboard**
   - Acesse: https://dashboard.render.com
   - Clique em "New +" → "Blueprint"
   - Conecte seu repositório GitHub
   - Selecione o branch `dev`
   - Render detectará o `render.yaml` automaticamente
   - Clique em "Apply"

3. **Aguarde o deploy** (5-10 minutos)
   - MySQL será criado
   - Migrações executadas
   - Backend deployado
   - Frontend buildado e deployado

### Configurações Importantes

**Variáveis de Ambiente no Render:**

O `render.yaml` já configura automaticamente, mas você pode ajustar:

- `NODE_ENV=production`
- `JWT_SECRET` (gerado automaticamente)
- `CORS_ORIGIN` (configurado automaticamente)
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` (configurados automaticamente)

### URLs de Produção

Após deploy, você terá:
```
Frontend: https://unidade-tatica-frontend.onrender.com
Backend:  https://unidade-tatica-backend.onrender.com
```

## 🗂️ Estrutura do Projeto

```
.
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── productRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   └── orderRoutes.js
│   │   └── app.js
│   ├── migrations/
│   │   ├── 001_create_users_table.sql
│   │   ├── 002_create_admin_user.sql
│   │   ├── 003_create_products_table.sql
│   │   ├── 004_create_cart_table.sql
│   │   └── 006_create_orders_table.sql
│   ├── public/uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/my-app/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductsManagement.jsx
│   │   │   ├── OrdersManagement.jsx
│   │   │   └── ReportsManagement.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Cadastro.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Carrinho.jsx
│   │   │   └── MeusPedidos.jsx
│   │   ├── config.js
│   │   └── App.jsx
│   ├── package.json
│   └── .env
│
├── docker-compose.yml
├── render.yaml
├── DEPLOY.md
└── README.md
```

## 🔧 Funcionalidades

### Usuário
- ✅ Cadastro completo (CPF, endereço, telefone)
- ✅ Login com JWT
- ✅ Navegação por categorias
- ✅ Carrinho de compras persistente
- ✅ Checkout via WhatsApp
- ✅ Histórico de pedidos
- ✅ Perfil do usuário

### Admin
- ✅ Dashboard administrativo
- ✅ Gerenciamento de produtos (CRUD)
- ✅ Gerenciamento de usuários
- ✅ Visualização de pedidos
- ✅ Alteração de status de pedidos
- ✅ Relatórios de vendas
- ✅ Análise de produtos mais vendidos
- ✅ Faturamento e ticket médio

### Categorias
- Roupas Táticas
- Calçados
- Mochilas
- Cutelaria
- Bordados
- Acessórios

## 📊 Banco de Dados

**Tabelas:**
- `users` - Usuários com dados completos
- `products` - Produtos com categorias
- `cart_items` - Itens no carrinho
- `orders` - Pedidos realizados
- `order_items` - Itens dos pedidos

## 🔐 Segurança

- ✅ Senhas com bcrypt (10 salt rounds)
- ✅ JWT com expiração de 24h
- ✅ CORS configurado
- ✅ Validação de CPF
- ✅ Upload seguro de imagens (5MB max)
- ✅ SQL Injection protection (prepared statements)

## 🧪 Testes Locais

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend/my-app
npm install
npm run dev
```

## 📝 Scripts Úteis

**Criar usuário admin:**
```bash
cd backend
node create-admin.js
```

**Executar migrações:**
```bash
docker exec -i mysql-db mysql -uroot -prootpassword meubanco < migrations/001_create_users_table.sql
```

**Rebuild containers:**
```bash
docker compose down
docker compose up --build
```

## 🐛 Troubleshooting

**Erro de conexão MySQL:**
```bash
# Aguarde ~30s para o MySQL inicializar
docker compose logs db
```

**Frontend não conecta ao backend:**
- Verifique `.env` com `VITE_API_URL`
- Confirme CORS configurado

**Uploads não salvam:**
- Verifique volume `backend_uploads` no Docker
- Permissões da pasta `backend/public/uploads`

## 📞 Contato

**Loja Física:**
Quadra I Conj I-9 Lote 05
Setor Militar Planaltina/DF

**WhatsApp:** +55 61 99142-7808
**Email:** unidadetaticamilitaria@gmail.com

## 👥 Equipe

Projeto desenvolvido como parte da disciplina de Engenharia de Requisitos - UnB/FGA.

## 📄 Licença

Este projeto é acadêmico e destinado apenas para fins educacionais.

---

**Status do Projeto:** ✅ Pronto para produção
**Última atualização:** 30/11/2025
