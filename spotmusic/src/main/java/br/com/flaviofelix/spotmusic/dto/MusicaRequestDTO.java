package br.com.flaviofelix.spotmusic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.Range;

public record MusicaRequestDTO(
    @NotBlank(message = "O título da música é obrigatório")
    @Size(min = 2, max = 50, message = "O título deve ter entre 2 e 50 caracteres")
    String titulo,

    @NotBlank(message = "A banda/artista é obrigatória")
    @Size(min = 2, max = 50, message = "A banda deve ter entre 2 e 50 caracteres")
    String banda,

    @Range(min = 0, max = 10, message = "A nota deve estar entre 0 e 10")
    int nota,

    @NotNull(message = "O ID da playlist é obrigatório")
    Long playlistId
) {
}
