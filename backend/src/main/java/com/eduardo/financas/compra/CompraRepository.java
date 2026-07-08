package com.eduardo.financas.compra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CompraRepository extends JpaRepository<Compra, Long> {

    @Query("SELECT DISTINCT c FROM Compra c LEFT JOIN FETCH c.parcelas")
    List<Compra> listarComParcelas();

    @Query("SELECT DISTINCT c FROM Compra c LEFT JOIN FETCH c.parcelas WHERE c.cartao.id = :cartaoId")
    List<Compra> findByCartaoIdComParcelas(Long cartaoId);

    @Query("SELECT DISTINCT c FROM Compra c LEFT JOIN FETCH c.parcelas WHERE c.id = :id")
    Optional<Compra> findByIdComParcelas(Long id);
}
