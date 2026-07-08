package com.eduardo.financas.compra;

import com.eduardo.financas.cartao.Cartao;
import com.eduardo.financas.categoria.Categoria;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "compra")
@Getter
@Setter
@NoArgsConstructor
public class Compra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cartao_id", nullable = false)
    private Cartao cartao;

    @ManyToOne(optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(nullable = false, length = 255)
    private String descricao;

    @Column(name = "valor_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal valorTotal;

    @Column(name = "data_compra", nullable = false)
    private LocalDate dataCompra;

    @Column(name = "numero_parcelas", nullable = false)
    private Integer numeroParcelas;

    @OneToMany(mappedBy = "compra", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Parcela> parcelas = new ArrayList<>();

    public Compra(Cartao cartao, Categoria categoria, String descricao, BigDecimal valorTotal,
                  LocalDate dataCompra, Integer numeroParcelas) {
        this.cartao = cartao;
        this.categoria = categoria;
        this.descricao = descricao;
        this.valorTotal = valorTotal;
        this.dataCompra = dataCompra;
        this.numeroParcelas = numeroParcelas;
    }

    void adicionarParcela(Parcela parcela) {
        parcela.setCompra(this);
        parcelas.add(parcela);
    }
}
