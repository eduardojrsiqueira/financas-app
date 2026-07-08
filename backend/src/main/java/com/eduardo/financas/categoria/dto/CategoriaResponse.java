package com.eduardo.financas.categoria.dto;

import com.eduardo.financas.categoria.Categoria;
import com.eduardo.financas.categoria.TipoCategoria;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoriaResponse {

    private Long id;
    private String nome;
    private TipoCategoria tipo;

    public static CategoriaResponse from(Categoria categoria) {
        return new CategoriaResponse(categoria.getId(), categoria.getNome(), categoria.getTipo());
    }
}
