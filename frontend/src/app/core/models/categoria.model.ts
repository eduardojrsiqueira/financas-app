export type TipoCategoria = 'DESPESA' | 'RECEITA';

export interface Categoria {
  id: number;
  nome: string;
  tipo: TipoCategoria;
}

export interface CategoriaRequest {
  nome: string;
  tipo: TipoCategoria;
}
