package com.eduardo.financas.gastorecorrente;

import com.eduardo.financas.gastorecorrente.dto.GastoRecorrenteRequest;
import com.eduardo.financas.gastorecorrente.dto.GastoRecorrenteResponse;
import com.eduardo.financas.gastorecorrente.dto.LancamentoRecorrenteRequest;
import com.eduardo.financas.gastorecorrente.dto.LancamentoRecorrenteResponse;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/gastos-recorrentes")
public class GastoRecorrenteController {

    private final GastoRecorrenteService gastoRecorrenteService;

    public GastoRecorrenteController(GastoRecorrenteService gastoRecorrenteService) {
        this.gastoRecorrenteService = gastoRecorrenteService;
    }

    @GetMapping
    public List<GastoRecorrenteResponse> listar() {
        return gastoRecorrenteService.listar().stream().map(GastoRecorrenteResponse::from).toList();
    }

    @GetMapping("/{id}")
    public GastoRecorrenteResponse buscarPorId(@PathVariable Long id) {
        return GastoRecorrenteResponse.from(gastoRecorrenteService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<GastoRecorrenteResponse> criar(@Valid @RequestBody GastoRecorrenteRequest request) {
        GastoRecorrente gastoRecorrente = gastoRecorrenteService.criar(request.getCategoriaId(), request.getNome());
        return ResponseEntity.status(HttpStatus.CREATED).body(GastoRecorrenteResponse.from(gastoRecorrente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        gastoRecorrenteService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/lancamentos")
    public List<LancamentoRecorrenteResponse> listarLancamentos(@PathVariable Long id) {
        return gastoRecorrenteService.listarLancamentosPorGasto(id).stream()
                .map(LancamentoRecorrenteResponse::from).toList();
    }

    @PostMapping("/{id}/lancamentos")
    public ResponseEntity<LancamentoRecorrenteResponse> gerarLancamento(
            @PathVariable Long id, @Valid @RequestBody LancamentoRecorrenteRequest request) {
        LancamentoRecorrente lancamento = gastoRecorrenteService.gerarLancamento(
                id, request.getMesReferencia(), request.getValor());
        return ResponseEntity.status(HttpStatus.CREATED).body(LancamentoRecorrenteResponse.from(lancamento));
    }

    @GetMapping("/lancamentos")
    public List<LancamentoRecorrenteResponse> listarLancamentosPorMes(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth mes) {
        return gastoRecorrenteService.listarLancamentosPorMes(mes).stream()
                .map(LancamentoRecorrenteResponse::from).toList();
    }

    @PatchMapping("/lancamentos/{lancamentoId}/pago")
    public LancamentoRecorrenteResponse marcarComoPago(@PathVariable Long lancamentoId) {
        return LancamentoRecorrenteResponse.from(gastoRecorrenteService.marcarComoPago(lancamentoId));
    }

    @PutMapping("/lancamentos/{lancamentoId}")
    public LancamentoRecorrenteResponse atualizarLancamento(
            @PathVariable Long lancamentoId, @Valid @RequestBody LancamentoRecorrenteRequest request) {
        LancamentoRecorrente lancamento = gastoRecorrenteService.atualizarLancamento(
                lancamentoId, request.getMesReferencia(), request.getValor());
        return LancamentoRecorrenteResponse.from(lancamento);
    }

    @DeleteMapping("/lancamentos/{lancamentoId}")
    public ResponseEntity<Void> excluirLancamento(@PathVariable Long lancamentoId) {
        gastoRecorrenteService.excluirLancamento(lancamentoId);
        return ResponseEntity.noContent().build();
    }
}
