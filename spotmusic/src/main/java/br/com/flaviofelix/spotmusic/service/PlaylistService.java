package br.com.flaviofelix.spotmusic.service;

import br.com.flaviofelix.spotmusic.domain.Playlist;
import br.com.flaviofelix.spotmusic.repository.PlaylistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PlaylistService {

  @Autowired
  private PlaylistRepository playlistRepository;

  public void salvar(Playlist playlist) {
    // O Spring Data JPA já sabe salvar automático!
    playlistRepository.save(playlist);
  }

  @Transactional(readOnly = true)
  public List<Playlist> recuperar() {
    // findAll() busca todas as playlists no banco
    return playlistRepository.findAll();
  }

  @Transactional(readOnly = true)
  public Playlist recuperarPorId(Long id) {
    // findById busca por ID. O orElse(null) diz: se não achar, retorne vazio
    return playlistRepository.findById(id).orElse(null);
  }

  public void atualizar(Playlist playlist) {
    // No Spring moderno, o comando save() serve tanto para criar quanto para atualizar!
    playlistRepository.save(playlist);
  }

  public void excluir(Long id) {
    playlistRepository.deleteById(id);
  }

}
