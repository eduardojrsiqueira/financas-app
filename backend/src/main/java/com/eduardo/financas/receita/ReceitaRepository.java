package com.eduardo.financas.receita;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.YearMonth;
import java.util.List;

public interface ReceitaRepository extends JpaRepository<Receita, Long> {

    List<Receita> findByMesReferencia(YearMonth mesReferencia);
}
