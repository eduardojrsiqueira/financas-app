package com.eduardo.financas.usuario.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AtualizarPerfilRequest {

    @NotBlank
    private String login;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String senhaAtual;

    private String novaSenha;
}
