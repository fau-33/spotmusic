package br.com.flaviofelix.spotmusic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PlaylistRequestDTO(
    @NotBlank(message = "O nome da playlist é obrigatório")
    @Size(min = 2, max = 60, message = "O nome deve ter entre 2 e 60 caracteres")
    String nome,

    @NotBlank(message = "A descrição da playlist é obrigatória")
    String descricao
) {
}
