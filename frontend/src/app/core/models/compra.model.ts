export interface Parcela {
  id: number;
  numeroParcela: number;
  valor: number;
  mesReferencia: string;
}

export interface Compra {
  id: number;
  cartaoId: number;
  cartaoNome: string;
  categoriaId: number;
  categoriaNome: string;
  descricao: string;
  valorTotal: number;
  dataCompra: string;
  numeroParcelas: number;
  parcelas: Parcela[];
}

export interface CompraRequest {
  cartaoId: number;
  categoriaId: number;
  descricao: string;
  valorTotal: number;
  dataCompra: string;
  numeroParcelas: number;
}
