package com.eduardo.financas.gastorecorrente.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GastoRecorrenteRequest {

    @NotNull
    private Long categoriaId;

    @NotBlank
    private String nome;
}
