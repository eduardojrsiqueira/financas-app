import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Cartao, CartaoRequest } from '../models/cartao.model';

@Injectable({ providedIn: 'root' })
export class CartaoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/cartoes';

  listar(): Observable<Cartao[]> {
    return this.http.get<Cartao[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<Cartao> {
    return this.http.get<Cartao>(`${this.baseUrl}/${id}`);
  }

  criar(request: CartaoRequest): Observable<Cartao> {
    return this.http.post<Cartao>(this.baseUrl, request);
  }

  atualizar(id: number, request: CartaoRequest): Observable<Cartao> {
    return this.http.put<Cartao>(`${this.baseUrl}/${id}`, request);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
