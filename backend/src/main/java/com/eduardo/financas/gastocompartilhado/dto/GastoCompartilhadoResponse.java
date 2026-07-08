package com.eduardo.financas.gastocompartilhado.dto;

import com.eduardo.financas.gastocompartilhado.DirecaoGasto;
import com.eduardo.financas.gastocompartilhado.GastoCompartilhado;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;

@Data
@AllArgsConstructor
public class GastoCompartilhadoResponse {

    private Long id;
    private String descricao;
    private BigDecimal valor;
    private LocalDate data;
    private DirecaoGasto direcao;
    private boolean quitado;
    private YearMonth mesReferencia;

    public static GastoCompartilhadoResponse from(GastoCompartilhado gasto) {
        return new GastoCompartilhadoResponse(
                gasto.getId(),
                gasto.getDescricao(),
                gasto.getValor(),
                gasto.getData(),
                gasto.getDirecao(),
                gasto.isQuitado(),
                gasto.getMesReferencia());
    }
}
