package com.eduardo.financas.compra;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.YearMonth;
import java.util.List;

public interface ParcelaRepository extends JpaRepository<Parcela, Long> {

    List<Parcela> findByCompraId(Long compraId);

    List<Parcela> findByMesReferencia(YearMonth mesReferencia);
}
