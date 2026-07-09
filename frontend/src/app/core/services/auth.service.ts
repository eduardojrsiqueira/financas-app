import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  AtualizarPerfilRequest,
  LoginRequest,
  LoginResponse,
  PerfilResponse,
  UsuarioLogado,
} from '../models/usuario.model';

const STORAGE_KEY = 'financas_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly usuarioSignal = signal<UsuarioLogado | null>(this.carregarDoStorage());

  readonly usuario = this.usuarioSignal.asReadonly();

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', request).pipe(
      tap((resposta) => this.armazenar(resposta)),
    );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.usuarioSignal.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return this.usuarioSignal()?.token ?? null;
  }

  atualizarPerfil(request: AtualizarPerfilRequest): Observable<PerfilResponse> {
    return this.http.put<PerfilResponse>('/api/usuarios/me', request).pipe(
      tap((perfil) => this.atualizarUsuarioLocal(perfil)),
    );
  }

  private atualizarUsuarioLocal(perfil: PerfilResponse): void {
    const atual = this.usuarioSignal();
    if (!atual) {
      return;
    }
    const atualizado: UsuarioLogado = { ...atual, nome: perfil.nome, login: perfil.login, email: perfil.email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizado));
    this.usuarioSignal.set(atualizado);
  }

  private armazenar(resposta: LoginResponse): void {
    const usuario: UsuarioLogado = {
      token: resposta.token,
      nome: resposta.nome,
      login: resposta.login,
      email: resposta.email,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    this.usuarioSignal.set(usuario);
  }

  private carregarDoStorage(): UsuarioLogado | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as UsuarioLogado;
    } catch {
      return null;
    }
  }
}
