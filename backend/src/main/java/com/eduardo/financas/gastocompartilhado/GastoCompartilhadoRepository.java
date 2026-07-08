package com.eduardo.financas.gastocompartilhado;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.YearMonth;
import java.util.List;

public interface GastoCompartilhadoRepository extends JpaRepository<GastoCompartilhado, Long> {

    List<GastoCompartilhado> findByMesReferencia(YearMonth mesReferencia);

    List<GastoCompartilhado> findByQuitadoFalse();

    List<GastoCompartilhado> findByMesReferenciaAndQuitadoFalse(YearMonth mesReferencia);
}
