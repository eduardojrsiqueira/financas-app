package com.eduardo.financas.security.dto;

import com.eduardo.financas.usuario.Usuario;

public record LoginResponse(String token, String nome, String login, String email) {

    public static LoginResponse of(String token, Usuario usuario) {
        return new LoginResponse(token, usuario.getNome(), usuario.getLogin(), usuario.getEmail());
    }
}
