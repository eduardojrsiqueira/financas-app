package com.eduardo.financas.cartao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartaoRepository extends JpaRepository<Cartao, Long> {

    List<Cartao> findByUsuarioId(Long usuarioId);

    Optional<Cartao> findByIdAndUsuarioId(Long id, Long usuarioId);
}
