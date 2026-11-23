package br.com.flaviofelix.spotmusic;

import br.com.flaviofelix.spotmusic.controller.HealthController;
import br.com.flaviofelix.spotmusic.controller.PlaylistRestController;
import br.com.flaviofelix.spotmusic.domain.Playlist;
import br.com.flaviofelix.spotmusic.service.PlaylistService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest({PlaylistRestController.class, HealthController.class})
public class PlaylistControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private PlaylistService playlistService;

  @Test
  public void deveListarPlaylistsEmJsonComSucesso() throws Exception {
    Playlist playlist = new Playlist();
    playlist.setId(1L);
    playlist.setNome("Rock Nacional");
    playlist.setDescricao("Clássicos do rock brasileiro");

    when(playlistService.recuperar()).thenReturn(List.of(playlist));

    mockMvc.perform(get("/api/playlists"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].nome").value("Rock Nacional"))
        .andExpect(jsonPath("$[0].descricao").value("Clássicos do rock brasileiro"));
  }

  @Test
  public void deveRetornar400EmJsonQuandoValidacaoFalhar() throws Exception {
    mockMvc.perform(post("/api/playlists")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"nome\": \"\", \"descricao\": \"\"}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.status").value(400))
        .andExpect(jsonPath("$.error").value("Erro de validação"))
        .andExpect(jsonPath("$.campos.nome").exists())
        .andExpect(jsonPath("$.campos.descricao").exists());
  }

  @Test
  public void deveRetornarStatusUpNoEndpointDeHealth() throws Exception {
    mockMvc.perform(get("/api/health"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("UP"));
  }
}
