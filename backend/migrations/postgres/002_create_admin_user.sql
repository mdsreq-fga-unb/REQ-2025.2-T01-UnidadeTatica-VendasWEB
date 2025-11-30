-- Criar usuário admin
-- Hash bcrypt da senha 'senha123': $2b$10$8kQYQXKxH5Z5JxL3.8vY3uXHZqMk6xJKqZ8Px7rYQXKH5Z5JxL3.8

DELETE FROM users WHERE email = 'admin';

INSERT INTO users (name, email, password, role) 
VALUES ('Administrador', 'admin', '$2b$10$8kQYQXKxH5Z5JxL3.8vY3uXHZqMk6xJKqZ8Px7rYQXKH5Z5JxL3.8', 'admin')
ON CONFLICT (email) DO UPDATE 
  SET password = '$2b$10$8kQYQXKxH5Z5JxL3.8vY3uXHZqMk6xJKqZ8Px7rYQXKH5Z5JxL3.8',
      role = 'admin';
