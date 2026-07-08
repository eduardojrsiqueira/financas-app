package com.eduardo.financas.compra;

import com.eduardo.financas.compra.dto.CompraRequest;
import com.eduardo.financas.compra.dto.CompraResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/compras")
public class CompraController {

    private final CompraService compraService;

    public CompraController(CompraService compraService) {
        this.compraService = compraService;
    }

    @GetMapping
    public List<CompraResponse> listar(@RequestParam(required = false) Long cartaoId) {
        List<Compra> compras = cartaoId == null ? compraService.listar() : compraService.listarPorCartao(cartaoId);
        return compras.stream().map(CompraResponse::from).toList();
    }

    @GetMapping("/{id}")
    public CompraResponse buscarPorId(@PathVariable Long id) {
        return CompraResponse.from(compraService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<CompraResponse> criar(@Valid @RequestBody CompraRequest request) {
        Compra compra = compraService.criar(request.getCartaoId(), request.getCategoriaId(), request.getDescricao(),
                request.getValorTotal(), request.getDataCompra(), request.getNumeroParcelas());
        return ResponseEntity.status(HttpStatus.CREATED).body(CompraResponse.from(compra));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        compraService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
