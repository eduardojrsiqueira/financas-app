package com.eduardo.financas.gastorecorrente;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

public interface LancamentoRecorrenteRepository extends JpaRepository<LancamentoRecorrente, Long> {

    List<LancamentoRecorrente> findByMesReferencia(YearMonth mesReferencia);

    List<LancamentoRecorrente> findByGastoRecorrenteId(Long gastoRecorrenteId);

    Optional<LancamentoRecorrente> findByGastoRecorrenteIdAndMesReferencia(Long gastoRecorrenteId,
                                                                            YearMonth mesReferencia);
}
