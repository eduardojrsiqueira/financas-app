package com.eduardo.financas.receita;

import com.eduardo.financas.receita.dto.ReceitaRequest;
import com.eduardo.financas.receita.dto.ReceitaResponse;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
@RequestMapping("/api/receitas")
public class ReceitaController {

    private final ReceitaService receitaService;

    public ReceitaController(ReceitaService receitaService) {
        this.receitaService = receitaService;
    }

    @GetMapping
    public List<ReceitaResponse> listar(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth mes) {
        List<Receita> receitas = mes == null ? receitaService.listar() : receitaService.listarPorMes(mes);
        return receitas.stream().map(ReceitaResponse::from).toList();
    }

    @GetMapping("/{id}")
    public ReceitaResponse buscarPorId(@PathVariable Long id) {
        return ReceitaResponse.from(receitaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ReceitaResponse> criar(@Valid @RequestBody ReceitaRequest request) {
        Receita receita = receitaService.criar(request.getCategoriaId(), request.getDescricao(),
                request.getValor(), request.getMesReferencia());
        return ResponseEntity.status(HttpStatus.CREATED).body(ReceitaResponse.from(receita));
    }

    @PutMapping("/{id}")
    public ReceitaResponse atualizar(@PathVariable Long id, @Valid @RequestBody ReceitaRequest request) {
        Receita receita = receitaService.atualizar(id, request.getDescricao(), request.getValor(),
                request.getMesReferencia());
        return ReceitaResponse.from(receita);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        receitaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
