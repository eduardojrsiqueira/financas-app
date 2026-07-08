package com.eduardo.financas.gastocompartilhado;

import com.eduardo.financas.gastocompartilhado.dto.GastoCompartilhadoRequest;
import com.eduardo.financas.gastocompartilhado.dto.GastoCompartilhadoResponse;
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
@RequestMapping("/api/gastos-compartilhados")
public class GastoCompartilhadoController {

    private final GastoCompartilhadoService gastoCompartilhadoService;

    public GastoCompartilhadoController(GastoCompartilhadoService gastoCompartilhadoService) {
        this.gastoCompartilhadoService = gastoCompartilhadoService;
    }

    @GetMapping
    public List<GastoCompartilhadoResponse> listar(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth mes,
            @RequestParam(required = false, defaultValue = "false") boolean apenasPendentes) {
        return gastoCompartilhadoService.listar(mes, apenasPendentes).stream()
                .map(GastoCompartilhadoResponse::from).toList();
    }

    @GetMapping("/{id}")
    public GastoCompartilhadoResponse buscarPorId(@PathVariable Long id) {
        return GastoCompartilhadoResponse.from(gastoCompartilhadoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<GastoCompartilhadoResponse> criar(@Valid @RequestBody GastoCompartilhadoRequest request) {
        GastoCompartilhado gasto = gastoCompartilhadoService.criar(request.getDescricao(), request.getValor(),
                request.getData(), request.getDirecao(), request.getMesReferencia());
        return ResponseEntity.status(HttpStatus.CREATED).body(GastoCompartilhadoResponse.from(gasto));
    }

    @PutMapping("/{id}")
    public GastoCompartilhadoResponse atualizar(@PathVariable Long id,
                                                 @Valid @RequestBody GastoCompartilhadoRequest request) {
        GastoCompartilhado gasto = gastoCompartilhadoService.atualizar(id, request.getDescricao(), request.getValor(),
                request.getData(), request.getDirecao(), request.getMesReferencia());
        return GastoCompartilhadoResponse.from(gasto);
    }

    @PatchMapping("/{id}/quitado")
    public GastoCompartilhadoResponse marcarComoQuitado(@PathVariable Long id) {
        return GastoCompartilhadoResponse.from(gastoCompartilhadoService.marcarComoQuitado(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        gastoCompartilhadoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
