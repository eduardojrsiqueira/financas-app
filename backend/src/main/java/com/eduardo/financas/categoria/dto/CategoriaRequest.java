package com.eduardo.financas.categoria.dto;

import com.eduardo.financas.categoria.TipoCategoria;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CategoriaRequest {

    @NotBlank
    private String nome;

    @NotNull
    private TipoCategoria tipo;
}
