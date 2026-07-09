CREATE TABLE usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    login VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    ultimo_acesso DATETIME NULL
);

-- Usuário inicial, dono de todos os dados já existentes no sistema.
-- Senha inicial: 123456 (hash BCrypt), deve ser trocada após o primeiro acesso.
INSERT INTO usuario (nome, login, email, senha) VALUES
  ('Eduardo Siqueira', 'eduardo', 'eduardojrsiqueira@gmail.com',
   '$2a$10$HukGmJwkbWtZsxOXqJ0hh.m31BwmqRPQlWDoc2JTgLdSUp0FT5iuC');
