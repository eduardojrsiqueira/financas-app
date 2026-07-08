package com.eduardo.financas.cartao;

import com.eduardo.financas.cartao.dto.CartaoRequest;
import com.eduardo.financas.cartao.dto.CartaoResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cartoes")
public class CartaoController {

    private final CartaoService cartaoService;

    public CartaoController(CartaoService cartaoService) {
        this.cartaoService = cartaoService;
    }

    @GetMapping
    public List<CartaoResponse> listar() {
        return cartaoService.listar().stream().map(CartaoResponse::from).toList();
    }

    @GetMapping("/{id}")
    public CartaoResponse buscarPorId(@PathVariable Long id) {
        return CartaoResponse.from(cartaoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<CartaoResponse> criar(@Valid @RequestBody CartaoRequest request) {
        Cartao cartao = cartaoService.criar(request.getNome(), request.getBandeira(),
                request.getDiaFechamento(), request.getDiaVencimento());
        return ResponseEntity.status(HttpStatus.CREATED).body(CartaoResponse.from(cartao));
    }

    @PutMapping("/{id}")
    public CartaoResponse atualizar(@PathVariable Long id, @Valid @RequestBody CartaoRequest request) {
        Cartao cartao = cartaoService.atualizar(id, request.getNome(), request.getBandeira(),
                request.getDiaFechamento(), request.getDiaVencimento());
        return CartaoResponse.from(cartao);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        cartaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
