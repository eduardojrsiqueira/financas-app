package com.eduardo.financas.categoria;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public List<Categoria> listar() {
        return categoriaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Categoria> listarPorTipo(TipoCategoria tipo) {
        return categoriaRepository.findByTipo(tipo);
    }

    @Transactional(readOnly = true)
    public Categoria buscarPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada: " + id));
    }

    public Categoria criar(String nome, TipoCategoria tipo) {
        return categoriaRepository.save(new Categoria(nome, tipo));
    }

    public Categoria atualizar(Long id, String nome, TipoCategoria tipo) {
        Categoria categoria = buscarPorId(id);
        categoria.setNome(nome);
        categoria.setTipo(tipo);
        return categoria;
    }

    public void deletar(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new EntityNotFoundException("Categoria não encontrada: " + id);
        }
        categoriaRepository.deleteById(id);
    }
}
