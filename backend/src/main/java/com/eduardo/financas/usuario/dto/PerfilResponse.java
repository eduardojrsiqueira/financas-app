package com.eduardo.financas.usuario.dto;

import com.eduardo.financas.usuario.Usuario;

public record PerfilResponse(String nome, String login, String email) {

    public static PerfilResponse from(Usuario usuario) {
        return new PerfilResponse(usuario.getNome(), usuario.getLogin(), usuario.getEmail());
    }
}
