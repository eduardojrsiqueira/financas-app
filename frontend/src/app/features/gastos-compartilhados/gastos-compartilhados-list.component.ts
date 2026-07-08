import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';
import { GastoCompartilhado } from '../../core/models/gasto-compartilhado.model';
import { GastoCompartilhadoService } from '../../core/services/gasto-compartilhado.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { formatarMesReferencia, mesAtual, sequenciaMeses } from '../../shared/date.util';
import {
  DuplicarDialogComponent,
  DuplicarDialogResultado,
} from '../../shared/duplicar-dialog/duplicar-dialog.component';
import { mensagemErro } from '../../shared/http-error.util';
import { MesAnoPickerComponent } from '../../shared/mes-ano-picker/mes-ano-picker.component';
import { NotificationService } from '../../shared/notification.service';
import { GastoCompartilhadoFormDialogComponent } from './gasto-compartilhado-form-dialog.component';

@Component({
  selector: 'app-gastos-compartilhados-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    NgIf,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatSlideToggleModule,
    MesAnoPickerComponent,
  ],
  templateUrl: './gastos-compartilhados-list.component.html',
})
export class GastosCompartilhadosListComponent implements OnInit {
  private readonly gastoService = inject(GastoCompartilhadoService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  gastos: GastoCompartilhado[] = [];
  carregando = false;
  apenasPendentes = false;
  mesSelecionado = mesAtual();
  readonly displayedColumns = ['descricao', 'direcao', 'data', 'valor', 'quitado', 'acoes'];

  get mesFormatado(): string {
    return formatarMesReferencia(this.mesSelecionado);
  }

  ngOnInit(): void {
    this.carregar();
  }

  onMesChange(): void {
    if (this.mesSelecionado) {
      this.carregar();
    }
  }

  carregar(): void {
    this.carregando = true;
    this.gastoService.listar(this.mesSelecionado, this.apenasPendentes).subscribe({
      next: (gastos) => {
        this.gastos = gastos;
        this.carregando = false;
      },
      error: () => {
        this.notification.erro('Não foi possível carregar os gastos compartilhados.');
        this.carregando = false;
      },
    });
  }

  alternarFiltro(event: MatSlideToggleChange): void {
    this.apenasPendentes = event.checked;
    this.carregar();
  }

  novo(): void {
    const ref = this.dialog.open(GastoCompartilhadoFormDialogComponent, { data: {} });
    ref.afterClosed().subscribe((request) => {
      if (!request) {
        return;
      }
      this.gastoService.criar(request).subscribe({
        next: () => {
          this.notification.sucesso('Gasto compartilhado criado com sucesso.');
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível criar o gasto compartilhado.')),
      });
    });
  }

  editar(gasto: GastoCompartilhado): void {
    const ref = this.dialog.open(GastoCompartilhadoFormDialogComponent, { data: { gasto } });
    ref.afterClosed().subscribe((request) => {
      if (!request) {
        return;
      }
      this.gastoService.atualizar(gasto.id, request).subscribe({
        next: () => {
          this.notification.sucesso('Gasto compartilhado atualizado com sucesso.');
          this.carregar();
        },
        error: (err) =>
          this.notification.erro(mensagemErro(err, 'Não foi possível atualizar o gasto compartilhado.')),
      });
    });
  }

  quitar(gasto: GastoCompartilhado): void {
    this.gastoService.marcarComoQuitado(gasto.id).subscribe({
      next: () => {
        this.notification.sucesso('Gasto marcado como quitado.');
        this.carregar();
      },
      error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível quitar o gasto.')),
    });
  }

  duplicar(gasto: GastoCompartilhado): void {
    const ref = this.dialog.open(DuplicarDialogComponent, {
      data: { titulo: 'Duplicar Gasto Compartilhado', mesReferenciaOrigem: gasto.mesReferencia },
    });
    ref.afterClosed().subscribe((resultado?: DuplicarDialogResultado) => {
      if (!resultado) {
        return;
      }
      const meses = sequenciaMeses(resultado.mesInicial, resultado.quantidadeMeses);
      const requests = meses.map((mes) =>
        this.gastoService.criar({
          descricao: gasto.descricao,
          valor: gasto.valor,
          data: gasto.data,
          direcao: gasto.direcao,
          mesReferencia: mes,
        }),
      );
      forkJoin(requests).subscribe({
        next: () => {
          this.notification.sucesso(`Gasto duplicado para ${meses.length} mês(es).`);
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível duplicar o gasto.')),
      });
    });
  }

  excluir(gasto: GastoCompartilhado): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Excluir gasto compartilhado',
        mensagem: `Deseja excluir o gasto "${gasto.descricao}"?`,
      },
    });
    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) {
        return;
      }
      this.gastoService.deletar(gasto.id).subscribe({
        next: () => {
          this.notification.sucesso('Gasto excluído com sucesso.');
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível excluir o gasto.')),
      });
    });
  }
}
