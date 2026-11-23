export interface Playlist {
  id: number;
  nome: string;
  descricao: string;
}

export interface PlaylistInput {
  nome: string;
  descricao: string;
}

export interface Musica {
  id: number;
  titulo: string;
  banda: string;
  nota: number;
  playlistId: number | null;
  playlistNome: string | null;
}

export interface MusicaInput {
  titulo: string;
  banda: string;
  nota: number;
  playlistId: number;
}

export interface ApiErrorResponse {
  timestamp?: string;
  status: number;
  error: string;
  message?: string;
  campos?: Record<string, string>;
}
