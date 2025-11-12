-- Criação da tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category ENUM('roupas', 'calcados', 'mochila', 'cutelaria', 'bordados', 'acessorios', 'geral') NOT NULL,
  stock INT DEFAULT 0,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_active (is_active)
);

-- Inserir produtos de exemplo
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
('Óculos Tático Proteção', 'Óculos de proteção balística UV400', 79.90, 'acessorios', 60, 'https://via.placeholder.com/300x300?text=Oculos+Tatico', true);

SELECT 'Tabela de produtos criada e populada com sucesso!' as message;
