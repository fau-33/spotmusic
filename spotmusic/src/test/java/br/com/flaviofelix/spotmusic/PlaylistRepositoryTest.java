package br.com.flaviofelix.spotmusic;

import br.com.flaviofelix.spotmusic.domain.Playlist;
import br.com.flaviofelix.spotmusic.repository.PlaylistRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;


@DataJpaTest
@TestPropertySource(locations = "classpath:application-test.properties")
public class PlaylistRepositoryTest {

  @Autowired
  private PlaylistRepository playlistRepository;

  @Test
  @DisplayName("Deve salvar uma Playlist no banco de dados e encontrá-la com sucesso")
  public void testarSaveAndFindPlaylist() {
    // 1. Arrange (Preparar o cenário)
    Playlist novaPlaylist = new Playlist();
    novaPlaylist.setNome("Rock Nacional dos Anos 90");
    novaPlaylist.setDescricao("Melhores músicas do rock brasileiro dos anos 90");

    // 2. Act (Agir: mandamos o Repository salvar no banco)
    Playlist playlistSalva = playlistRepository.save(novaPlaylist);

    // Buscamos a playlist recém salva usando o ID que o banco gerou
    Optional<Playlist> playlistEncontrada = playlistRepository.findById(playlistSalva.getId());

    // 3. Assert (Verificar se a ação deu certo)
    // O teste passa se a Playlist realmente existir dentro do Optional retornado
    assertTrue(playlistEncontrada.isPresent(), "A playlist não foi encontrada no banco de dados!");
  }
}