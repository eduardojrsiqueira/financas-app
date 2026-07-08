package com.eduardo.financas.config;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Encaminha rotas do Angular (que não são da API nem arquivos estáticos)
 * para o index.html, permitindo que o Angular Router assuma o roteamento
 * client-side. Sem isso, um F5 em /app/relatorio, por exemplo, retornaria 404.
 */
@RestController
public class SpaController {

    @GetMapping(value = {"/{path:[^\\.]*}", "/**/{path:[^\\.]*}"})
    public String redirect() {
        return "forward:/index.html";
    }
}
