package com.eduardo.financas.categoria;

import com.eduardo.financas.security.UsuarioContexto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final UsuarioContexto usuarioContexto;

    public CategoriaService(CategoriaRepository categoriaRepository, UsuarioContexto usuarioContexto) {
        this.categoriaRepository = categoriaRepository;
        this.usuarioContexto = usuarioContexto;
    }

    @Transactional(readOnly = true)
    public List<Categoria> listar() {
        return categoriaRepository.findByUsuarioId(usuarioContexto.idUsuarioAtual());
    }

    @Transactional(readOnly = true)
    public List<Categoria> listarPorTipo(TipoCategoria tipo) {
        return categoriaRepository.findByUsuarioIdAndTipo(usuarioContexto.idUsuarioAtual(), tipo);
    }

    @Transactional(readOnly = true)
    public Categoria buscarPorId(Long id) {
        return categoriaRepository.findByIdAndUsuarioId(id, usuarioContexto.idUsuarioAtual())
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada: " + id));
    }

    public Categoria criar(String nome, TipoCategoria tipo) {
        Categoria categoria = new Categoria(usuarioContexto.referenciaUsuarioAtual(), nome, tipo);
        return categoriaRepository.save(categoria);
    }

    public Categoria atualizar(Long id, String nome, TipoCategoria tipo) {
        Categoria categoria = buscarPorId(id);
        categoria.setNome(nome);
        categoria.setTipo(tipo);
        return categoria;
    }

    public void deletar(Long id) {
        categoriaRepository.delete(buscarPorId(id));
    }
}
