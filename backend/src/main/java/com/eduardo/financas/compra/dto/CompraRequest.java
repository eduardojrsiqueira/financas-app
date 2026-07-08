package com.eduardo.financas.compra.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CompraRequest {

    @NotNull
    private Long cartaoId;

    @NotNull
    private Long categoriaId;

    @NotBlank
    private String descricao;

    @NotNull
    @Positive
    private BigDecimal valorTotal;

    @NotNull
    private LocalDate dataCompra;

    @NotNull
    @Positive
    private Integer numeroParcelas;
}
