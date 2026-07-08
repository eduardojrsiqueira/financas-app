package com.eduardo.financas.gastocompartilhado.dto;

import com.eduardo.financas.gastocompartilhado.DirecaoGasto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;

@Data
public class GastoCompartilhadoRequest {

    @NotBlank
    private String descricao;

    @NotNull
    @Positive
    private BigDecimal valor;

    @NotNull
    private LocalDate data;

    @NotNull
    private DirecaoGasto direcao;

    @NotNull
    private YearMonth mesReferencia;
}
