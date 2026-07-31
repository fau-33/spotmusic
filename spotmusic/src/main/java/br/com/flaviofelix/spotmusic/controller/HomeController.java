package br.com.flaviofelix.spotmusic.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

  // Quando alguém acessar o site principal (a barra "/"), faça isso:
  @GetMapping("/")
  public String exibirHomePage() {

    // Retorna exatamente o nome do arquivo HTML (sem o ".html")
    return "home";
  }
}