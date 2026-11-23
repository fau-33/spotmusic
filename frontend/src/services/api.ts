import type {
  ApiErrorResponse,
  Musica,
  MusicaInput,
  Playlist,
  PlaylistInput,
} from '../types/spotmusic';

const DEFAULT_API_URL = 'https://spotmusic-ysan.onrender.com';
const REQUEST_TIMEOUT_MS = 35000;

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL?.trim() || DEFAULT_API_URL
).replace(/\/+$/, '');

export class ApiError extends Error {
  status: number;
  campos?: Record<string, string>;

  constructor(message: string, status: number, campos?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.campos = campos;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal ?? controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError(
        'Tempo limite esgotado ao conectar ao servidor. O backend no Render pode estar indisponível ou demorando para iniciar.',
        0,
      );
    }
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique sua conexão ou aguarde o servidor iniciar.',
      0,
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    let errorData: Partial<ApiErrorResponse> | null = null;
    try {
      errorData = (await response.json()) as Partial<ApiErrorResponse>;
    } catch {
      errorData = null;
    }

    const message =
      errorData?.message ||
      errorData?.error ||
      `Erro ao comunicar com o servidor (HTTP ${response.status}).`;

    throw new ApiError(message, response.status, errorData?.campos);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError(
      'Resposta inválida recebida do servidor.',
      response.status,
    );
  }
}

export const api = {
  health: () => request<{ status: string }>('/api/health'),

  playlists: {
    listar: () => request<Playlist[]>('/api/playlists'),
    buscarPorId: (id: number) => request<Playlist>(`/api/playlists/${id}`),
    criar: (data: PlaylistInput) =>
      request<Playlist>('/api/playlists', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    atualizar: (id: number, data: PlaylistInput) =>
      request<Playlist>(`/api/playlists/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    excluir: (id: number) =>
      request<void>(`/api/playlists/${id}`, {
        method: 'DELETE',
      }),
  },

  musicas: {
    listar: (playlistId?: number | null) => {
      const query = playlistId != null ? `?playlistId=${playlistId}` : '';
      return request<Musica[]>(`/api/musicas${query}`);
    },
    buscarPorId: (id: number) => request<Musica>(`/api/musicas/${id}`),
    criar: (data: MusicaInput) =>
      request<Musica>('/api/musicas', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    atualizar: (id: number, data: MusicaInput) =>
      request<Musica>(`/api/musicas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    excluir: (id: number) =>
      request<void>(`/api/musicas/${id}`, {
        method: 'DELETE',
      }),
  },
};
