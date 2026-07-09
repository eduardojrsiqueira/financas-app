package com.eduardo.financas.gastocompartilhado;

import com.eduardo.financas.security.UsuarioContexto;
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
    private final UsuarioContexto usuarioContexto;

    public GastoCompartilhadoService(GastoCompartilhadoRepository gastoCompartilhadoRepository,
                                      UsuarioContexto usuarioContexto) {
        this.gastoCompartilhadoRepository = gastoCompartilhadoRepository;
        this.usuarioContexto = usuarioContexto;
    }

    @Transactional(readOnly = true)
    public List<GastoCompartilhado> listar(YearMonth mesReferencia, boolean apenasPendentes) {
        Long usuarioId = usuarioContexto.idUsuarioAtual();
        if (mesReferencia != null && apenasPendentes) {
            return gastoCompartilhadoRepository.findByUsuarioIdAndMesReferenciaAndQuitadoFalse(usuarioId,
                    mesReferencia);
        }
        if (mesReferencia != null) {
            return gastoCompartilhadoRepository.findByUsuarioIdAndMesReferencia(usuarioId, mesReferencia);
        }
        if (apenasPendentes) {
            return gastoCompartilhadoRepository.findByUsuarioIdAndQuitadoFalse(usuarioId);
        }
        return gastoCompartilhadoRepository.findByUsuarioId(usuarioId);
    }

    @Transactional(readOnly = true)
    public GastoCompartilhado buscarPorId(Long id) {
        return gastoCompartilhadoRepository.findByIdAndUsuarioId(id, usuarioContexto.idUsuarioAtual())
                .orElseThrow(() -> new EntityNotFoundException("Gasto compartilhado não encontrado: " + id));
    }

    public GastoCompartilhado criar(String descricao, BigDecimal valor, LocalDate data, DirecaoGasto direcao,
                                     YearMonth mesReferencia) {
        GastoCompartilhado gasto = new GastoCompartilhado(usuarioContexto.referenciaUsuarioAtual(), descricao, valor,
                data, direcao, mesReferencia);
        return gastoCompartilhadoRepository.save(gasto);
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
        gastoCompartilhadoRepository.delete(buscarPorId(id));
    }
}
