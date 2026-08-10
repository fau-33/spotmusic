package br.com.flaviofelix.spotmusic.controller;

import br.com.flaviofelix.spotmusic.domain.Playlist;
import br.com.flaviofelix.spotmusic.service.PlaylistService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/playlists")
public class PlaylistController {

  @Autowired
  private PlaylistService playlistService;

  // 1. Lista as playlists
  @GetMapping("/listar")
  public String listar(Model model) {
    model.addAttribute("playlists", playlistService.recuperar());
    return "playlist/list";
  }

  // 2. Mostra a tela de cadastro vazia (para CRIAR)
  @GetMapping("/cadastro")
  public String preSalvar(@ModelAttribute("playlist") Playlist playlist) {
    return "playlist/add";
  }

  // 3. NOVO: Mostra a tela de cadastro preenchida (para EDITAR)
  @GetMapping("/{id}/atualizar")
  public String preAtualizar(@PathVariable("id") long id, Model model) {
    // Busca a playlist no banco de dados usando o ID
    Playlist playlist = playlistService.recuperarPorId(id);
    // Coloca a playlist na bandeja (model) para a tela preencher os campos sozinhos
    model.addAttribute("playlist", playlist);
    // Reutiliza a mesma tela de cadastro!
    return "playlist/add";
  }

  // 4. ATUALIZADO: Recebe o formulário, valida, cria OU atualiza
  @PostMapping("/salvar")
  public String salvar(@Valid @ModelAttribute("playlist") Playlist playlist, BindingResult result, RedirectAttributes attr) {
    if (result.hasErrors()) {
      return "playlist/add";
    }

    // Descobre se é uma criação ou uma edição
    boolean isNova = (playlist.getId() == 0);

    // O Spring Data JPA salva (se for nova) ou atualiza (se já existir) automaticamente!
    playlistService.salvar(playlist);

    // Exibe a mensagem correta
    if (isNova) {
      attr.addFlashAttribute("mensagem", "Playlist criada com sucesso!");
    } else {
      attr.addFlashAttribute("mensagem", "Playlist atualizada com sucesso!");
    }

    return "redirect:/playlists/listar";
  }
}