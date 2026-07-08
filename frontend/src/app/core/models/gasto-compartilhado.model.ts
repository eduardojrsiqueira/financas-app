export type DirecaoGasto = 'EU_PARA_ELA' | 'ELA_PARA_EU';

export interface GastoCompartilhado {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  direcao: DirecaoGasto;
  quitado: boolean;
  mesReferencia: string;
}

export interface GastoCompartilhadoRequest {
  descricao: string;
  valor: number;
  data: string;
  direcao: DirecaoGasto;
  mesReferencia: string;
}
