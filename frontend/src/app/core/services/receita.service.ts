import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Receita, ReceitaRequest } from '../models/receita.model';

@Injectable({ providedIn: 'root' })
export class ReceitaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/receitas';

  listar(mes?: string): Observable<Receita[]> {
    const params = new HttpParams({ fromObject: mes ? { mes } : {} });
    return this.http.get<Receita[]>(this.baseUrl, { params });
  }

  buscarPorId(id: number): Observable<Receita> {
    return this.http.get<Receita>(`${this.baseUrl}/${id}`);
  }

  criar(request: ReceitaRequest): Observable<Receita> {
    return this.http.post<Receita>(this.baseUrl, request);
  }

  atualizar(id: number, request: ReceitaRequest): Observable<Receita> {
    return this.http.put<Receita>(`${this.baseUrl}/${id}`, request);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
