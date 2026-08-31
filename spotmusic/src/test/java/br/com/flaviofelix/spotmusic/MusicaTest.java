package br.com.flaviofelix.spotmusic;

// Olha a correção aqui na linha de baixo: mudamos de .model para .domain!
import br.com.flaviofelix.spotmusic.domain.Musica;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class MusicaTest {

  @Test // Essa anotação é o que diz pro Java: "Ei, isso aqui é um teste!"
  public void testarSeMusicaGuardaONomeCorretamente() {
    // 1. Preparação (O que eu preciso para o teste?)
    Musica musica = new Musica();

    // 2. Ação (O que eu vou testar?)
    musica.setTitulo("Faroeste Caboclo");

    // 3. Verificação (O resultado foi o esperado?)
    // O robô do JUnit vai checar se a música realmente guardou o texto
    assertEquals("Faroeste Caboclo", musica.getTitulo());
  }
}