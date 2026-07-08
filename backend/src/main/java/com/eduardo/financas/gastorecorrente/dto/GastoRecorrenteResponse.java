package com.eduardo.financas.gastorecorrente.dto;

import com.eduardo.financas.gastorecorrente.GastoRecorrente;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GastoRecorrenteResponse {

    private Long id;
    private Long categoriaId;
    private String categoriaNome;
    private String nome;

    public static GastoRecorrenteResponse from(GastoRecorrente gastoRecorrente) {
        return new GastoRecorrenteResponse(
                gastoRecorrente.getId(),
                gastoRecorrente.getCategoria().getId(),
                gastoRecorrente.getCategoria().getNome(),
                gastoRecorrente.getNome());
    }
}
