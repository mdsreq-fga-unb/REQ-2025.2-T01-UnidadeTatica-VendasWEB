-- Adicionar campos de autenticação na tabela users

-- Adicionar coluna password se não existir
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'meubanco' 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'password'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE users ADD COLUMN password VARCHAR(255)', 
  'SELECT "Column password already exists"');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar coluna role se não existir
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'meubanco' 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'role'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE users ADD COLUMN role ENUM(''user'', ''admin'') DEFAULT ''user''', 
  'SELECT "Column role already exists"');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar coluna created_at se não existir
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'meubanco' 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'created_at'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP', 
  'SELECT "Column created_at already exists"');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar coluna updated_at se não existir
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'meubanco' 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'updated_at'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', 
  'SELECT "Column updated_at already exists"');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Criar índice único no email se não existir
SET @index_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = 'meubanco' 
  AND TABLE_NAME = 'users' 
  AND INDEX_NAME = 'idx_users_email'
);

SET @sql = IF(@index_exists = 0, 
  'CREATE UNIQUE INDEX idx_users_email ON users(email)', 
  'SELECT "Index idx_users_email already exists"');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Migração concluída com sucesso!' as message;
