import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GastoRecorrente,
  GastoRecorrenteRequest,
  LancamentoRecorrente,
  LancamentoRecorrenteRequest,
} from '../models/gasto-recorrente.model';

@Injectable({ providedIn: 'root' })
export class GastoRecorrenteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/gastos-recorrentes';

  listar(): Observable<GastoRecorrente[]> {
    return this.http.get<GastoRecorrente[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<GastoRecorrente> {
    return this.http.get<GastoRecorrente>(`${this.baseUrl}/${id}`);
  }

  criar(request: GastoRecorrenteRequest): Observable<GastoRecorrente> {
    return this.http.post<GastoRecorrente>(this.baseUrl, request);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  listarLancamentos(gastoRecorrenteId: number): Observable<LancamentoRecorrente[]> {
    return this.http.get<LancamentoRecorrente[]>(`${this.baseUrl}/${gastoRecorrenteId}/lancamentos`);
  }

  gerarLancamento(gastoRecorrenteId: number, request: LancamentoRecorrenteRequest): Observable<LancamentoRecorrente> {
    return this.http.post<LancamentoRecorrente>(`${this.baseUrl}/${gastoRecorrenteId}/lancamentos`, request);
  }

  listarLancamentosPorMes(mes: string): Observable<LancamentoRecorrente[]> {
    return this.http.get<LancamentoRecorrente[]>(`${this.baseUrl}/lancamentos`, { params: { mes } });
  }

  marcarComoPago(lancamentoId: number): Observable<LancamentoRecorrente> {
    return this.http.patch<LancamentoRecorrente>(`${this.baseUrl}/lancamentos/${lancamentoId}/pago`, {});
  }

  atualizarLancamento(
    lancamentoId: number,
    request: LancamentoRecorrenteRequest,
  ): Observable<LancamentoRecorrente> {
    return this.http.put<LancamentoRecorrente>(`${this.baseUrl}/lancamentos/${lancamentoId}`, request);
  }

  excluirLancamento(lancamentoId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/lancamentos/${lancamentoId}`);
  }
}
