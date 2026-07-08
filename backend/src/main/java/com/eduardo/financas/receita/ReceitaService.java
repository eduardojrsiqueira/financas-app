package com.eduardo.financas.receita;

import com.eduardo.financas.categoria.Categoria;
import com.eduardo.financas.categoria.CategoriaRepository;
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

    public ReceitaService(ReceitaRepository receitaRepository, CategoriaRepository categoriaRepository) {
        this.receitaRepository = receitaRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public List<Receita> listar() {
        return receitaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Receita> listarPorMes(YearMonth mesReferencia) {
        return receitaRepository.findByMesReferencia(mesReferencia);
    }

    @Transactional(readOnly = true)
    public Receita buscarPorId(Long id) {
        return receitaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Receita não encontrada: " + id));
    }

    public Receita criar(Long categoriaId, String descricao, BigDecimal valor, YearMonth mesReferencia) {
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada: " + categoriaId));
        return receitaRepository.save(new Receita(categoria, descricao, valor, mesReferencia));
    }

    public Receita atualizar(Long id, String descricao, BigDecimal valor, YearMonth mesReferencia) {
        Receita receita = buscarPorId(id);
        receita.setDescricao(descricao);
        receita.setValor(valor);
        receita.setMesReferencia(mesReferencia);
        return receita;
    }

    public void deletar(Long id) {
        if (!receitaRepository.existsById(id)) {
            throw new EntityNotFoundException("Receita não encontrada: " + id);
        }
        receitaRepository.deleteById(id);
    }
}
