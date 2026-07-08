package com.eduardo.financas.cartao.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartaoRequest {

    @NotBlank
    private String nome;

    private String bandeira;

    @NotNull
    @Min(1)
    @Max(31)
    private Integer diaFechamento;

    @NotNull
    @Min(1)
    @Max(31)
    private Integer diaVencimento;
}
