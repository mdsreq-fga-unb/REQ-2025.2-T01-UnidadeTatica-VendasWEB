# Render Deploy - Unidade Tática

## 🚀 Deploy Automático no Render

Este projeto está configurado para deploy automático no Render usando o arquivo `render.yaml`.

### 📋 Pré-requisitos

1. Conta no [Render](https://render.com)
2. Repositório no GitHub
3. Credenciais configuradas

### 🔧 Passos para Deploy

#### 1. **Preparar o Repositório**
```bash
git add .
git commit -m "Configuração para deploy no Render"
git push origin dev
```

#### 2. **Conectar no Render**
1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em "New +" → "Blueprint"
3. Conecte seu repositório GitHub
4. Selecione o branch `dev`
5. Render detectará automaticamente o `render.yaml`

#### 3. **Configurar Variáveis de Ambiente**

O Render criará automaticamente:
- ✅ `MYSQL_ROOT_PASSWORD` (gerado automaticamente)
- ✅ `JWT_SECRET` (gerado automaticamente)
- ✅ `CORS_ORIGIN` (URL do frontend)
- ✅ `VITE_API_URL` (URL do backend)

**Variáveis adicionais que você pode configurar:**
- `NODE_ENV=production`
- `DB_NAME=meubanco`
- `DB_USER=root`

#### 4. **Deploy**
Clique em "Apply" e o Render irá:
1. 🗄️ Criar banco de dados MySQL
2. 🔧 Executar migrações
3. 🚀 Deploy do backend (Node.js)
4. 🎨 Build e deploy do frontend (React)

### 🌐 URLs Geradas

Após o deploy, você terá:
- **Frontend**: `https://unidade-tatica-frontend.onrender.com`
- **Backend API**: `https://unidade-tatica-backend.onrender.com`
- **Database**: Interno (MySQL)

### 📊 Serviços Criados

1. **unidade-tatica-db** (MySQL)
   - Plan: Free
   - Storage: 1GB
   - Database: meubanco

2. **unidade-tatica-backend** (Node.js)
   - Plan: Free
   - Port: 4000
   - Health Check: /health
   - Auto-deploy: Sim

3. **unidade-tatica-frontend** (Static Site)
   - Plan: Free
   - Build: Vite
   - Auto-deploy: Sim

### ⚙️ Configurações Importantes

#### Backend
- Node.js 18+
- Migrações executadas automaticamente
- CORS configurado para frontend
- Upload de imagens (disco persistente)

#### Frontend
- React + Vite
- Build otimizado
- SPA routing configurado
- Variáveis de ambiente injetadas

### 🔄 Atualizações Automáticas

Qualquer push para o branch `dev` irá:
1. Trigger automático do deploy
2. Rebuild dos serviços alterados
3. Zero downtime (frontend)

### 🐛 Troubleshooting

**Problema**: Migrações falharam
```bash
# No Render Shell do backend:
cd backend
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME < migrations/001_create_users_table.sql
```

**Problema**: Frontend não conecta ao backend
- Verifique `VITE_API_URL` nas variáveis de ambiente
- Confirme CORS configurado corretamente

**Problema**: Banco de dados não conecta
- Verifique variáveis: `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`
- Aguarde 2-3 minutos para o MySQL inicializar

### 📝 Logs

Acesse logs em tempo real:
1. Render Dashboard → Seu serviço
2. Aba "Logs"
3. Filtre por tipo: Errors, All, etc.

### 💰 Planos Free

**Limitações do plano gratuito:**
- 750 horas/mês de execução
- Sleep após 15min de inatividade
- 512MB RAM
- 1GB disco (banco)

**Upgrade para persistência 24/7:**
- Starter Plan: $7/mês por serviço
- Banco de dados: $7/mês

### 🔐 Segurança

✅ HTTPS automático (Let's Encrypt)
✅ Secrets gerenciados pelo Render
✅ Database em rede privada
✅ CORS restrito ao frontend
✅ JWT com secret forte

### 📚 Recursos

- [Render Docs](https://render.com/docs)
- [Blueprint Spec](https://render.com/docs/blueprint-spec)
- [Deploy Hooks](https://render.com/docs/deploy-hooks)

---

## 🎯 Checklist de Deploy

- [ ] Código commitado e pushado
- [ ] Render conectado ao GitHub
- [ ] Blueprint aplicado
- [ ] Variáveis de ambiente verificadas
- [ ] Migrações executadas com sucesso
- [ ] Frontend acessível
- [ ] Backend respondendo
- [ ] Login admin funcionando (admin / senha123)
- [ ] Produtos carregando
- [ ] Cadastro de usuários OK

---

**Status**: ✅ Pronto para deploy!
