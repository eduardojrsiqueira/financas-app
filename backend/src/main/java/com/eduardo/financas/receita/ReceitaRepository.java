package com.eduardo.financas.receita;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

public interface ReceitaRepository extends JpaRepository<Receita, Long> {

    List<Receita> findByUsuarioId(Long usuarioId);

    List<Receita> findByUsuarioIdAndMesReferencia(Long usuarioId, YearMonth mesReferencia);

    Optional<Receita> findByIdAndUsuarioId(Long id, Long usuarioId);
}
