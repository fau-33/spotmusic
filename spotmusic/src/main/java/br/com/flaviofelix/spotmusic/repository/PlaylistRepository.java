package br.com.flaviofelix.spotmusic.repository;

import br.com.flaviofelix.spotmusic.domain.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

}
