package com.eduardo.financas.usuario;

import com.eduardo.financas.security.UsuarioContexto;
import com.eduardo.financas.usuario.dto.AtualizarPerfilRequest;
import com.eduardo.financas.usuario.dto.PerfilResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioContexto usuarioContexto;

    public UsuarioController(UsuarioService usuarioService, UsuarioContexto usuarioContexto) {
        this.usuarioService = usuarioService;
        this.usuarioContexto = usuarioContexto;
    }

    @GetMapping("/me")
    public PerfilResponse me() {
        return PerfilResponse.from(usuarioService.buscarPorId(usuarioContexto.idUsuarioAtual()));
    }

    @PutMapping("/me")
    public PerfilResponse atualizarMe(@Valid @RequestBody AtualizarPerfilRequest request) {
        Usuario usuario = usuarioService.atualizarPerfil(usuarioContexto.idUsuarioAtual(), request.getLogin(),
                request.getEmail(), request.getSenhaAtual(), request.getNovaSenha());
        return PerfilResponse.from(usuario);
    }
}
