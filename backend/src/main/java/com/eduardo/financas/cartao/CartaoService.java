package com.eduardo.financas.cartao;

import com.eduardo.financas.security.UsuarioContexto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CartaoService {

    private final CartaoRepository cartaoRepository;
    private final UsuarioContexto usuarioContexto;

    public CartaoService(CartaoRepository cartaoRepository, UsuarioContexto usuarioContexto) {
        this.cartaoRepository = cartaoRepository;
        this.usuarioContexto = usuarioContexto;
    }

    @Transactional(readOnly = true)
    public List<Cartao> listar() {
        return cartaoRepository.findByUsuarioId(usuarioContexto.idUsuarioAtual());
    }

    @Transactional(readOnly = true)
    public Cartao buscarPorId(Long id) {
        return cartaoRepository.findByIdAndUsuarioId(id, usuarioContexto.idUsuarioAtual())
                .orElseThrow(() -> new EntityNotFoundException("Cartão não encontrado: " + id));
    }

    public Cartao criar(String nome, String bandeira, Integer diaFechamento, Integer diaVencimento) {
        Cartao cartao = new Cartao(usuarioContexto.referenciaUsuarioAtual(), nome, bandeira, diaFechamento,
                diaVencimento);
        return cartaoRepository.save(cartao);
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
        cartaoRepository.delete(buscarPorId(id));
    }
}
