package com.eduardo.financas.gastorecorrente;

import com.eduardo.financas.categoria.Categoria;
import com.eduardo.financas.usuario.Usuario;
import jakarta.persistence.Column;
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

@Entity
@Table(name = "gasto_recorrente")
@Getter
@Setter
@NoArgsConstructor
public class GastoRecorrente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(nullable = false, length = 100)
    private String nome;

    public GastoRecorrente(Usuario usuario, Categoria categoria, String nome) {
        this.usuario = usuario;
        this.categoria = categoria;
        this.nome = nome;
    }
}
