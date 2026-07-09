package com.eduardo.financas.gastocompartilhado;

import com.eduardo.financas.shared.MesReferenciaConverter;
import com.eduardo.financas.usuario.Usuario;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;

@Entity
@Table(name = "gasto_compartilhado")
@Getter
@Setter
@NoArgsConstructor
public class GastoCompartilhado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 255)
    private String descricao;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false)
    private LocalDate data;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DirecaoGasto direcao;

    @Column(nullable = false)
    private boolean quitado = false;

    @Convert(converter = MesReferenciaConverter.class)
    @Column(name = "mes_referencia", nullable = false, length = 7)
    private YearMonth mesReferencia;

    public GastoCompartilhado(Usuario usuario, String descricao, BigDecimal valor, LocalDate data,
                               DirecaoGasto direcao, YearMonth mesReferencia) {
        this.usuario = usuario;
        this.descricao = descricao;
        this.valor = valor;
        this.data = data;
        this.direcao = direcao;
        this.mesReferencia = mesReferencia;
    }
}
