export const NOMES_MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function mesAtual(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function formatarMesReferencia(mesReferencia: string): string {
  const [ano, mes] = mesReferencia.split('-');
  return `${NOMES_MESES[Number(mes) - 1]}/${ano}`;
}

export function proximoMes(mesReferencia: string): string {
  const [ano, mes] = mesReferencia.split('-').map(Number);
  const data = new Date(ano, mes, 1);
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
}

export function sequenciaMeses(mesInicial: string, quantidade: number): string[] {
  const meses: string[] = [];
  let atual = mesInicial;
  for (let i = 0; i < quantidade; i++) {
    meses.push(atual);
    atual = proximoMes(atual);
  }
  return meses;
}

export function mesDeData(dataIso: string): string {
  return dataIso.slice(0, 7);
}

export function substituirMes(dataIso: string, mesReferencia: string): string {
  const dia = Number(dataIso.slice(8, 10));
  const [ano, mes] = mesReferencia.split('-').map(Number);
  const ultimoDiaDoMes = new Date(ano, mes, 0).getDate();
  const diaAjustado = Math.min(dia, ultimoDiaDoMes);
  return `${mesReferencia}-${String(diaAjustado).padStart(2, '0')}`;
}
