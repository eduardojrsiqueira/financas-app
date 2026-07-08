import { HttpErrorResponse } from '@angular/common/http';

export function mensagemErro(err: unknown, fallback: string): string {
  if (err instanceof HttpErrorResponse && err.error?.mensagem) {
    return err.error.mensagem as string;
  }
  return fallback;
}
