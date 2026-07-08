package com.eduardo.financas.gastorecorrente.dto;

import com.eduardo.financas.gastorecorrente.LancamentoRecorrente;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.YearMonth;

@Data
@AllArgsConstructor
public class LancamentoRecorrenteResponse {

    private Long id;
    private Long gastoRecorrenteId;
    private String gastoRecorrenteNome;
    private BigDecimal valor;
    private YearMonth mesReferencia;
    private boolean pago;

    public static LancamentoRecorrenteResponse from(LancamentoRecorrente lancamento) {
        return new LancamentoRecorrenteResponse(
                lancamento.getId(),
                lancamento.getGastoRecorrente().getId(),
                lancamento.getGastoRecorrente().getNome(),
                lancamento.getValor(),
                lancamento.getMesReferencia(),
                lancamento.isPago());
    }
}
