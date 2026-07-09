package com.eduardo.financas.gastorecorrente;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

public interface LancamentoRecorrenteRepository extends JpaRepository<LancamentoRecorrente, Long> {

    List<LancamentoRecorrente> findByGastoRecorrenteId(Long gastoRecorrenteId);

    Optional<LancamentoRecorrente> findByGastoRecorrenteIdAndMesReferencia(Long gastoRecorrenteId,
                                                                            YearMonth mesReferencia);

    @Query("SELECT l FROM LancamentoRecorrente l WHERE l.mesReferencia = :mes AND l.gastoRecorrente.usuario.id = :usuarioId")
    List<LancamentoRecorrente> findByMesReferenciaEUsuario(@Param("mes") YearMonth mes,
                                                            @Param("usuarioId") Long usuarioId);

    @Query("SELECT l FROM LancamentoRecorrente l WHERE l.id = :id AND l.gastoRecorrente.usuario.id = :usuarioId")
    Optional<LancamentoRecorrente> findByIdEUsuario(@Param("id") Long id, @Param("usuarioId") Long usuarioId);
}
