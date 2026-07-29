package br.com.flaviofelix.spotmusic.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

@Entity
@Table(name = "playlists")
public class Playlist {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @NotBlank
  @Size(min = 2, max = 60)
  @Column(nullable = false, length = 60)
  private String nome;

  @NotBlank
  @Column(nullable = false)
  private String descricao;

  @OneToMany(mappedBy = "playlist", cascade = CascadeType.ALL)
  private List<Musica> musicas;

  public Playlist() {
  }

  public long getId() { return id; }
  public void setId(long id) { this.id = id; }

  public String getNome() { return nome; }
  public void setNome(String nome) { this.nome = nome; }

  public String getDescricao() { return descricao; }
  public void setDescricao(String descricao) { this.descricao = descricao; }

  public List<Musica> getMusicas() { return musicas; }
  public void setMusicas(List<Musica> musicas) { this.musicas = musicas; }
}