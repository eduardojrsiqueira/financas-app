package com.eduardo.financas.compra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CompraRepository extends JpaRepository<Compra, Long> {

    @Query("SELECT DISTINCT c FROM Compra c LEFT JOIN FETCH c.parcelas WHERE c.usuario.id = :usuarioId")
    List<Compra> listarComParcelas(@Param("usuarioId") Long usuarioId);

    @Query("SELECT DISTINCT c FROM Compra c LEFT JOIN FETCH c.parcelas "
            + "WHERE c.cartao.id = :cartaoId AND c.usuario.id = :usuarioId")
    List<Compra> findByCartaoIdComParcelas(@Param("cartaoId") Long cartaoId, @Param("usuarioId") Long usuarioId);

    @Query("SELECT DISTINCT c FROM Compra c LEFT JOIN FETCH c.parcelas WHERE c.id = :id AND c.usuario.id = :usuarioId")
    Optional<Compra> findByIdComParcelas(@Param("id") Long id, @Param("usuarioId") Long usuarioId);
}
