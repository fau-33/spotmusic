import { useEffect, useState } from 'react';
import { AlertCircle, Loader2, X } from 'lucide-react';
import { ApiError } from '../services/api';
import type { Playlist, PlaylistInput } from '../types/spotmusic';

interface PlaylistModalProps {
  isOpen: boolean;
  playlist: Playlist | null;
  onClose: () => void;
  onSubmit: (data: PlaylistInput, id?: number) => Promise<void>;
}

export function PlaylistModal({
  isOpen,
  playlist,
  onClose,
  onSubmit,
}: PlaylistModalProps) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [saving, setSaving] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setNome(playlist?.nome ?? '');
      setDescricao(playlist?.descricao ?? '');
      setGeneralError(null);
      setFieldErrors({});
      setSaving(false);
    }
  }, [isOpen, playlist]);

  if (!isOpen) return null;

  const isEditing = playlist !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setGeneralError(null);
    setFieldErrors({});

    try {
      await onSubmit(
        { nome: nome.trim(), descricao: descricao.trim() },
        playlist?.id,
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
        setGeneralError('Erro inesperado ao salvar a playlist.');
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
            {isEditing ? 'Editar Playlist' : 'Nova Playlist'}
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
              htmlFor="playlist-nome"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Nome da Playlist
            </label>
            <input
              id="playlist-nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Rock Nacional"
              maxLength={60}
              className={`w-full rounded-xl border bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-hidden transition-colors focus:ring-2 ${
                fieldErrors.nome
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500/20'
              }`}
            />
            {fieldErrors.nome && (
              <p className="mt-1.5 text-xs text-rose-400">{fieldErrors.nome}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="playlist-descricao"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Descrição
            </label>
            <textarea
              id="playlist-descricao"
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o estilo ou humor desta playlist..."
              className={`w-full resize-none rounded-xl border bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-hidden transition-colors focus:ring-2 ${
                fieldErrors.descricao
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500/20'
              }`}
            />
            {fieldErrors.descricao && (
              <p className="mt-1.5 text-xs text-rose-400">
                {fieldErrors.descricao}
              </p>
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
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? 'Salvar alterações' : 'Criar playlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
