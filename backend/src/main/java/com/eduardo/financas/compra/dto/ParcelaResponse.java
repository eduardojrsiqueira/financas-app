package com.eduardo.financas.compra.dto;

import com.eduardo.financas.compra.Parcela;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.YearMonth;

@Data
@AllArgsConstructor
public class ParcelaResponse {

    private Long id;
    private Integer numeroParcela;
    private BigDecimal valor;
    private YearMonth mesReferencia;

    public static ParcelaResponse from(Parcela parcela) {
        return new ParcelaResponse(parcela.getId(), parcela.getNumeroParcela(), parcela.getValor(),
                parcela.getMesReferencia());
    }
}
