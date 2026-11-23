package br.com.flaviofelix.spotmusic.dto;

import br.com.flaviofelix.spotmusic.domain.Musica;

public record MusicaResponseDTO(
    long id,
    String titulo,
    String banda,
    int nota,
    Long playlistId,
    String playlistNome
) {
  public static MusicaResponseDTO from(Musica musica) {
    Long playlistId = musica.getPlaylist() != null ? musica.getPlaylist().getId() : null;
    String playlistNome = musica.getPlaylist() != null ? musica.getPlaylist().getNome() : null;
    return new MusicaResponseDTO(
        musica.getId(),
        musica.getTitulo(),
        musica.getBanda(),
        musica.getNota(),
        playlistId,
        playlistNome
    );
  }
}
