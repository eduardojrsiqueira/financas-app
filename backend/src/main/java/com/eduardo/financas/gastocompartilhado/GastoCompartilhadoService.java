package com.eduardo.financas.gastocompartilhado;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@Transactional
public class GastoCompartilhadoService {

    private final GastoCompartilhadoRepository gastoCompartilhadoRepository;

    public GastoCompartilhadoService(GastoCompartilhadoRepository gastoCompartilhadoRepository) {
        this.gastoCompartilhadoRepository = gastoCompartilhadoRepository;
    }

    @Transactional(readOnly = true)
    public List<GastoCompartilhado> listar(YearMonth mesReferencia, boolean apenasPendentes) {
        if (mesReferencia != null && apenasPendentes) {
            return gastoCompartilhadoRepository.findByMesReferenciaAndQuitadoFalse(mesReferencia);
        }
        if (mesReferencia != null) {
            return gastoCompartilhadoRepository.findByMesReferencia(mesReferencia);
        }
        if (apenasPendentes) {
            return gastoCompartilhadoRepository.findByQuitadoFalse();
        }
        return gastoCompartilhadoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public GastoCompartilhado buscarPorId(Long id) {
        return gastoCompartilhadoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Gasto compartilhado não encontrado: " + id));
    }

    public GastoCompartilhado criar(String descricao, BigDecimal valor, LocalDate data, DirecaoGasto direcao,
                                     YearMonth mesReferencia) {
        return gastoCompartilhadoRepository.save(
                new GastoCompartilhado(descricao, valor, data, direcao, mesReferencia));
    }

    public GastoCompartilhado atualizar(Long id, String descricao, BigDecimal valor, LocalDate data,
                                         DirecaoGasto direcao, YearMonth mesReferencia) {
        GastoCompartilhado gasto = buscarPorId(id);
        gasto.setDescricao(descricao);
        gasto.setValor(valor);
        gasto.setData(data);
        gasto.setDirecao(direcao);
        gasto.setMesReferencia(mesReferencia);
        return gasto;
    }

    public GastoCompartilhado marcarComoQuitado(Long id) {
        GastoCompartilhado gasto = buscarPorId(id);
        gasto.setQuitado(true);
        return gasto;
    }

    public void deletar(Long id) {
        if (!gastoCompartilhadoRepository.existsById(id)) {
            throw new EntityNotFoundException("Gasto compartilhado não encontrado: " + id);
        }
        gastoCompartilhadoRepository.deleteById(id);
    }
}
