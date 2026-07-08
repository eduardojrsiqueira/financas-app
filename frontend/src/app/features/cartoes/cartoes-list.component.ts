import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Cartao } from '../../core/models/cartao.model';
import { CartaoService } from '../../core/services/cartao.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { mensagemErro } from '../../shared/http-error.util';
import { NotificationService } from '../../shared/notification.service';
import { CartaoFormDialogComponent } from './cartao-form-dialog.component';

@Component({
  selector: 'app-cartoes-list',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './cartoes-list.component.html',
})
export class CartoesListComponent implements OnInit {
  private readonly cartaoService = inject(CartaoService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  cartoes: Cartao[] = [];
  carregando = false;
  readonly displayedColumns = ['nome', 'bandeira', 'diaFechamento', 'diaVencimento', 'acoes'];

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.cartaoService.listar().subscribe({
      next: (cartoes) => {
        this.cartoes = cartoes;
        this.carregando = false;
      },
      error: () => {
        this.notification.erro('Não foi possível carregar os cartões.');
        this.carregando = false;
      },
    });
  }

  novo(): void {
    const ref = this.dialog.open(CartaoFormDialogComponent, { data: {} });
    ref.afterClosed().subscribe((request) => {
      if (!request) {
        return;
      }
      this.cartaoService.criar(request).subscribe({
        next: () => {
          this.notification.sucesso('Cartão criado com sucesso.');
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível criar o cartão.')),
      });
    });
  }

  editar(cartao: Cartao): void {
    const ref = this.dialog.open(CartaoFormDialogComponent, { data: { cartao } });
    ref.afterClosed().subscribe((request) => {
      if (!request) {
        return;
      }
      this.cartaoService.atualizar(cartao.id, request).subscribe({
        next: () => {
          this.notification.sucesso('Cartão atualizado com sucesso.');
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível atualizar o cartão.')),
      });
    });
  }

  excluir(cartao: Cartao): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Excluir cartão',
        mensagem: `Deseja excluir o cartão "${cartao.nome}"?`,
      },
    });
    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) {
        return;
      }
      this.cartaoService.deletar(cartao.id).subscribe({
        next: () => {
          this.notification.sucesso('Cartão excluído com sucesso.');
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível excluir o cartão.')),
      });
    });
  }
}
