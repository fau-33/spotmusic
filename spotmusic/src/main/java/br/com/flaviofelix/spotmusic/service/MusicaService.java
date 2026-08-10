package br.com.flaviofelix.spotmusic.service;

import br.com.flaviofelix.spotmusic.domain.Musica;
import br.com.flaviofelix.spotmusic.domain.Playlist;
import br.com.flaviofelix.spotmusic.repository.MusicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MusicaService {

  @Autowired
  private MusicaRepository musicaRepository;

  @Autowired
  private PlaylistService playlistService;

  public List<Musica> recuperarPorPlaylist(long playlistId) {
    return musicaRepository.findByPlaylistId(playlistId);
  }

  public Musica recuperarPorPlaylistIdEMusicaId(long playlistId, long musicaId) {
    return musicaRepository.findByIdAndPlaylistId(musicaId, playlistId);
  }

  public void salvar(Musica musica, long playlistId) {
    // 1. Busca a playlist no banco de dados
    Playlist playlist = playlistService.recuperarPorId(playlistId);
    // 2. Avisa que essa música pertence a essa playlist
    musica.setPlaylist(playlist);
    // 3. Salva a música
    musicaRepository.save(musica);
  }

  public void atualizar(Musica musica, long playlistId) {
    Playlist playlist = playlistService.recuperarPorId(playlistId);
    musica.setPlaylist(playlist);
    musicaRepository.save(musica);
  }

  public void excluir(long playlistId, long musicaId) {
    Musica musica = recuperarPorPlaylistIdEMusicaId(playlistId, musicaId);
    if (musica != null) {
      musicaRepository.delete(musica);
    }
  }
}