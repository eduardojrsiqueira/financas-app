import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Compra, CompraRequest } from '../models/compra.model';

@Injectable({ providedIn: 'root' })
export class CompraService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/compras';

  listar(cartaoId?: number): Observable<Compra[]> {
    const params = new HttpParams({ fromObject: cartaoId ? { cartaoId } : {} });
    return this.http.get<Compra[]>(this.baseUrl, { params });
  }

  buscarPorId(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.baseUrl}/${id}`);
  }

  criar(request: CompraRequest): Observable<Compra> {
    return this.http.post<Compra>(this.baseUrl, request);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
