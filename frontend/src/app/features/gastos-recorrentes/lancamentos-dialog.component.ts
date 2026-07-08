import { CurrencyPipe, NgIf } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';
import { GastoRecorrente, LancamentoRecorrente } from '../../core/models/gasto-recorrente.model';
import { GastoRecorrenteService } from '../../core/services/gasto-recorrente.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { formatarMesReferencia, mesAtual, sequenciaMeses } from '../../shared/date.util';
import {
  DuplicarDialogComponent,
  DuplicarDialogResultado,
} from '../../shared/duplicar-dialog/duplicar-dialog.component';
import { mensagemErro } from '../../shared/http-error.util';
import { MesAnoPickerComponent } from '../../shared/mes-ano-picker/mes-ano-picker.component';
import { NotificationService } from '../../shared/notification.service';

export interface LancamentosDialogData {
  gastoRecorrente: GastoRecorrente;
}

@Component({
  selector: 'app-lancamentos-dialog',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgIf,
    ReactiveFormsModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MesAnoPickerComponent,
  ],
  templateUrl: './lancamentos-dialog.component.html',
})
export class LancamentosDialogComponent implements OnInit {
  private readonly gastoRecorrenteService = inject(GastoRecorrenteService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);

  lancamentos: LancamentoRecorrente[] = [];
  carregando = false;
  editandoId: number | null = null;
  readonly displayedColumns = ['mesReferencia', 'valor', 'pago', 'acoes'];
  readonly formatarMesReferencia = formatarMesReferencia;

  readonly form = this.fb.nonNullable.group({
    mesReferencia: [mesAtual(), Validators.required],
    valor: [null as unknown as number, [Validators.required, Validators.min(0.01)]],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: LancamentosDialogData) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.gastoRecorrenteService.listarLancamentos(this.data.gastoRecorrente.id).subscribe({
      next: (lancamentos) => {
        this.lancamentos = lancamentos;
        this.carregando = false;
      },
      error: () => {
        this.notification.erro('Não foi possível carregar os lançamentos.');
        this.carregando = false;
      },
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.editandoId) {
      this.gastoRecorrenteService.atualizarLancamento(this.editandoId, this.form.getRawValue()).subscribe({
        next: () => {
          this.notification.sucesso('Lançamento atualizado com sucesso.');
          this.cancelarEdicao();
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível atualizar o lançamento.')),
      });
      return;
    }

    this.gastoRecorrenteService.gerarLancamento(this.data.gastoRecorrente.id, this.form.getRawValue()).subscribe({
      next: () => {
        this.notification.sucesso('Lançamento gerado com sucesso.');
        this.form.reset({ mesReferencia: mesAtual(), valor: null as unknown as number });
        this.carregar();
      },
      error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível gerar o lançamento.')),
    });
  }

  editar(lancamento: LancamentoRecorrente): void {
    this.editandoId = lancamento.id;
    this.form.setValue({ mesReferencia: lancamento.mesReferencia, valor: lancamento.valor });
  }

  cancelarEdicao(): void {
    this.editandoId = null;
    this.form.reset({ mesReferencia: mesAtual(), valor: null as unknown as number });
  }

  duplicar(lancamento: LancamentoRecorrente): void {
    const ref = this.dialog.open(DuplicarDialogComponent, {
      data: { titulo: 'Duplicar Lançamento', mesReferenciaOrigem: lancamento.mesReferencia },
    });
    ref.afterClosed().subscribe((resultado?: DuplicarDialogResultado) => {
      if (!resultado) {
        return;
      }
      const meses = sequenciaMeses(resultado.mesInicial, resultado.quantidadeMeses);
      const requests = meses.map((mes) =>
        this.gastoRecorrenteService.gerarLancamento(this.data.gastoRecorrente.id, {
          mesReferencia: mes,
          valor: lancamento.valor,
        }),
      );
      forkJoin(requests).subscribe({
        next: () => {
          this.notification.sucesso(`Lançamento duplicado para ${meses.length} mês(es).`);
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível duplicar o lançamento.')),
      });
    });
  }

  excluir(lancamento: LancamentoRecorrente): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Excluir lançamento',
        mensagem: `Deseja excluir o lançamento de ${this.formatarMesReferencia(lancamento.mesReferencia)}?`,
      },
    });
    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) {
        return;
      }
      this.gastoRecorrenteService.excluirLancamento(lancamento.id).subscribe({
        next: () => {
          this.notification.sucesso('Lançamento excluído com sucesso.');
          if (this.editandoId === lancamento.id) {
            this.cancelarEdicao();
          }
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível excluir o lançamento.')),
      });
    });
  }

  marcarComoPago(lancamento: LancamentoRecorrente): void {
    this.gastoRecorrenteService.marcarComoPago(lancamento.id).subscribe({
      next: () => {
        this.notification.sucesso('Lançamento marcado como pago.');
        this.carregar();
      },
      error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível marcar como pago.')),
    });
  }
}
