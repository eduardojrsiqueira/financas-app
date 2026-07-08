package com.eduardo.financas.gastorecorrente;

import com.eduardo.financas.shared.MesReferenciaConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
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
import java.time.YearMonth;

@Entity
@Table(name = "lancamento_recorrente")
@Getter
@Setter
@NoArgsConstructor
public class LancamentoRecorrente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "gasto_recorrente_id", nullable = false)
    private GastoRecorrente gastoRecorrente;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valor;

    @Convert(converter = MesReferenciaConverter.class)
    @Column(name = "mes_referencia", nullable = false, length = 7)
    private YearMonth mesReferencia;

    @Column(nullable = false)
    private boolean pago = false;

    public LancamentoRecorrente(GastoRecorrente gastoRecorrente, BigDecimal valor, YearMonth mesReferencia) {
        this.gastoRecorrente = gastoRecorrente;
        this.valor = valor;
        this.mesReferencia = mesReferencia;
    }
}
