package com.eduardo.financas.receita;

import com.eduardo.financas.categoria.Categoria;
import com.eduardo.financas.categoria.CategoriaRepository;
import com.eduardo.financas.security.UsuarioContexto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;

@Service
@Transactional
public class ReceitaService {

    private final ReceitaRepository receitaRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioContexto usuarioContexto;

    public ReceitaService(ReceitaRepository receitaRepository, CategoriaRepository categoriaRepository,
                           UsuarioContexto usuarioContexto) {
        this.receitaRepository = receitaRepository;
        this.categoriaRepository = categoriaRepository;
        this.usuarioContexto = usuarioContexto;
    }

    @Transactional(readOnly = true)
    public List<Receita> listar() {
        return receitaRepository.findByUsuarioId(usuarioContexto.idUsuarioAtual());
    }

    @Transactional(readOnly = true)
    public List<Receita> listarPorMes(YearMonth mesReferencia) {
        return receitaRepository.findByUsuarioIdAndMesReferencia(usuarioContexto.idUsuarioAtual(), mesReferencia);
    }

    @Transactional(readOnly = true)
    public Receita buscarPorId(Long id) {
        return receitaRepository.findByIdAndUsuarioId(id, usuarioContexto.idUsuarioAtual())
                .orElseThrow(() -> new EntityNotFoundException("Receita não encontrada: " + id));
    }

    public Receita criar(Long categoriaId, String descricao, BigDecimal valor, YearMonth mesReferencia) {
        Categoria categoria = categoriaRepository.findByIdAndUsuarioId(categoriaId, usuarioContexto.idUsuarioAtual())
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada: " + categoriaId));
        Receita receita = new Receita(usuarioContexto.referenciaUsuarioAtual(), categoria, descricao, valor,
                mesReferencia);
        return receitaRepository.save(receita);
    }

    public Receita atualizar(Long id, String descricao, BigDecimal valor, YearMonth mesReferencia) {
        Receita receita = buscarPorId(id);
        receita.setDescricao(descricao);
        receita.setValor(valor);
        receita.setMesReferencia(mesReferencia);
        return receita;
    }

    public void deletar(Long id) {
        receitaRepository.delete(buscarPorId(id));
    }
}
