package com.eduardo.financas.cartao.dto;

import com.eduardo.financas.cartao.Cartao;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CartaoResponse {

    private Long id;
    private String nome;
    private String bandeira;
    private Integer diaFechamento;
    private Integer diaVencimento;

    public static CartaoResponse from(Cartao cartao) {
        return new CartaoResponse(cartao.getId(), cartao.getNome(), cartao.getBandeira(),
                cartao.getDiaFechamento(), cartao.getDiaVencimento());
    }
}
