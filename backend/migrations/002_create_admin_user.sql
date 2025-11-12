-- Script para criar usuário admin com login e senha específicos
-- Login: admin
-- Senha: senha123

-- Remover admin anterior se existir
DELETE FROM users WHERE email = 'admin';

-- Hash bcrypt da senha 'senha123' (gerado com salt rounds = 10)
-- $2b$10$8kQYQXKxH5Z5JxL3.8vY3uXHZqMk6xJKqZ8Px7rYQXKH5Z5JxL3.8
INSERT INTO users (name, email, password, role) 
VALUES ('Administrador', 'admin', '$2b$10$8kQYQXKxH5Z5JxL3.8vY3uXHZqMk6xJKqZ8Px7rYQXKH5Z5JxL3.8', 'admin')
ON DUPLICATE KEY UPDATE 
  password = '$2b$10$8kQYQXKxH5Z5JxL3.8vY3uXHZqMk6xJKqZ8Px7rYQXKH5Z5JxL3.8',
  role = 'admin';

SELECT 'Admin criado com sucesso!' as message;
SELECT id, name, email, role FROM users WHERE email = 'admin';
