import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';
import { Compra, Parcela } from '../../core/models/compra.model';
import { CompraService } from '../../core/services/compra.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { formatarMesReferencia, mesAtual, mesDeData, sequenciaMeses, substituirMes } from '../../shared/date.util';
import {
  DuplicarDialogComponent,
  DuplicarDialogResultado,
} from '../../shared/duplicar-dialog/duplicar-dialog.component';
import { mensagemErro } from '../../shared/http-error.util';
import { MesAnoPickerComponent } from '../../shared/mes-ano-picker/mes-ano-picker.component';
import { NotificationService } from '../../shared/notification.service';
import { CompraFormDialogComponent } from './compra-form-dialog.component';

interface ItemCompraMes {
  compra: Compra;
  parcela: Parcela;
}

interface GrupoCartao {
  cartaoId: number;
  cartaoNome: string;
  itens: ItemCompraMes[];
  total: number;
}

@Component({
  selector: 'app-compras-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    NgFor,
    NgIf,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MesAnoPickerComponent,
  ],
  templateUrl: './compras-list.component.html',
})
export class ComprasListComponent implements OnInit {
  private readonly compraService = inject(CompraService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  private todasCompras: Compra[] = [];
  grupos: GrupoCartao[] = [];
  carregando = false;
  expandidaId: number | null = null;
  mesSelecionado = mesAtual();
  readonly formatarMesReferencia = formatarMesReferencia;

  get mesFormatado(): string {
    return formatarMesReferencia(this.mesSelecionado);
  }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.compraService.listar().subscribe({
      next: (compras) => {
        compras.forEach((compra) => compra.parcelas.sort((a, b) => a.numeroParcela - b.numeroParcela));
        this.todasCompras = compras;
        this.recalcularGrupos();
        this.carregando = false;
      },
      error: () => {
        this.notification.erro('Não foi possível carregar as compras.');
        this.carregando = false;
      },
    });
  }

  onMesChange(): void {
    if (this.mesSelecionado) {
      this.recalcularGrupos();
    }
  }

  private recalcularGrupos(): void {
    this.grupos = this.agruparPorCartao(this.todasCompras, this.mesSelecionado);
  }

  private agruparPorCartao(compras: Compra[], mes: string): GrupoCartao[] {
    const grupos = new Map<number, GrupoCartao>();
    for (const compra of compras) {
      const parcela = compra.parcelas.find((p) => p.mesReferencia === mes);
      if (!parcela) {
        continue;
      }
      let grupo = grupos.get(compra.cartaoId);
      if (!grupo) {
        grupo = { cartaoId: compra.cartaoId, cartaoNome: compra.cartaoNome, itens: [], total: 0 };
        grupos.set(compra.cartaoId, grupo);
      }
      grupo.itens.push({ compra, parcela });
      grupo.total += parcela.valor;
    }
    for (const grupo of grupos.values()) {
      grupo.itens.sort(
        (a, b) =>
          a.compra.categoriaNome.localeCompare(b.compra.categoriaNome) ||
          b.compra.dataCompra.localeCompare(a.compra.dataCompra),
      );
    }
    return Array.from(grupos.values()).sort((a, b) => a.cartaoNome.localeCompare(b.cartaoNome));
  }

  alternarExpansao(compra: Compra): void {
    this.expandidaId = this.expandidaId === compra.id ? null : compra.id;
  }

  novo(): void {
    const ref = this.dialog.open(CompraFormDialogComponent, { width: '480px' });
    ref.afterClosed().subscribe((request) => {
      if (!request) {
        return;
      }
      this.compraService.criar(request).subscribe({
        next: () => {
          this.notification.sucesso('Compra criada com sucesso.');
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível criar a compra.')),
      });
    });
  }

  duplicar(compra: Compra): void {
    const ref = this.dialog.open(DuplicarDialogComponent, {
      data: { titulo: 'Duplicar Compra', mesReferenciaOrigem: mesDeData(compra.dataCompra) },
    });
    ref.afterClosed().subscribe((resultado?: DuplicarDialogResultado) => {
      if (!resultado) {
        return;
      }
      const meses = sequenciaMeses(resultado.mesInicial, resultado.quantidadeMeses);
      const requests = meses.map((mes) =>
        this.compraService.criar({
          cartaoId: compra.cartaoId,
          categoriaId: compra.categoriaId,
          descricao: compra.descricao,
          valorTotal: compra.valorTotal,
          dataCompra: substituirMes(compra.dataCompra, mes),
          numeroParcelas: compra.numeroParcelas,
        }),
      );
      forkJoin(requests).subscribe({
        next: () => {
          this.notification.sucesso(`Compra duplicada para ${meses.length} mês(es).`);
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível duplicar a compra.')),
      });
    });
  }

  excluir(compra: Compra): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Excluir compra',
        mensagem: `Deseja excluir a compra "${compra.descricao}"? Todas as parcelas serão removidas.`,
      },
    });
    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) {
        return;
      }
      this.compraService.deletar(compra.id).subscribe({
        next: () => {
          this.notification.sucesso('Compra excluída com sucesso.');
          this.carregar();
        },
        error: (err) => this.notification.erro(mensagemErro(err, 'Não foi possível excluir a compra.')),
      });
    });
  }
}
