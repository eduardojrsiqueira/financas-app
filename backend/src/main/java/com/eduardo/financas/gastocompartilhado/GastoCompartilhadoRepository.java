package com.eduardo.financas.gastocompartilhado;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

public interface GastoCompartilhadoRepository extends JpaRepository<GastoCompartilhado, Long> {

    List<GastoCompartilhado> findByUsuarioId(Long usuarioId);

    List<GastoCompartilhado> findByUsuarioIdAndMesReferencia(Long usuarioId, YearMonth mesReferencia);

    List<GastoCompartilhado> findByUsuarioIdAndQuitadoFalse(Long usuarioId);

    List<GastoCompartilhado> findByUsuarioIdAndMesReferenciaAndQuitadoFalse(Long usuarioId, YearMonth mesReferencia);

    Optional<GastoCompartilhado> findByIdAndUsuarioId(Long id, Long usuarioId);
}
