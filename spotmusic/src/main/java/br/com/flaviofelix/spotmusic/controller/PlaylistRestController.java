package br.com.flaviofelix.spotmusic.controller;

import br.com.flaviofelix.spotmusic.domain.Playlist;
import br.com.flaviofelix.spotmusic.dto.PlaylistRequestDTO;
import br.com.flaviofelix.spotmusic.dto.PlaylistResponseDTO;
import br.com.flaviofelix.spotmusic.service.PlaylistService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistRestController {

  private final PlaylistService playlistService;

  public PlaylistRestController(PlaylistService playlistService) {
    this.playlistService = playlistService;
  }

  @GetMapping
  public ResponseEntity<List<PlaylistResponseDTO>> listar() {
    List<PlaylistResponseDTO> playlists = playlistService.recuperar()
        .stream()
        .map(PlaylistResponseDTO::from)
        .toList();
    return ResponseEntity.ok(playlists);
  }

  @GetMapping("/{id}")
  public ResponseEntity<PlaylistResponseDTO> buscarPorId(@PathVariable("id") long id) {
    Playlist playlist = playlistService.recuperarPorId(id);
    if (playlist == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(PlaylistResponseDTO.from(playlist));
  }

  @PostMapping
  public ResponseEntity<PlaylistResponseDTO> criar(@Valid @RequestBody PlaylistRequestDTO request) {
    Playlist novaPlaylist = new Playlist();
    novaPlaylist.setNome(request.nome());
    novaPlaylist.setDescricao(request.descricao());

    Playlist salva = playlistService.salvarERetornar(novaPlaylist);
    URI location = ServletUriComponentsBuilder.fromCurrentRequest()
        .path("/{id}")
        .buildAndExpand(salva.getId())
        .toUri();

    return ResponseEntity.created(location).body(PlaylistResponseDTO.from(salva));
  }

  @PutMapping("/{id}")
  public ResponseEntity<PlaylistResponseDTO> atualizar(
      @PathVariable("id") long id,
      @Valid @RequestBody PlaylistRequestDTO request) {
    Playlist existente = playlistService.recuperarPorId(id);
    if (existente == null) {
      return ResponseEntity.notFound().build();
    }

    existente.setNome(request.nome());
    existente.setDescricao(request.descricao());

    Playlist atualizada = playlistService.salvarERetornar(existente);
    return ResponseEntity.ok(PlaylistResponseDTO.from(atualizada));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> excluir(@PathVariable("id") long id) {
    Playlist existente = playlistService.recuperarPorId(id);
    if (existente == null) {
      return ResponseEntity.notFound().build();
    }

    playlistService.excluir(id);
    return ResponseEntity.noContent().build();
  }
}
