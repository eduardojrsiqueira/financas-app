package com.eduardo.financas.gastorecorrente.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.YearMonth;

@Data
public class LancamentoRecorrenteRequest {

    @NotNull
    private YearMonth mesReferencia;

    @NotNull
    @Positive
    private BigDecimal valor;
}
