import { useEffect, useState } from 'react';
import { AlertCircle, Loader2, Star, X } from 'lucide-react';
import { ApiError } from '../services/api';
import type { Musica, MusicaInput, Playlist } from '../types/spotmusic';

interface MusicaModalProps {
  isOpen: boolean;
  musica: Musica | null;
  playlists: Playlist[];
  defaultPlaylistId: number | null;
  onClose: () => void;
  onSubmit: (data: MusicaInput, id?: number) => Promise<void>;
}

export function MusicaModal({
  isOpen,
  musica,
  playlists,
  defaultPlaylistId,
  onClose,
  onSubmit,
}: MusicaModalProps) {
  const [titulo, setTitulo] = useState('');
  const [banda, setBanda] = useState('');
  const [nota, setNota] = useState(8);
  const [playlistId, setPlaylistId] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setTitulo(musica?.titulo ?? '');
      setBanda(musica?.banda ?? '');
      setNota(musica?.nota ?? 8);
      const initialPlaylistId =
        musica?.playlistId ?? defaultPlaylistId ?? playlists[0]?.id ?? '';
      setPlaylistId(initialPlaylistId ? String(initialPlaylistId) : '');
      setGeneralError(null);
      setFieldErrors({});
      setSaving(false);
    }
  }, [isOpen, musica, defaultPlaylistId, playlists]);

  if (!isOpen) return null;

  const isEditing = musica !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setGeneralError(null);
    setFieldErrors({});

    const parsedPlaylistId = Number(playlistId);
    if (!playlistId || Number.isNaN(parsedPlaylistId)) {
      setFieldErrors({ playlistId: 'Selecione uma playlist.' });
      setSaving(false);
      return;
    }

    try {
      await onSubmit(
        {
          titulo: titulo.trim(),
          banda: banda.trim(),
          nota,
          playlistId: parsedPlaylistId,
        },
        musica?.id,
      );
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.campos && Object.keys(err.campos).length > 0) {
          setFieldErrors(err.campos);
        } else {
          setGeneralError(err.message);
        }
      } else {
        setGeneralError('Erro inesperado ao salvar a música.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? 'Editar Música' : 'Adicionar Música'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Fechar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6" noValidate>
          {generalError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="musica-playlist"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Playlist
            </label>
            <select
              id="musica-playlist"
              value={playlistId}
              onChange={(e) => setPlaylistId(e.target.value)}
              className={`w-full rounded-xl border bg-zinc-950 px-3.5 py-2.5 text-sm text-white outline-hidden transition-colors focus:ring-2 ${
                fieldErrors.playlistId
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500/20'
              }`}
            >
              <option value="" disabled>
                Selecione uma playlist
              </option>
              {playlists.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
            {fieldErrors.playlistId && (
              <p className="mt-1.5 text-xs text-rose-400">
                {fieldErrors.playlistId}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="musica-titulo"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Título da Música
            </label>
            <input
              id="musica-titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex.: Tempo Perdido"
              maxLength={50}
              className={`w-full rounded-xl border bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-hidden transition-colors focus:ring-2 ${
                fieldErrors.titulo
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500/20'
              }`}
            />
            {fieldErrors.titulo && (
              <p className="mt-1.5 text-xs text-rose-400">
                {fieldErrors.titulo}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="musica-banda"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Banda / Artista
            </label>
            <input
              id="musica-banda"
              type="text"
              value={banda}
              onChange={(e) => setBanda(e.target.value)}
              placeholder="Ex.: Legião Urbana"
              maxLength={50}
              className={`w-full rounded-xl border bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-hidden transition-colors focus:ring-2 ${
                fieldErrors.banda
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500/20'
              }`}
            />
            {fieldErrors.banda && (
              <p className="mt-1.5 text-xs text-rose-400">
                {fieldErrors.banda}
              </p>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="musica-nota"
                className="text-sm font-medium text-zinc-300"
              >
                Nota (0 a 10)
              </label>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                <Star className="h-3 w-3 fill-current" />
                {nota}/10
              </span>
            </div>
            <input
              id="musica-nota"
              type="range"
              min={0}
              max={10}
              step={1}
              value={nota}
              onChange={(e) => setNota(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-emerald-500"
            />
            <div className="mt-1 flex justify-between text-[11px] text-zinc-500">
              <span>0</span>
              <span>5</span>
              <span>10</span>
            </div>
            {fieldErrors.nota && (
              <p className="mt-1.5 text-xs text-rose-400">{fieldErrors.nota}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || playlists.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? 'Salvar alterações' : 'Adicionar música'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
