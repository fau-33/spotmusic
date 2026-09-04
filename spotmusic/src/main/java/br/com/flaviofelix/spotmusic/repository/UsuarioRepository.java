package br.com.flaviofelix.spotmusic.repository;

import br.com.flaviofelix.spotmusic.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {


  Optional<Usuario> findByEmail(String email);

}