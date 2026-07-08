CREATE TABLE categoria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL -- DESPESA | RECEITA
);

CREATE TABLE cartao (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    bandeira VARCHAR(50),
    dia_fechamento INT NOT NULL,
    dia_vencimento INT NOT NULL
);

CREATE TABLE compra (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cartao_id BIGINT NOT NULL,
    categoria_id BIGINT NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    valor_total DECIMAL(12,2) NOT NULL,
    data_compra DATE NOT NULL,
    numero_parcelas INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_compra_cartao FOREIGN KEY (cartao_id) REFERENCES cartao(id),
    CONSTRAINT fk_compra_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

CREATE TABLE parcela (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    compra_id BIGINT NOT NULL,
    numero_parcela INT NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    mes_referencia VARCHAR(7) NOT NULL, -- formato YYYY-MM
    CONSTRAINT fk_parcela_compra FOREIGN KEY (compra_id) REFERENCES compra(id)
);

CREATE TABLE gasto_recorrente (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    categoria_id BIGINT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    CONSTRAINT fk_gasto_recorrente_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

CREATE TABLE lancamento_recorrente (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gasto_recorrente_id BIGINT NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    mes_referencia VARCHAR(7) NOT NULL,
    pago BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_lancamento_gasto FOREIGN KEY (gasto_recorrente_id) REFERENCES gasto_recorrente(id)
);

CREATE TABLE receita (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    categoria_id BIGINT NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    mes_referencia VARCHAR(7) NOT NULL,
    CONSTRAINT fk_receita_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

CREATE TABLE gasto_compartilhado (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    data DATE NOT NULL,
    direcao VARCHAR(20) NOT NULL, -- EU_PARA_ELA | ELA_PARA_EU
    quitado BOOLEAN NOT NULL DEFAULT FALSE,
    mes_referencia VARCHAR(7) NOT NULL
);

-- Categorias iniciais sugeridas (opcional, remova se preferir cadastrar manualmente)
INSERT INTO categoria (nome, tipo) VALUES
  ('Saúde', 'DESPESA'),
  ('Restaurante', 'DESPESA'),
  ('Carro', 'DESPESA'),
  ('Mercado', 'DESPESA'),
  ('Salário', 'RECEITA'),
  ('Prêmio', 'RECEITA'),
  ('Pais', 'RECEITA');
