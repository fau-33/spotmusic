package br.com.flaviofelix.spotmusic.service;

import br.com.flaviofelix.spotmusic.domain.Musica;
import br.com.flaviofelix.spotmusic.domain.Playlist;
import br.com.flaviofelix.spotmusic.repository.MusicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
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

  @Transactional(readOnly = true)
  public List<Musica> recuperarTodas() {
    return musicaRepository.findAll();
  }

  @Transactional(readOnly = true)
  public Musica recuperarPorId(long id) {
    return musicaRepository.findById(id).orElse(null);
  }

  public Musica salvarERetornar(Musica musica, long playlistId) {
    Playlist playlist = playlistService.recuperarPorId(playlistId);
    if (playlist == null) {
      return null;
    }
    musica.setPlaylist(playlist);
    return musicaRepository.save(musica);
  }

  public Musica atualizarERetornar(long id, Musica dadosAtualizados, long playlistId) {
    Musica existente = musicaRepository.findById(id).orElse(null);
    if (existente == null) {
      return null;
    }
    Playlist playlist = playlistService.recuperarPorId(playlistId);
    if (playlist == null) {
      return null;
    }
    existente.setTitulo(dadosAtualizados.getTitulo());
    existente.setBanda(dadosAtualizados.getBanda());
    existente.setNota(dadosAtualizados.getNota());
    existente.setPlaylist(playlist);
    return musicaRepository.save(existente);
  }

  public boolean excluirPorId(long id) {
    if (!musicaRepository.existsById(id)) {
      return false;
    }
    musicaRepository.deleteById(id);
    return true;
  }
}