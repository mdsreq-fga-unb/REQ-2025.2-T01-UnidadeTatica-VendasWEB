-- Script completo de inicialização do banco de dados
-- Execute este script diretamente no PostgreSQL do Render

-- 1. Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  cpf VARCHAR(14) UNIQUE,
  telefone VARCHAR(15),
  data_nascimento DATE,
  cep VARCHAR(9),
  endereco VARCHAR(255),
  numero VARCHAR(10),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf);

-- 2. Criar função de update automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. Criar trigger para users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. Criar usuário admin
DELETE FROM users WHERE email = 'admin';
INSERT INTO users (name, email, password, role) 
VALUES ('Administrador', 'admin', '$2b$10$8kQYQXKxH5Z5JxL3.8vY3uXHZqMk6xJKqZ8Px7rYQXKH5Z5JxL3.8', 'admin')
ON CONFLICT (email) DO UPDATE 
  SET password = '$2b$10$8kQYQXKxH5Z5JxL3.8vY3uXHZqMk6xJKqZ8Px7rYQXKH5Z5JxL3.8',
      role = 'admin';

-- 5. Criar tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('roupas', 'calcados', 'mochila', 'cutelaria', 'bordados', 'acessorios', 'geral')),
  stock INTEGER DEFAULT 0,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- Trigger para products
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Inserir produtos de exemplo
INSERT INTO products (name, description, price, category, stock, image_url, is_active) VALUES
('Colete Tático Modular', 'Colete tático de alta resistência com sistema MOLLE', 899.90, 'roupas', 15, 'https://via.placeholder.com/300x300?text=Colete+Tatico', true),
('Bota Tática Combat', 'Bota militar resistente à água, perfeita para operações', 459.90, 'calcados', 25, 'https://via.placeholder.com/300x300?text=Bota+Tatica', true),
('Mochila Assault 40L', 'Mochila tática com capacidade de 40 litros', 349.90, 'mochila', 30, 'https://via.placeholder.com/300x300?text=Mochila+40L', true),
('Faca Tática K25', 'Faca de combate em aço inox com bainha', 189.90, 'cutelaria', 20, 'https://via.placeholder.com/300x300?text=Faca+K25', true),
('Patch Bordado Polícia', 'Patch bordado personalizado para uniformes', 29.90, 'bordados', 100, 'https://via.placeholder.com/300x300?text=Patch+Policia', true),
('Lanterna Tática LED', 'Lanterna de alta potência 1200 lumens', 149.90, 'acessorios', 40, 'https://via.placeholder.com/300x300?text=Lanterna+LED', true),
('Cinto Tático Reforçado', 'Cinto tático com fivela de engate rápido', 89.90, 'acessorios', 50, 'https://via.placeholder.com/300x300?text=Cinto+Tatico', true),
('Calça Tática Ripstop', 'Calça tática em tecido ripstop resistente', 259.90, 'roupas', 35, 'https://via.placeholder.com/300x300?text=Calca+Tatica', true),
('Canivete Multifunção', 'Canivete suíço com 15 funções', 119.90, 'cutelaria', 45, 'https://via.placeholder.com/300x300?text=Canivete', true),
('Óculos Tático Proteção', 'Óculos de proteção balística UV400', 79.90, 'acessorios', 60, 'https://via.placeholder.com/300x300?text=Oculos+Tatico', true)
ON CONFLICT DO NOTHING;

-- 7. Criar tabela de carrinho
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart_items(user_id);

-- Trigger para cart_items
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 8. Criar tabelas de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'enviado', 'entregue', 'cancelado')),
  whatsapp_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_category VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Trigger para orders
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verificar criação
SELECT 'Tabelas criadas com sucesso!' AS status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
