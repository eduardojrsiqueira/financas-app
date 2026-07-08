package com.eduardo.financas.compra.dto;

import com.eduardo.financas.compra.Compra;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class CompraResponse {

    private Long id;
    private Long cartaoId;
    private String cartaoNome;
    private Long categoriaId;
    private String categoriaNome;
    private String descricao;
    private BigDecimal valorTotal;
    private LocalDate dataCompra;
    private Integer numeroParcelas;
    private List<ParcelaResponse> parcelas;

    public static CompraResponse from(Compra compra) {
        return new CompraResponse(
                compra.getId(),
                compra.getCartao().getId(),
                compra.getCartao().getNome(),
                compra.getCategoria().getId(),
                compra.getCategoria().getNome(),
                compra.getDescricao(),
                compra.getValorTotal(),
                compra.getDataCompra(),
                compra.getNumeroParcelas(),
                compra.getParcelas().stream().map(ParcelaResponse::from).toList());
    }
}
