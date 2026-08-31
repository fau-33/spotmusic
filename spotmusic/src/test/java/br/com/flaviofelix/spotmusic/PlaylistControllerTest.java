package br.com.flaviofelix.spotmusic;

import br.com.flaviofelix.spotmusic.controller.PlaylistController;
import br.com.flaviofelix.spotmusic.service.PlaylistService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PlaylistController.class)
public class PlaylistControllerTest {

  @Autowired
  private MockMvc navegadorFantasma;

  @MockBean
  private PlaylistService playlistService;

  @Test
  public void testarSeAPaginaDePlaylistsCarregaComSucesso() throws Exception {
    navegadorFantasma.perform(get("/playlists/listar"))
            .andExpect(status().isOk());
  }
}