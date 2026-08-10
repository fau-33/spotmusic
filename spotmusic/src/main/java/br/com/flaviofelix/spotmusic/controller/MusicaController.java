package br.com.flaviofelix.spotmusic.controller;

import br.com.flaviofelix.spotmusic.domain.Musica;
import br.com.flaviofelix.spotmusic.service.MusicaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
// Rota principal: Toda música pertence a uma playlist específica!
@RequestMapping("/playlists/{playlistId}/musicas")
public class MusicaController {

  @Autowired
  private MusicaService musicaService;

  // 1. Lista as músicas de uma playlist específica
  @GetMapping("/listar")
  public String listar(@PathVariable("playlistId") long playlistId, Model model) {
    model.addAttribute("musicas", musicaService.recuperarPorPlaylist(playlistId));
    model.addAttribute("playlistId", playlistId);
    return "musica/list";
  }

  // 2. Mostra a tela de cadastro vazia (CRIAR)
  @GetMapping("/cadastro")
  public String preSalvar(@ModelAttribute("musica") Musica musica, @PathVariable("playlistId") long playlistId, Model model) {
    model.addAttribute("playlistId", playlistId);
    return "musica/add";
  }

  // 3. Mostra a tela de cadastro preenchida (EDITAR)
  // Aqui eu corrigi o bug das duas barras "//" do curso
  @GetMapping("/{musicaId}/atualizar")
  public String preAtualizar(@PathVariable("playlistId") long playlistId, @PathVariable("musicaId") long musicaId, Model model) {
    Musica musica = musicaService.recuperarPorPlaylistIdEMusicaId(playlistId, musicaId);
    model.addAttribute("musica", musica);
    model.addAttribute("playlistId", playlistId);
    return "musica/add";
  }

  // 4. Recebe o formulário, valida e SALVA ou ATUALIZA
  @PostMapping("/salvar")
  public String salvar(@PathVariable("playlistId") long playlistId,
                       @Valid @ModelAttribute("musica") Musica musica,
                       BindingResult result,
                       RedirectAttributes attr,
                       Model model) {

    // Se a validação falhar (ex: nome em branco), volta pra tela de cadastro
    if (result.hasErrors()) {
      model.addAttribute("playlistId", playlistId);
      return "musica/add";
    }

    // Descobre se é uma música nova ou edição
    boolean isNova = (musica.getId() == 0);

    if (isNova) {
      musicaService.salvar(musica, playlistId);
      attr.addFlashAttribute("mensagem", "Música salva com sucesso!");
    } else {
      musicaService.atualizar(musica, playlistId);
      attr.addFlashAttribute("mensagem", "Música atualizada com sucesso!");
    }

    return "redirect:/playlists/" + playlistId + "/musicas/listar";
  }

  // 5. Exclui a música
  // Também corrigi o bug das duas barras "//" aqui
  @GetMapping("/{musicaId}/remover")
  public String remover(@PathVariable("playlistId") long playlistId, @PathVariable("musicaId") long musicaId, RedirectAttributes attr) {
    musicaService.excluir(playlistId, musicaId);
    attr.addFlashAttribute("mensagem", "Música excluída com sucesso!");
    return "redirect:/playlists/" + playlistId + "/musicas/listar";
  }
}