-- Adicionar campos adicionais à tabela users
ALTER TABLE users 
ADD COLUMN cpf VARCHAR(14) UNIQUE,
ADD COLUMN telefone VARCHAR(15),
ADD COLUMN data_nascimento DATE,
ADD COLUMN cep VARCHAR(9),
ADD COLUMN endereco VARCHAR(255),
ADD COLUMN numero VARCHAR(10),
ADD COLUMN complemento VARCHAR(100),
ADD COLUMN bairro VARCHAR(100),
ADD COLUMN cidade VARCHAR(100),
ADD COLUMN estado VARCHAR(2);
