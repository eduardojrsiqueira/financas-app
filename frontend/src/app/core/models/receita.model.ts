export interface Receita {
  id: number;
  categoriaId: number;
  categoriaNome: string;
  descricao: string;
  valor: number;
  mesReferencia: string;
}

export interface ReceitaRequest {
  categoriaId: number;
  descricao: string;
  valor: number;
  mesReferencia: string;
}
