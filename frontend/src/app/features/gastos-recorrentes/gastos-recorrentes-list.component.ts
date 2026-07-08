import { NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GastoRecorrente } from '../../core/models/gasto-recorrente.model';
import { GastoRecorrenteService } from '../../core/services/gasto-recorrente.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { mensagemErro } from '../../shared/http-error.util';
import { NotificationService } from '../../shared/notification.service';
import { GastoRecorrenteFormDialogComponent } from './gasto-recorrente-form-dialog.component';
import { LancamentosDialogComponent } from './lancamentos-dialog.component';

@Component({
  selector: 'app-gastos-recorrentes-list',
  standalone: true,
  imports: [
    NgIf,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './gastos-recorrentes-list.component.html',
})
export class GastosRecorrentesListComponent implements OnInit {
  private readonly gastoRecorrenteService = inject(GastoRecorrenteService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  gastos: GastoRecorrente[] = [];
  carregando = false;
  readonly displayedColumns = ['nome', 'categoriaNome', 'acoes'];

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.gastoRecorrenteService.listar().subscribe({
      next: (gastos) => {
        this.gastos = gastos;
        this.carregando = false;
      },
      error: () => {
        this.notification.erro('Não foi possível carregar os gastos recorrentes.');
        this.carregando = false;
      },
    });
  }

  novo(): void {
    const ref = this.dialog.open(GastoRecorrenteFormDialogComponent, {});
    ref.afterClosed().subscribe((request) => {
      if (!request) {
        return;
      }
      this.gastoRecorrenteService.criar(request).subscribe({
        next: () => {
          this.notification.sucesso('Gasto recorrente criado com sucesso.');
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível criar o gasto recorrente.')),
      });
    });
  }

  verLancamentos(gastoRecorrente: GastoRecorrente): void {
    this.dialog.open(LancamentosDialogComponent, {
      data: { gastoRecorrente },
      width: '820px',
      maxWidth: '95vw',
    });
  }

  excluir(gastoRecorrente: GastoRecorrente): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Excluir gasto recorrente',
        mensagem: `Deseja excluir "${gastoRecorrente.nome}"? Os lançamentos associados também serão removidos.`,
      },
    });
    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) {
        return;
      }
      this.gastoRecorrenteService.deletar(gastoRecorrente.id).subscribe({
        next: () => {
          this.notification.sucesso('Gasto recorrente excluído com sucesso.');
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível excluir o gasto recorrente.')),
      });
    });
  }
}
