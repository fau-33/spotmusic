import {
  Disc3,
  Library,
  ListMusic,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import type { Playlist } from '../types/spotmusic';

interface SidebarProps {
  playlists: Playlist[];
  selectedPlaylistId: number | null;
  onSelectPlaylist: (id: number | null) => void;
  onCreatePlaylist: () => void;
  onEditPlaylist: (playlist: Playlist) => void;
  onDeletePlaylist: (playlist: Playlist) => void;
  isOpen: boolean;
  onClose: () => void;
  totalMusicasCount?: number;
}

export function Sidebar({
  playlists,
  selectedPlaylistId,
  onSelectPlaylist,
  onCreatePlaylist,
  onEditPlaylist,
  onDeletePlaylist,
  isOpen,
  onClose,
}: SidebarProps) {
  const handleSelect = (id: number | null) => {
    onSelectPlaylist(id);
    onClose();
  };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-zinc-800/80 bg-zinc-950 transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20">
              <Disc3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Spotmusic
              </h1>
              <p className="text-[11px] font-medium text-zinc-400">
                Sua biblioteca musical
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navegação principal */}
        <div className="px-3">
          <button
            type="button"
            onClick={() => handleSelect(null)}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
              selectedPlaylistId === null
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
            }`}
          >
            <Library className="h-4 w-4 shrink-0" />
            <span>Todas as Músicas</span>
          </button>
        </div>

        {/* Cabeçalho Playlists */}
        <div className="mt-6 flex items-center justify-between px-5 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Playlists ({playlists.length})
          </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onCreatePlaylist();
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-2.5 py-1 text-xs font-medium text-emerald-400 ring-1 ring-zinc-800 transition-colors hover:bg-emerald-500 hover:text-zinc-950 hover:ring-emerald-500"
            title="Nova Playlist"
          >
            <Plus className="h-3.5 w-3.5" />
            Nova
          </button>
        </div>

        {/* Lista de Playlists */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {playlists.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800 px-4 py-6 text-center">
              <ListMusic className="mx-auto mb-2 h-6 w-6 text-zinc-600" />
              <p className="text-xs text-zinc-400">
                Nenhuma playlist criada ainda.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCreatePlaylist();
                }}
                className="mt-3 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                + Criar primeira playlist
              </button>
            </div>
          ) : (
            playlists.map((playlist) => {
              const isSelected = selectedPlaylistId === playlist.id;
              return (
                <div
                  key={playlist.id}
                  className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 transition-colors ${
                    isSelected
                      ? 'bg-zinc-900 text-white ring-1 ring-emerald-500/40'
                      : 'text-zinc-300 hover:bg-zinc-900/70 hover:text-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(playlist.id)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isSelected
                          ? 'bg-emerald-500 text-zinc-950'
                          : 'bg-zinc-800 text-zinc-400 group-hover:text-emerald-400'
                      }`}
                    >
                      <ListMusic className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {playlist.nome}
                      </p>
                      <p className="truncate text-xs text-zinc-500">
                        {playlist.descricao}
                      </p>
                    </div>
                  </button>

                  <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                        onEditPlaylist(playlist);
                      }}
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-emerald-400"
                      title="Editar playlist"
                      aria-label={`Editar playlist ${playlist.nome}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                        onDeletePlaylist(playlist);
                      }}
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-rose-400"
                      title="Excluir playlist"
                      aria-label={`Excluir playlist ${playlist.nome}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </nav>

        {/* Rodapé */}
        <div className="border-t border-zinc-800/80 px-5 py-3 text-xs text-zinc-500">
          Spotmusic • Spring Boot + React
        </div>
      </aside>
    </>
  );
}
