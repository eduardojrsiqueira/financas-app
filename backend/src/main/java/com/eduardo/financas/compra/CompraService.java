package com.eduardo.financas.compra;

import com.eduardo.financas.cartao.Cartao;
import com.eduardo.financas.cartao.CartaoRepository;
import com.eduardo.financas.categoria.Categoria;
import com.eduardo.financas.categoria.CategoriaRepository;
import com.eduardo.financas.security.UsuarioContexto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@Transactional
public class CompraService {

    private final CompraRepository compraRepository;
    private final CartaoRepository cartaoRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioContexto usuarioContexto;

    public CompraService(CompraRepository compraRepository, CartaoRepository cartaoRepository,
                          CategoriaRepository categoriaRepository, UsuarioContexto usuarioContexto) {
        this.compraRepository = compraRepository;
        this.cartaoRepository = cartaoRepository;
        this.categoriaRepository = categoriaRepository;
        this.usuarioContexto = usuarioContexto;
    }

    @Transactional(readOnly = true)
    public List<Compra> listar() {
        return compraRepository.listarComParcelas(usuarioContexto.idUsuarioAtual());
    }

    @Transactional(readOnly = true)
    public List<Compra> listarPorCartao(Long cartaoId) {
        return compraRepository.findByCartaoIdComParcelas(cartaoId, usuarioContexto.idUsuarioAtual());
    }

    @Transactional(readOnly = true)
    public Compra buscarPorId(Long id) {
        return compraRepository.findByIdComParcelas(id, usuarioContexto.idUsuarioAtual())
                .orElseThrow(() -> new EntityNotFoundException("Compra não encontrada: " + id));
    }

    public Compra criar(Long cartaoId, Long categoriaId, String descricao, BigDecimal valorTotal,
                         LocalDate dataCompra, int numeroParcelas) {
        Long usuarioId = usuarioContexto.idUsuarioAtual();

        Cartao cartao = cartaoRepository.findByIdAndUsuarioId(cartaoId, usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Cartão não encontrado: " + cartaoId));
        Categoria categoria = categoriaRepository.findByIdAndUsuarioId(categoriaId, usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada: " + categoriaId));

        Compra compra = new Compra(usuarioContexto.referenciaUsuarioAtual(), cartao, categoria, descricao,
                valorTotal, dataCompra, numeroParcelas);
        gerarParcelas(compra);
        return compraRepository.save(compra);
    }

    public void deletar(Long id) {
        compraRepository.delete(buscarPorId(id));
    }

    private void gerarParcelas(Compra compra) {
        int numeroParcelas = compra.getNumeroParcelas();
        BigDecimal valorTotal = compra.getValorTotal();

        BigDecimal valorParcela = valorTotal.divide(BigDecimal.valueOf(numeroParcelas), 2, RoundingMode.HALF_UP);
        BigDecimal somaParcelasAnteriores = valorParcela.multiply(BigDecimal.valueOf(numeroParcelas - 1L));
        BigDecimal valorUltimaParcela = valorTotal.subtract(somaParcelasAnteriores);

        YearMonth primeiraFatura = calcularPrimeiraFatura(compra);

        for (int numero = 1; numero <= numeroParcelas; numero++) {
            BigDecimal valor = (numero == numeroParcelas) ? valorUltimaParcela : valorParcela;
            YearMonth mesReferencia = primeiraFatura.plusMonths(numero - 1L);
            compra.adicionarParcela(new Parcela(numero, valor, mesReferencia));
        }
    }

    private YearMonth calcularPrimeiraFatura(Compra compra) {
        YearMonth mesCompra = YearMonth.from(compra.getDataCompra());
        int diaFechamento = compra.getCartao().getDiaFechamento();
        boolean compraAposFechamento = compra.getDataCompra().getDayOfMonth() > diaFechamento;
        return compraAposFechamento ? mesCompra.plusMonths(1) : mesCompra;
    }
}
