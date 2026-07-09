package com.eduardo.financas.gastorecorrente;

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
public class GastoRecorrenteService {

    private final GastoRecorrenteRepository gastoRecorrenteRepository;
    private final LancamentoRecorrenteRepository lancamentoRecorrenteRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioContexto usuarioContexto;

    public GastoRecorrenteService(GastoRecorrenteRepository gastoRecorrenteRepository,
                                   LancamentoRecorrenteRepository lancamentoRecorrenteRepository,
                                   CategoriaRepository categoriaRepository,
                                   UsuarioContexto usuarioContexto) {
        this.gastoRecorrenteRepository = gastoRecorrenteRepository;
        this.lancamentoRecorrenteRepository = lancamentoRecorrenteRepository;
        this.categoriaRepository = categoriaRepository;
        this.usuarioContexto = usuarioContexto;
    }

    @Transactional(readOnly = true)
    public List<GastoRecorrente> listar() {
        return gastoRecorrenteRepository.findByUsuarioId(usuarioContexto.idUsuarioAtual());
    }

    @Transactional(readOnly = true)
    public GastoRecorrente buscarPorId(Long id) {
        return gastoRecorrenteRepository.findByIdAndUsuarioId(id, usuarioContexto.idUsuarioAtual())
                .orElseThrow(() -> new EntityNotFoundException("Gasto recorrente não encontrado: " + id));
    }

    public GastoRecorrente criar(Long categoriaId, String nome) {
        Long usuarioId = usuarioContexto.idUsuarioAtual();
        Categoria categoria = categoriaRepository.findByIdAndUsuarioId(categoriaId, usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada: " + categoriaId));
        return gastoRecorrenteRepository.save(
                new GastoRecorrente(usuarioContexto.referenciaUsuarioAtual(), categoria, nome));
    }

    public void deletar(Long id) {
        gastoRecorrenteRepository.delete(buscarPorId(id));
    }

    @Transactional(readOnly = true)
    public List<LancamentoRecorrente> listarLancamentosPorMes(YearMonth mesReferencia) {
        return lancamentoRecorrenteRepository.findByMesReferenciaEUsuario(mesReferencia,
                usuarioContexto.idUsuarioAtual());
    }

    @Transactional(readOnly = true)
    public List<LancamentoRecorrente> listarLancamentosPorGasto(Long gastoRecorrenteId) {
        buscarPorId(gastoRecorrenteId);
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
        LancamentoRecorrente lancamento = buscarLancamento(lancamentoId);
        lancamento.setPago(true);
        return lancamento;
    }

    public LancamentoRecorrente atualizarLancamento(Long lancamentoId, YearMonth mesReferencia, BigDecimal valor) {
        LancamentoRecorrente lancamento = buscarLancamento(lancamentoId);

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
        lancamentoRecorrenteRepository.delete(buscarLancamento(lancamentoId));
    }

    private LancamentoRecorrente buscarLancamento(Long lancamentoId) {
        return lancamentoRecorrenteRepository.findByIdEUsuario(lancamentoId, usuarioContexto.idUsuarioAtual())
                .orElseThrow(() -> new EntityNotFoundException("Lançamento não encontrado: " + lancamentoId));
    }
}
