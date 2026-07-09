export interface LoginRequest {
  login: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  nome: string;
  login: string;
  email: string;
}

export interface UsuarioLogado {
  token: string;
  nome: string;
  login: string;
  email: string;
}

export interface PerfilResponse {
  nome: string;
  login: string;
  email: string;
}

export interface AtualizarPerfilRequest {
  login: string;
  email: string;
  senhaAtual: string;
  novaSenha: string | null;
}
