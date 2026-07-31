package br.com.flaviofelix.spotmusic.service;

import br.com.flaviofelix.spotmusic.domain.Musica;
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

  public void salvar(Musica musica) {
    musicaRepository.save(musica);
  }

  @Transactional(readOnly = true)
  public List<Musica> recuperar() {
    return musicaRepository.findAll();
  }

  @Transactional(readOnly = true)
  public Musica recuperarPorId(long id) {
    return musicaRepository.findById(id).orElse(null);
  }

  public void atualizar(Musica musica) {
    musicaRepository.save(musica);
  }

  public void excluir(long id) {
    musicaRepository.deleteById(id);
  }
}