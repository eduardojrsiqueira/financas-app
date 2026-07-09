package com.eduardo.financas.gastorecorrente;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GastoRecorrenteRepository extends JpaRepository<GastoRecorrente, Long> {

    List<GastoRecorrente> findByUsuarioId(Long usuarioId);

    Optional<GastoRecorrente> findByIdAndUsuarioId(Long id, Long usuarioId);
}
