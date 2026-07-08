package com.eduardo.financas.gastorecorrente;

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
public class GastoRecorrenteService {

    private final GastoRecorrenteRepository gastoRecorrenteRepository;
    private final LancamentoRecorrenteRepository lancamentoRecorrenteRepository;
    private final CategoriaRepository categoriaRepository;

    public GastoRecorrenteService(GastoRecorrenteRepository gastoRecorrenteRepository,
                                   LancamentoRecorrenteRepository lancamentoRecorrenteRepository,
                                   CategoriaRepository categoriaRepository) {
        this.gastoRecorrenteRepository = gastoRecorrenteRepository;
        this.lancamentoRecorrenteRepository = lancamentoRecorrenteRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public List<GastoRecorrente> listar() {
        return gastoRecorrenteRepository.findAll();
    }

    @Transactional(readOnly = true)
    public GastoRecorrente buscarPorId(Long id) {
        return gastoRecorrenteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Gasto recorrente não encontrado: " + id));
    }

    public GastoRecorrente criar(Long categoriaId, String nome) {
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada: " + categoriaId));
        return gastoRecorrenteRepository.save(new GastoRecorrente(categoria, nome));
    }

    public void deletar(Long id) {
        if (!gastoRecorrenteRepository.existsById(id)) {
            throw new EntityNotFoundException("Gasto recorrente não encontrado: " + id);
        }
        gastoRecorrenteRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<LancamentoRecorrente> listarLancamentosPorMes(YearMonth mesReferencia) {
        return lancamentoRecorrenteRepository.findByMesReferencia(mesReferencia);
    }

    @Transactional(readOnly = true)
    public List<LancamentoRecorrente> listarLancamentosPorGasto(Long gastoRecorrenteId) {
        return lancamentoRecorrenteRepository.findByGastoRecorrenteId(gastoRecorrenteId);
    }

    public LancamentoRecorrente gerarLancamento(Long gastoRecorrenteId, YearMonth mesReferencia, BigDecimal valor) {
        GastoRecorrente gastoRecorrente = buscarPorId(gastoRecorrenteId);

        lancamentoRecorrenteRepository.findByGastoRecorrenteIdAndMesReferencia(gastoRecorrenteId, mesReferencia)
                .ifPresent(l -> {
                    throw new IllegalStateException(
                            "Já existe lançamento para o mês " + mesReferencia + " deste gasto recorrente");
                });

        return lancamentoRecorrenteRepository.save(new LancamentoRecorrente(gastoRecorrente, valor, mesReferencia));
    }

    public LancamentoRecorrente marcarComoPago(Long lancamentoId) {
        LancamentoRecorrente lancamento = lancamentoRecorrenteRepository.findById(lancamentoId)
                .orElseThrow(() -> new EntityNotFoundException("Lançamento não encontrado: " + lancamentoId));
        lancamento.setPago(true);
        return lancamento;
    }

    public LancamentoRecorrente atualizarLancamento(Long lancamentoId, YearMonth mesReferencia, BigDecimal valor) {
        LancamentoRecorrente lancamento = lancamentoRecorrenteRepository.findById(lancamentoId)
                .orElseThrow(() -> new EntityNotFoundException("Lançamento não encontrado: " + lancamentoId));

        lancamentoRecorrenteRepository
                .findByGastoRecorrenteIdAndMesReferencia(lancamento.getGastoRecorrente().getId(), mesReferencia)
                .filter(outro -> !outro.getId().equals(lancamentoId))
                .ifPresent(outro -> {
                    throw new IllegalStateException(
                            "Já existe lançamento para o mês " + mesReferencia + " deste gasto recorrente");
                });

        lancamento.setMesReferencia(mesReferencia);
        lancamento.setValor(valor);
        return lancamento;
    }

    public void excluirLancamento(Long lancamentoId) {
        if (!lancamentoRecorrenteRepository.existsById(lancamentoId)) {
            throw new EntityNotFoundException("Lançamento não encontrado: " + lancamentoId);
        }
        lancamentoRecorrenteRepository.deleteById(lancamentoId);
    }
}
