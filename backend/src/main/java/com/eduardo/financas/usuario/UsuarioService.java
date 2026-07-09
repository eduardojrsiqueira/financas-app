package com.eduardo.financas.usuario;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado: " + id));
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> autenticar(String login, String senha) {
        return usuarioRepository.findByLogin(login)
                .filter(usuario -> passwordEncoder.matches(senha, usuario.getSenha()));
    }

    public void registrarAcesso(Usuario usuario) {
        usuario.setUltimoAcesso(LocalDateTime.now());
    }

    public Usuario atualizarPerfil(Long usuarioId, String novoLogin, String novoEmail,
                                    String senhaAtual, String novaSenha) {
        Usuario usuario = buscarPorId(usuarioId);

        if (!passwordEncoder.matches(senhaAtual, usuario.getSenha())) {
            throw new IllegalArgumentException("Senha atual incorreta");
        }

        if (usuarioRepository.existsByLoginAndIdNot(novoLogin, usuarioId)) {
            throw new IllegalStateException("Login já está em uso: " + novoLogin);
        }
        if (usuarioRepository.existsByEmailAndIdNot(novoEmail, usuarioId)) {
            throw new IllegalStateException("E-mail já está em uso: " + novoEmail);
        }

        usuario.setLogin(novoLogin);
        usuario.setEmail(novoEmail);
        if (novaSenha != null && !novaSenha.isBlank()) {
            usuario.setSenha(passwordEncoder.encode(novaSenha));
        }
        return usuario;
    }
}
