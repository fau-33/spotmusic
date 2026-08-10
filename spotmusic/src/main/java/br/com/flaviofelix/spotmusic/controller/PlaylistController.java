package br.com.flaviofelix.spotmusic.controller;

import br.com.flaviofelix.spotmusic.domain.Playlist;
import br.com.flaviofelix.spotmusic.service.PlaylistService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/playlists")
public class PlaylistController {

  @Autowired
  private PlaylistService playlistService;

  // 1. Lista as playlists (Fizemos ontem)
  @GetMapping("/listar")
  public String listar(Model model) {
    model.addAttribute("playlists", playlistService.recuperar());
    return "playlist/list";
  }

  // 2. NOVO: Mostra a tela de cadastro vazia
  @GetMapping("/cadastro")
  public String preSalvar(@ModelAttribute("playlist") Playlist playlist) {
    // Removi a barra inicial ("/playlist/add") que o curso usava,
    // no Spring moderno é melhor sem a barra para não dar erro de rota.
    return "playlist/add";
  }

  // 3. NOVO: Recebe o formulário preenchido, valida e salva
  @PostMapping("/salvar")
  public String salvar(@Valid @ModelAttribute("playlist") Playlist playlist, BindingResult result, RedirectAttributes attr) {

    // Se tiver erro (ex: nome em branco), devolve pra tela de cadastro
    if (result.hasErrors()) {
      return "playlist/add";
    }

    // Se estiver tudo certo, salva no banco!
    playlistService.salvar(playlist);

    // Cria uma mensagem de sucesso flutuante para mostrar na tela
    attr.addFlashAttribute("mensagem", "Playlist criada com sucesso!");

    // Redireciona o usuário de volta para a tela de listagem
    return "redirect:/playlists/listar";
  }
}