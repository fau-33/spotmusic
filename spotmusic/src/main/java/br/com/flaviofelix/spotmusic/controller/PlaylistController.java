package br.com.flaviofelix.spotmusic.controller;

import br.com.flaviofelix.spotmusic.service.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/playlists")
public class PlaylistController {

  @Autowired
  private PlaylistService playlistService;

  // Quando o usuário acessar /playlists/listar, cai aqui:
  @GetMapping("/listar")
  public String listar(Model model) {

    // 1. O Garçom pede ao Cozinheiro (Service) todas as playlists do banco
    // 2. Ele guarda isso numa bandeja (Model) com a etiqueta "playlists"
    model.addAttribute("playlists", playlistService.recuperar());

    // 3. Ele entrega a bandeja na tela HTML chamada "list" (que fica na pasta playlist)
    return "playlist/list";
  }
}