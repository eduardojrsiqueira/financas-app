ALTER TABLE cartao ADD COLUMN usuario_id BIGINT NULL;
ALTER TABLE categoria ADD COLUMN usuario_id BIGINT NULL;
ALTER TABLE compra ADD COLUMN usuario_id BIGINT NULL;
ALTER TABLE gasto_recorrente ADD COLUMN usuario_id BIGINT NULL;
ALTER TABLE receita ADD COLUMN usuario_id BIGINT NULL;
ALTER TABLE gasto_compartilhado ADD COLUMN usuario_id BIGINT NULL;

-- Todos os dados existentes passam a pertencer ao usuário inicial (login 'eduardo').
UPDATE cartao SET usuario_id = (SELECT id FROM usuario WHERE login = 'eduardo');
UPDATE categoria SET usuario_id = (SELECT id FROM usuario WHERE login = 'eduardo');
UPDATE compra SET usuario_id = (SELECT id FROM usuario WHERE login = 'eduardo');
UPDATE gasto_recorrente SET usuario_id = (SELECT id FROM usuario WHERE login = 'eduardo');
UPDATE receita SET usuario_id = (SELECT id FROM usuario WHERE login = 'eduardo');
UPDATE gasto_compartilhado SET usuario_id = (SELECT id FROM usuario WHERE login = 'eduardo');

ALTER TABLE cartao MODIFY usuario_id BIGINT NOT NULL;
ALTER TABLE categoria MODIFY usuario_id BIGINT NOT NULL;
ALTER TABLE compra MODIFY usuario_id BIGINT NOT NULL;
ALTER TABLE gasto_recorrente MODIFY usuario_id BIGINT NOT NULL;
ALTER TABLE receita MODIFY usuario_id BIGINT NOT NULL;
ALTER TABLE gasto_compartilhado MODIFY usuario_id BIGINT NOT NULL;

ALTER TABLE cartao ADD CONSTRAINT fk_cartao_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id);
ALTER TABLE categoria ADD CONSTRAINT fk_categoria_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id);
ALTER TABLE compra ADD CONSTRAINT fk_compra_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id);
ALTER TABLE gasto_recorrente ADD CONSTRAINT fk_gasto_recorrente_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id);
ALTER TABLE receita ADD CONSTRAINT fk_receita_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id);
ALTER TABLE gasto_compartilhado ADD CONSTRAINT fk_gasto_compartilhado_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id);
