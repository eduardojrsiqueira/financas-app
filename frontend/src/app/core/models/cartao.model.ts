export interface Cartao {
  id: number;
  nome: string;
  bandeira: string | null;
  diaFechamento: number;
  diaVencimento: number;
}

export interface CartaoRequest {
  nome: string;
  bandeira: string | null;
  diaFechamento: number;
  diaVencimento: number;
}
