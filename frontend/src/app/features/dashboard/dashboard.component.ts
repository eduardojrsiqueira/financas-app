import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { CompraService } from '../../core/services/compra.service';
import { GastoCompartilhadoService } from '../../core/services/gasto-compartilhado.service';
import { GastoRecorrenteService } from '../../core/services/gasto-recorrente.service';
import { ReceitaService } from '../../core/services/receita.service';
import { MesAnoPickerComponent } from '../../shared/mes-ano-picker/mes-ano-picker.component';
import { formatarMesReferencia, mesAtual } from '../../shared/date.util';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgFor,
    NgIf,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MesAnoPickerComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly receitaService = inject(ReceitaService);
  private readonly compraService = inject(CompraService);
  private readonly gastoRecorrenteService = inject(GastoRecorrenteService);
  private readonly gastoCompartilhadoService = inject(GastoCompartilhadoService);
  private readonly notification = inject(NotificationService);

  carregando = false;
  mesSelecionado = mesAtual();

  totalReceitas = 0;
  totalDespesas = 0;
  saldo = 0;
  saldoCompartilhado = 0;
  totalCartoes = 0;
  cartoesBreakdown: { cartaoNome: string; total: number }[] = [];
  totalGastosRecorrentes = 0;
  gastosRecorrentesPago = 0;
  gastosRecorrentesPendente = 0;
  totalPendenteCompartilhado = 0;
  pendenteEuParaEla = 0;
  pendenteElaParaEu = 0;

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
    forkJoin({
      receitas: this.receitaService.listar(this.mesSelecionado),
      compras: this.compraService.listar(),
      lancamentos: this.gastoRecorrenteService.listarLancamentosPorMes(this.mesSelecionado),
      gastosCompartilhados: this.gastoCompartilhadoService.listar(this.mesSelecionado),
    }).subscribe({
      next: ({ receitas, compras, lancamentos, gastosCompartilhados }) => {
        this.totalReceitas = receitas.reduce((soma, receita) => soma + receita.valor, 0);

        const parcelasDoMes = compras.flatMap((compra) =>
          compra.parcelas
            .filter((parcela) => parcela.mesReferencia === this.mesSelecionado)
            .map((parcela) => ({ cartaoNome: compra.cartaoNome, valor: parcela.valor })),
        );
        this.totalCartoes = parcelasDoMes.reduce((soma, parcela) => soma + parcela.valor, 0);

        const porCartao = new Map<string, number>();
        for (const parcela of parcelasDoMes) {
          porCartao.set(parcela.cartaoNome, (porCartao.get(parcela.cartaoNome) ?? 0) + parcela.valor);
        }
        this.cartoesBreakdown = Array.from(porCartao.entries())
          .map(([cartaoNome, total]) => ({ cartaoNome, total }))
          .sort((a, b) => b.total - a.total);

        this.totalGastosRecorrentes = lancamentos.reduce((soma, lancamento) => soma + lancamento.valor, 0);
        this.gastosRecorrentesPago = lancamentos
          .filter((lancamento) => lancamento.pago)
          .reduce((soma, lancamento) => soma + lancamento.valor, 0);
        this.gastosRecorrentesPendente = this.totalGastosRecorrentes - this.gastosRecorrentesPago;
        this.totalDespesas = this.totalCartoes + this.totalGastosRecorrentes;

        const pendentes = gastosCompartilhados.filter((gasto) => !gasto.quitado);
        this.pendenteEuParaEla = pendentes
          .filter((gasto) => gasto.direcao === 'EU_PARA_ELA')
          .reduce((soma, gasto) => soma + gasto.valor, 0);
        this.pendenteElaParaEu = pendentes
          .filter((gasto) => gasto.direcao === 'ELA_PARA_EU')
          .reduce((soma, gasto) => soma + gasto.valor, 0);
        this.totalPendenteCompartilhado = this.pendenteEuParaEla + this.pendenteElaParaEu;

        this.saldoCompartilhado = this.pendenteElaParaEu - this.pendenteEuParaEla;
        this.saldo = this.totalReceitas - this.totalDespesas + this.saldoCompartilhado;

        this.carregando = false;
      },
      error: () => {
        this.notification.erro('Não foi possível carregar o resumo do dashboard.');
        this.carregando = false;
      },
    });
  }
}
