package com.eduardo.financas.receita.dto;

import com.eduardo.financas.receita.Receita;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.YearMonth;

@Data
@AllArgsConstructor
public class ReceitaResponse {

    private Long id;
    private Long categoriaId;
    private String categoriaNome;
    private String descricao;
    private BigDecimal valor;
    private YearMonth mesReferencia;

    public static ReceitaResponse from(Receita receita) {
        return new ReceitaResponse(
                receita.getId(),
                receita.getCategoria().getId(),
                receita.getCategoria().getNome(),
                receita.getDescricao(),
                receita.getValor(),
                receita.getMesReferencia());
    }
}
