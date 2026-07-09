import { NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';
import { mensagemErro } from '../../shared/http-error.util';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NotificationService);

  readonly enviando = signal(false);
  readonly usuario = this.authService.usuario;

  readonly form = this.fb.nonNullable.group({
    login: [this.authService.usuario()?.login ?? '', Validators.required],
    email: [this.authService.usuario()?.email ?? '', [Validators.required, Validators.email]],
    senhaAtual: ['', Validators.required],
    novaSenha: [''],
  });

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    this.enviando.set(true);
    this.authService
      .atualizarPerfil({
        login: valores.login,
        email: valores.email,
        senhaAtual: valores.senhaAtual,
        novaSenha: valores.novaSenha || null,
      })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.notification.sucesso('Perfil atualizado com sucesso.');
          this.form.patchValue({ senhaAtual: '', novaSenha: '' });
        },
        error: (err) => {
          this.enviando.set(false);
          this.notification.erro(mensagemErro(err, 'Não foi possível atualizar o perfil.'));
        },
      });
  }
}
