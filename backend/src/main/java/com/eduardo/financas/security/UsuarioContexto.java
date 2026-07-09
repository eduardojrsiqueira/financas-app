package com.eduardo.financas.security;

import com.eduardo.financas.usuario.Usuario;
import com.eduardo.financas.usuario.UsuarioRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UsuarioContexto {

    private final UsuarioRepository usuarioRepository;

    public UsuarioContexto(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Long idUsuarioAtual() {
        UsuarioAutenticado principal = (UsuarioAutenticado) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        return principal.id();
    }

    public Usuario referenciaUsuarioAtual() {
        return usuarioRepository.getReferenceById(idUsuarioAtual());
    }
}
