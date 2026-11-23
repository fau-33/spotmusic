package br.com.flaviofelix.spotmusic.controller;

import br.com.flaviofelix.spotmusic.domain.Musica;
import br.com.flaviofelix.spotmusic.dto.MusicaRequestDTO;
import br.com.flaviofelix.spotmusic.dto.MusicaResponseDTO;
import br.com.flaviofelix.spotmusic.service.MusicaService;
import br.com.flaviofelix.spotmusic.service.PlaylistService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/musicas")
public class MusicaRestController {

  private final MusicaService musicaService;
  private final PlaylistService playlistService;

  public MusicaRestController(MusicaService musicaService, PlaylistService playlistService) {
    this.musicaService = musicaService;
    this.playlistService = playlistService;
  }

  @GetMapping
  public ResponseEntity<List<MusicaResponseDTO>> listar(
      @RequestParam(name = "playlistId", required = false) Long playlistId) {
    List<Musica> musicas = (playlistId != null)
        ? musicaService.recuperarPorPlaylist(playlistId)
        : musicaService.recuperarTodas();

    List<MusicaResponseDTO> response = musicas.stream()
        .map(MusicaResponseDTO::from)
        .toList();
    return ResponseEntity.ok(response);
  }

  @GetMapping("/playlist/{playlistId}")
  public ResponseEntity<List<MusicaResponseDTO>> listarPorPlaylist(@PathVariable("playlistId") long playlistId) {
    if (playlistService.recuperarPorId(playlistId) == null) {
      return ResponseEntity.notFound().build();
    }

    List<MusicaResponseDTO> response = musicaService.recuperarPorPlaylist(playlistId)
        .stream()
        .map(MusicaResponseDTO::from)
        .toList();
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<MusicaResponseDTO> buscarPorId(@PathVariable("id") long id) {
    Musica musica = musicaService.recuperarPorId(id);
    if (musica == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(MusicaResponseDTO.from(musica));
  }

  @PostMapping
  public ResponseEntity<MusicaResponseDTO> criar(@Valid @RequestBody MusicaRequestDTO request) {
    Musica novaMusica = new Musica();
    novaMusica.setTitulo(request.titulo());
    novaMusica.setBanda(request.banda());
    novaMusica.setNota(request.nota());

    Musica salva = musicaService.salvarERetornar(novaMusica, request.playlistId());
    if (salva == null) {
      return ResponseEntity.notFound().build();
    }

    URI location = ServletUriComponentsBuilder.fromCurrentRequest()
        .path("/{id}")
        .buildAndExpand(salva.getId())
        .toUri();

    return ResponseEntity.created(location).body(MusicaResponseDTO.from(salva));
  }

  @PutMapping("/{id}")
  public ResponseEntity<MusicaResponseDTO> atualizar(
      @PathVariable("id") long id,
      @Valid @RequestBody MusicaRequestDTO request) {
    Musica dados = new Musica();
    dados.setTitulo(request.titulo());
    dados.setBanda(request.banda());
    dados.setNota(request.nota());

    Musica atualizada = musicaService.atualizarERetornar(id, dados, request.playlistId());
    if (atualizada == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(MusicaResponseDTO.from(atualizada));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> excluir(@PathVariable("id") long id) {
    boolean removida = musicaService.excluirPorId(id);
    if (!removida) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.noContent().build();
  }
}
