package com.eduardo.financas.security;

import com.eduardo.financas.security.dto.LoginRequest;
import com.eduardo.financas.security.dto.LoginResponse;
import com.eduardo.financas.usuario.Usuario;
import com.eduardo.financas.usuario.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;

    public AuthController(UsuarioService usuarioService, JwtService jwtService) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    @Transactional
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = usuarioService.autenticar(request.getLogin(), request.getSenha())
                .orElseThrow(() -> new BadCredentialsException("Login ou senha inválidos"));

        usuarioService.registrarAcesso(usuario);
        String token = jwtService.gerarToken(usuario);
        return LoginResponse.of(token, usuario);
    }
}
