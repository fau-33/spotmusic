import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Disc3,
  Loader2,
  Menu,
  Music2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { MusicaModal } from './components/MusicaModal';
import { PlaylistModal } from './components/PlaylistModal';
import { RatingBadge } from './components/RatingBadge';
import { Sidebar } from './components/Sidebar';
import { api, ApiError } from './services/api';
import type {
  Musica,
  MusicaInput,
  Playlist,
  PlaylistInput,
} from './types/spotmusic';

interface ToastState {
  type: 'success' | 'error';
  message: string;
}

export function App() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState('');

  const [initialLoading, setInitialLoading] = useState(true);
  const [musicasLoading, setMusicasLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Modais de Playlist
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [deletingPlaylist, setDeletingPlaylist] = useState<Playlist | null>(
    null,
  );

  // Modais de Música
  const [musicaModalOpen, setMusicaModalOpen] = useState(false);
  const [editingMusica, setEditingMusica] = useState<Musica | null>(null);
  const [deletingMusica, setDeletingMusica] = useState<Musica | null>(null);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' = 'success') => {
      setToast({ message, type });
    },
    [],
  );

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const loadInitialData = useCallback(async () => {
    setInitialLoading(true);
    setConnectionError(null);
    try {
      const [playlistsData, musicasData] = await Promise.all([
        api.playlists.listar(),
        api.musicas.listar(null),
      ]);
      setPlaylists(playlistsData);
      setMusicas(musicasData);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Não foi possível conectar ao servidor.';
      setConnectionError(message);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInitialData();
  }, [loadInitialData]);

  const loadMusicas = useCallback(
    async (playlistId: number | null) => {
      setMusicasLoading(true);
      try {
        const data = await api.musicas.listar(playlistId);
        setMusicas(data);
        setConnectionError(null);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : 'Erro ao carregar músicas.';
        showToast(message, 'error');
      } finally {
        setMusicasLoading(false);
      }
    },
    [showToast],
  );

  const handleSelectPlaylist = (id: number | null) => {
    setSelectedPlaylistId(id);
    setSearchQuery('');
    void loadMusicas(id);
  };

  // CRUD Playlists
  const handleSavePlaylist = async (data: PlaylistInput, id?: number) => {
    if (id != null) {
      const updated = await api.playlists.atualizar(id, data);
      setPlaylists((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setMusicas((prev) =>
        prev.map((m) =>
          m.playlistId === id ? { ...m, playlistNome: updated.nome } : m,
        ),
      );
      showToast(`Playlist "${updated.nome}" atualizada com sucesso!`);
    } else {
      const created = await api.playlists.criar(data);
      setPlaylists((prev) => [...prev, created]);
      setSelectedPlaylistId(created.id);
      setMusicas([]);
      showToast(`Playlist "${created.nome}" criada com sucesso!`);
    }
  };

  const handleConfirmDeletePlaylist = async () => {
    if (!deletingPlaylist) return;
    const target = deletingPlaylist;
    try {
      await api.playlists.excluir(target.id);
      setPlaylists((prev) => prev.filter((p) => p.id !== target.id));
      if (selectedPlaylistId === target.id) {
        setSelectedPlaylistId(null);
        await loadMusicas(null);
      } else {
        setMusicas((prev) => prev.filter((m) => m.playlistId !== target.id));
      }
      showToast(`Playlist "${target.nome}" excluída.`);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Erro ao excluir playlist.';
      showToast(message, 'error');
    }
  };

  // CRUD Músicas
  const handleSaveMusica = async (data: MusicaInput, id?: number) => {
    if (id != null) {
      const updated = await api.musicas.atualizar(id, data);
      if (selectedPlaylistId !== null && updated.playlistId !== selectedPlaylistId) {
        setMusicas((prev) => prev.filter((m) => m.id !== id));
      } else {
        setMusicas((prev) => prev.map((m) => (m.id === id ? updated : m)));
      }
      showToast(`Música "${updated.titulo}" atualizada!`);
    } else {
      const created = await api.musicas.criar(data);
      if (selectedPlaylistId === null || created.playlistId === selectedPlaylistId) {
        setMusicas((prev) => [...prev, created]);
      }
      showToast(`Música "${created.titulo}" adicionada!`);
    }
  };

  const handleConfirmDeleteMusica = async () => {
    if (!deletingMusica) return;
    const target = deletingMusica;
    try {
      await api.musicas.excluir(target.id);
      setMusicas((prev) => prev.filter((m) => m.id !== target.id));
      showToast(`Música "${target.titulo}" removida.`);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Erro ao excluir música.';
      showToast(message, 'error');
    }
  };

  const selectedPlaylist = useMemo(
    () => playlists.find((p) => p.id === selectedPlaylistId) ?? null,
    [playlists, selectedPlaylistId],
  );

  const filteredMusicas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return musicas;
    return musicas.filter(
      (m) =>
        m.titulo.toLowerCase().includes(q) || m.banda.toLowerCase().includes(q),
    );
  }, [musicas, searchQuery]);

  const averageRating = useMemo(() => {
    if (filteredMusicas.length === 0) return null;
    const sum = filteredMusicas.reduce((acc, m) => acc + m.nota, 0);
    return (sum / filteredMusicas.length).toFixed(1);
  }, [filteredMusicas]);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar
        playlists={playlists}
        selectedPlaylistId={selectedPlaylistId}
        onSelectPlaylist={handleSelectPlaylist}
        onCreatePlaylist={() => {
          setEditingPlaylist(null);
          setPlaylistModalOpen(true);
        }}
        onEditPlaylist={(playlist) => {
          setEditingPlaylist(playlist);
          setPlaylistModalOpen(true);
        }}
        onDeletePlaylist={(playlist) => setDeletingPlaylist(playlist)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Conteúdo principal */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barra mobile */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-zinc-300 hover:bg-zinc-900 hover:text-white"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Disc3 className="h-5 w-5 text-emerald-400" />
            <span className="font-bold text-white">Spotmusic</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingMusica(null);
              setMusicaModalOpen(true);
            }}
            disabled={playlists.length === 0}
            className="rounded-lg bg-emerald-500 p-2 text-zinc-950 hover:bg-emerald-400 disabled:opacity-40"
            aria-label="Nova música"
          >
            <Plus className="h-4 w-4" />
          </button>
        </header>

        {/* Banner de conexão / Render cold start */}
        {initialLoading && (
          <div className="border-b border-emerald-500/20 bg-emerald-500/10 px-6 py-3">
            <div className="mx-auto flex max-w-6xl items-center gap-3 text-sm text-emerald-300">
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              <span>
                Conectando ao servidor... Se a API no Render estiver dormindo,
                isso pode levar alguns segundos.
              </span>
            </div>
          </div>
        )}

        {/* Banner de erro de conexão */}
        {connectionError && !initialLoading && (
          <div className="border-b border-rose-500/20 bg-rose-500/10 px-6 py-3.5">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-sm text-rose-200">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{connectionError}</span>
              </div>
              <button
                type="button"
                onClick={() => void loadInitialData()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-100 ring-1 ring-rose-500/40 hover:bg-rose-500/30"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8">
          {/* Hero da Playlist / Biblioteca */}
          <section className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-emerald-950/70 via-zinc-900 to-zinc-950 p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-start gap-4 sm:items-center sm:gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-zinc-950 shadow-xl shadow-emerald-500/20 sm:h-20 sm:w-20">
                  <Music2 className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                    {selectedPlaylist ? 'Playlist' : 'Biblioteca'}
                  </span>
                  <h2 className="mt-1 truncate text-2xl font-bold tracking-tight text-white sm:text-4xl">
                    {selectedPlaylist
                      ? selectedPlaylist.nome
                      : 'Todas as Músicas'}
                  </h2>
                  <p className="mt-1.5 max-w-2xl text-sm text-zinc-300">
                    {selectedPlaylist
                      ? selectedPlaylist.descricao
                      : 'Explore, avalie e organize todas as faixas cadastradas nas suas playlists.'}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                    <span className="rounded-full bg-zinc-900/90 px-3 py-1 ring-1 ring-zinc-800">
                      {filteredMusicas.length}{' '}
                      {filteredMusicas.length === 1 ? 'música' : 'músicas'}
                    </span>
                    {averageRating && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900/90 px-3 py-1 text-emerald-300 ring-1 ring-zinc-800">
                        <Star className="h-3 w-3 fill-current" />
                        Média {averageRating}/10
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {selectedPlaylist && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPlaylist(selectedPlaylist);
                        setPlaylistModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900/80 px-3.5 py-2.5 text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingPlaylist(selectedPlaylist)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs font-medium text-rose-300 transition-colors hover:bg-rose-500/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Excluir
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setEditingMusica(null);
                    setMusicaModalOpen(true);
                  }}
                  disabled={playlists.length === 0}
                  title={
                    playlists.length === 0
                      ? 'Crie uma playlist antes de adicionar músicas'
                      : 'Adicionar nova música'
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:bg-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Plus className="h-4 w-4" />
                  Nova Música
                </button>
              </div>
            </div>
          </section>

          {/* Barra de busca */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título ou banda..."
                className="w-full rounded-full border border-zinc-800 bg-zinc-900/90 py-2.5 pr-10 pl-10 text-sm text-white placeholder-zinc-500 outline-hidden transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  aria-label="Limpar busca"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {playlists.length === 0 && !initialLoading && !connectionError && (
              <button
                type="button"
                onClick={() => {
                  setEditingPlaylist(null);
                  setPlaylistModalOpen(true);
                }}
                className="inline-flex items-center gap-2 self-start rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 sm:self-auto"
              >
                <Plus className="h-3.5 w-3.5" />
                Crie uma playlist para começar
              </button>
            )}
          </div>

          {/* Lista de Músicas */}
          <section className="mt-6 flex-1">
            {initialLoading || musicasLoading ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-900/40 py-20 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                <p className="mt-3 text-sm font-medium text-zinc-300">
                  Carregando músicas...
                </p>
              </div>
            ) : filteredMusicas.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-500">
                  <Music2 className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {searchQuery
                    ? 'Nenhuma música encontrada'
                    : 'Nenhuma música por aqui ainda'}
                </h3>
                <p className="mt-1 max-w-sm text-sm text-zinc-400">
                  {searchQuery
                    ? `Não encontramos resultados para "${searchQuery}". Tente outro título ou artista.`
                    : playlists.length === 0
                      ? 'Crie sua primeira playlist no menu lateral para começar a adicionar suas músicas favoritas.'
                      : 'Adicione sua primeira música e dê uma nota de 0 a 10.'}
                </p>
                {!searchQuery && playlists.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMusica(null);
                      setMusicaModalOpen(true);
                    }}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Música
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40">
                {/* Cabeçalho Desktop */}
                <div className="hidden grid-cols-12 items-center border-b border-zinc-800/80 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:grid">
                  <div className="col-span-1">#</div>
                  <div className={selectedPlaylist ? 'col-span-5' : 'col-span-4'}>
                    Título / Banda
                  </div>
                  {!selectedPlaylist && <div className="col-span-2">Playlist</div>}
                  <div className="col-span-3">Avaliação</div>
                  <div className="col-span-2 text-right">Ações</div>
                </div>

                {/* Linhas */}
                <div className="divide-y divide-zinc-800/60">
                  {filteredMusicas.map((musica, index) => (
                    <div
                      key={musica.id}
                      className="group flex flex-col gap-3 px-4 py-3.5 transition-colors hover:bg-zinc-900/90 md:grid md:grid-cols-12 md:items-center md:gap-2 md:px-5"
                    >
                      {/* Índice desktop */}
                      <div className="hidden text-sm font-medium tabular-nums text-zinc-500 md:col-span-1 md:block">
                        {index + 1}
                      </div>

                      {/* Título & Banda */}
                      <div
                        className={`flex min-w-0 items-center gap-3 ${
                          selectedPlaylist ? 'md:col-span-5' : 'md:col-span-4'
                        }`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800/90 text-emerald-400 group-hover:bg-emerald-500/15">
                          <Music2 className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">
                            {musica.titulo}
                          </p>
                          <p className="truncate text-xs text-zinc-400">
                            {musica.banda}
                          </p>
                        </div>
                      </div>

                      {/* Playlist badge (quando em Todas as Músicas) */}
                      {!selectedPlaylist && (
                        <div className="md:col-span-2">
                          {musica.playlistNome ? (
                            <button
                              type="button"
                              onClick={() =>
                                musica.playlistId != null &&
                                handleSelectPlaylist(musica.playlistId)
                              }
                              className="inline-flex max-w-full items-center truncate rounded-full bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:bg-emerald-500/15 hover:text-emerald-300"
                            >
                              {musica.playlistNome}
                            </button>
                          ) : (
                            <span className="text-xs text-zinc-600">—</span>
                          )}
                        </div>
                      )}

                      {/* Nota + Ações */}
                      <div className="flex items-center justify-between md:col-span-3 md:justify-start">
                        <RatingBadge nota={musica.nota} />

                        {/* Ações mobile */}
                        <div className="flex items-center gap-1 md:hidden">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMusica(musica);
                              setMusicaModalOpen(true);
                            }}
                            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-emerald-400"
                            aria-label={`Editar ${musica.titulo}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingMusica(musica)}
                            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-rose-400"
                            aria-label={`Excluir ${musica.titulo}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Ações desktop */}
                      <div className="hidden items-center justify-end gap-1 md:col-span-2 md:flex">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingMusica(musica);
                            setMusicaModalOpen(true);
                          }}
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-emerald-400"
                          title="Editar música"
                          aria-label={`Editar ${musica.titulo}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingMusica(musica)}
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-rose-400"
                          title="Excluir música"
                          aria-label={`Excluir ${musica.titulo}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Modais */}
      <PlaylistModal
        isOpen={playlistModalOpen}
        playlist={editingPlaylist}
        onClose={() => setPlaylistModalOpen(false)}
        onSubmit={handleSavePlaylist}
      />

      <MusicaModal
        isOpen={musicaModalOpen}
        musica={editingMusica}
        playlists={playlists}
        defaultPlaylistId={selectedPlaylistId}
        onClose={() => setMusicaModalOpen(false)}
        onSubmit={handleSaveMusica}
      />

      <ConfirmDeleteModal
        isOpen={deletingPlaylist !== null}
        title="Excluir playlist?"
        description={`Tem certeza que deseja excluir a playlist "${deletingPlaylist?.nome}"? Todas as músicas vinculadas a ela também serão removidas.`}
        onClose={() => setDeletingPlaylist(null)}
        onConfirm={handleConfirmDeletePlaylist}
      />

      <ConfirmDeleteModal
        isOpen={deletingMusica !== null}
        title="Excluir música?"
        description={`Tem certeza que deseja remover "${deletingMusica?.titulo}" (${deletingMusica?.banda})?`}
        onClose={() => setDeletingMusica(null)}
        onConfirm={handleConfirmDeleteMusica}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed right-4 bottom-4 z-50 flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm shadow-2xl">
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          )}
          <span className="text-zinc-100">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default App;
