package com.eduardo.financas.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Encaminha rotas do Angular (que não são da API nem arquivos estáticos)
 * para o index.html, permitindo que o Angular Router assuma o roteamento
 * client-side. Sem isso, um F5 em /app/relatorio, por exemplo, retornaria 404.
 *
 * Precisa ser @Controller (não @RestController): o retorno "forward:/index.html"
 * só é interpretado como um forward de view pelo Spring MVC quando o método não
 * tem @ResponseBody implícito — com @RestController a string vira o corpo da resposta.
 */
@Controller
public class SpaController {

    @GetMapping(value = {"/{path:[^\\.]*}", "/**/{path:[^\\.]*}"})
    public String redirect() {
        return "forward:/index.html";
    }
}
