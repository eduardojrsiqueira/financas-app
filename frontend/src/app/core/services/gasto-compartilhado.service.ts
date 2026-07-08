import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GastoCompartilhado, GastoCompartilhadoRequest } from '../models/gasto-compartilhado.model';

@Injectable({ providedIn: 'root' })
export class GastoCompartilhadoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/gastos-compartilhados';

  listar(mes?: string, apenasPendentes?: boolean): Observable<GastoCompartilhado[]> {
    const params: Record<string, string> = {};
    if (mes) {
      params['mes'] = mes;
    }
    if (apenasPendentes) {
      params['apenasPendentes'] = 'true';
    }
    return this.http.get<GastoCompartilhado[]>(this.baseUrl, { params });
  }

  buscarPorId(id: number): Observable<GastoCompartilhado> {
    return this.http.get<GastoCompartilhado>(`${this.baseUrl}/${id}`);
  }

  criar(request: GastoCompartilhadoRequest): Observable<GastoCompartilhado> {
    return this.http.post<GastoCompartilhado>(this.baseUrl, request);
  }

  atualizar(id: number, request: GastoCompartilhadoRequest): Observable<GastoCompartilhado> {
    return this.http.put<GastoCompartilhado>(`${this.baseUrl}/${id}`, request);
  }

  marcarComoQuitado(id: number): Observable<GastoCompartilhado> {
    return this.http.patch<GastoCompartilhado>(`${this.baseUrl}/${id}/quitado`, {});
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
