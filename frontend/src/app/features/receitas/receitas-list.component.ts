import { CurrencyPipe, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';
import { Receita } from '../../core/models/receita.model';
import { ReceitaService } from '../../core/services/receita.service';
import { formatarMesReferencia, mesAtual, sequenciaMeses } from '../../shared/date.util';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import {
  DuplicarDialogComponent,
  DuplicarDialogResultado,
} from '../../shared/duplicar-dialog/duplicar-dialog.component';
import { mensagemErro } from '../../shared/http-error.util';
import { MesAnoPickerComponent } from '../../shared/mes-ano-picker/mes-ano-picker.component';
import { NotificationService } from '../../shared/notification.service';
import { ReceitaFormDialogComponent } from './receita-form-dialog.component';

@Component({
  selector: 'app-receitas-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgIf,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MesAnoPickerComponent,
  ],
  templateUrl: './receitas-list.component.html',
})
export class ReceitasListComponent implements OnInit {
  private readonly receitaService = inject(ReceitaService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  receitas: Receita[] = [];
  carregando = false;
  mesSelecionado = mesAtual();
  readonly displayedColumns = ['descricao', 'categoriaNome', 'mesReferencia', 'valor', 'acoes'];
  readonly formatarMesReferencia = formatarMesReferencia;

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
    this.receitaService.listar(this.mesSelecionado).subscribe({
      next: (receitas) => {
        this.receitas = receitas.sort((a, b) => a.categoriaNome.localeCompare(b.categoriaNome));
        this.carregando = false;
      },
      error: () => {
        this.notification.erro('Não foi possível carregar as receitas.');
        this.carregando = false;
      },
    });
  }

  novo(): void {
    const ref = this.dialog.open(ReceitaFormDialogComponent, { data: {} });
    ref.afterClosed().subscribe((request) => {
      if (!request) {
        return;
      }
      this.receitaService.criar(request).subscribe({
        next: () => {
          this.notification.sucesso('Receita criada com sucesso.');
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível criar a receita.')),
      });
    });
  }

  editar(receita: Receita): void {
    const ref = this.dialog.open(ReceitaFormDialogComponent, { data: { receita } });
    ref.afterClosed().subscribe((request) => {
      if (!request) {
        return;
      }
      this.receitaService.atualizar(receita.id, request).subscribe({
        next: () => {
          this.notification.sucesso('Receita atualizada com sucesso.');
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível atualizar a receita.')),
      });
    });
  }

  duplicar(receita: Receita): void {
    const ref = this.dialog.open(DuplicarDialogComponent, {
      data: { titulo: 'Duplicar Receita', mesReferenciaOrigem: receita.mesReferencia },
    });
    ref.afterClosed().subscribe((resultado?: DuplicarDialogResultado) => {
      if (!resultado) {
        return;
      }
      const meses = sequenciaMeses(resultado.mesInicial, resultado.quantidadeMeses);
      const requests = meses.map((mes) =>
        this.receitaService.criar({
          categoriaId: receita.categoriaId,
          descricao: receita.descricao,
          valor: receita.valor,
          mesReferencia: mes,
        }),
      );
      forkJoin(requests).subscribe({
        next: () => {
          this.notification.sucesso(`Receita duplicada para ${meses.length} mês(es).`);
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível duplicar a receita.')),
      });
    });
  }

  excluir(receita: Receita): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Excluir receita',
        mensagem: `Deseja excluir a receita "${receita.descricao}"?`,
      },
    });
    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) {
        return;
      }
      this.receitaService.deletar(receita.id).subscribe({
        next: () => {
          this.notification.sucesso('Receita excluída com sucesso.');
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível excluir a receita.')),
      });
    });
  }
}
