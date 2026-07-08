export interface GastoRecorrente {
  id: number;
  categoriaId: number;
  categoriaNome: string;
  nome: string;
}

export interface GastoRecorrenteRequest {
  categoriaId: number;
  nome: string;
}

export interface LancamentoRecorrente {
  id: number;
  gastoRecorrenteId: number;
  gastoRecorrenteNome: string;
  valor: number;
  mesReferencia: string;
  pago: boolean;
}

export interface LancamentoRecorrenteRequest {
  mesReferencia: string;
  valor: number;
}
