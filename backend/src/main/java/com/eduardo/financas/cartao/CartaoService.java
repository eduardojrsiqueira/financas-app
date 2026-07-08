package com.eduardo.financas.cartao;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CartaoService {

    private final CartaoRepository cartaoRepository;

    public CartaoService(CartaoRepository cartaoRepository) {
        this.cartaoRepository = cartaoRepository;
    }

    @Transactional(readOnly = true)
    public List<Cartao> listar() {
        return cartaoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Cartao buscarPorId(Long id) {
        return cartaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cartão não encontrado: " + id));
    }

    public Cartao criar(String nome, String bandeira, Integer diaFechamento, Integer diaVencimento) {
        return cartaoRepository.save(new Cartao(nome, bandeira, diaFechamento, diaVencimento));
    }

    public Cartao atualizar(Long id, String nome, String bandeira, Integer diaFechamento, Integer diaVencimento) {
        Cartao cartao = buscarPorId(id);
        cartao.setNome(nome);
        cartao.setBandeira(bandeira);
        cartao.setDiaFechamento(diaFechamento);
        cartao.setDiaVencimento(diaVencimento);
        return cartao;
    }

    public void deletar(Long id) {
        if (!cartaoRepository.existsById(id)) {
            throw new EntityNotFoundException("Cartão não encontrado: " + id);
        }
        cartaoRepository.deleteById(id);
    }
}
