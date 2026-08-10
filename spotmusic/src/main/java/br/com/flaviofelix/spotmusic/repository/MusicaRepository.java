package br.com.flaviofelix.spotmusic.repository;

import br.com.flaviofelix.spotmusic.domain.Musica;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MusicaRepository extends JpaRepository<Musica, Long> {

  // Busca todas as músicas que pertencem a uma playlist específica
  List<Musica> findByPlaylistId(long playlistId);

  // Busca uma música específica dentro de uma playlist específica
  Musica findByIdAndPlaylistId(long id, long playlistId);
}