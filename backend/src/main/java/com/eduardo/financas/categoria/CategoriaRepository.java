package com.eduardo.financas.categoria;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    List<Categoria> findByUsuarioId(Long usuarioId);

    List<Categoria> findByUsuarioIdAndTipo(Long usuarioId, TipoCategoria tipo);

    Optional<Categoria> findByIdAndUsuarioId(Long id, Long usuarioId);
}
