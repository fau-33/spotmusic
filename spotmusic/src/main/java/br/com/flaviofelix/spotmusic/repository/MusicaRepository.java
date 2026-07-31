package br.com.flaviofelix.spotmusic.repository;

import br.com.flaviofelix.spotmusic.domain.Musica;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MusicaRepository extends JpaRepository<Musica, Long> {
}
