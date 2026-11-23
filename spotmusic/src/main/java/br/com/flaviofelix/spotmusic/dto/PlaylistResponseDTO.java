package br.com.flaviofelix.spotmusic.dto;

import br.com.flaviofelix.spotmusic.domain.Playlist;

public record PlaylistResponseDTO(
    long id,
    String nome,
    String descricao
) {
  public static PlaylistResponseDTO from(Playlist playlist) {
    return new PlaylistResponseDTO(
        playlist.getId(),
        playlist.getNome(),
        playlist.getDescricao()
    );
  }
}
