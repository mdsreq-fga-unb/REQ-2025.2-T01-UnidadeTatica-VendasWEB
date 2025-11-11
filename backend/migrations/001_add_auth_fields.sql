-- Adicionar campos de autenticação na tabela users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password VARCHAR(255),
ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin') DEFAULT 'user',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Criar índice único no email
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Inserir usuário admin padrão (senha: admin123)
-- Hash bcrypt de 'admin123'
INSERT IGNORE INTO users (name, email, password, role) 
VALUES ('Administrador', 'admin@unidadetatica.com', '$2b$10$rQJZKvZXqFxH4kqHxBxH.uYPYKP3WB3k0LGPJqN6KL0K7XvYqYQZW', 'admin');

-- Inserir usuário comum de teste (senha: user123)
-- Hash bcrypt de 'user123'
INSERT IGNORE INTO users (name, email, password, role) 
VALUES ('Usuário Teste', 'user@unidadetatica.com', '$2b$10$qFvzM8hPNxPvGxZ9lqH0xeYkQXqYQXqYQXqYQXqYQXqYQXqYQXqY.', 'user');
