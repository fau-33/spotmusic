import { Star } from 'lucide-react';

interface RatingBadgeProps {
  nota: number;
}

export function RatingBadge({ nota }: RatingBadgeProps) {
  const clamped = Math.max(0, Math.min(10, nota));
  const percentage = (clamped / 10) * 100;

  const colorClasses =
    clamped >= 8
      ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
      : clamped >= 5
        ? 'text-amber-300 bg-amber-500/15 border-amber-500/30'
        : 'text-rose-400 bg-rose-500/15 border-rose-500/30';

  const barColor =
    clamped >= 8
      ? 'bg-emerald-400'
      : clamped >= 5
        ? 'bg-amber-400'
        : 'bg-rose-400';

  return (
    <div className="flex items-center gap-2.5">
      <div className="hidden sm:block h-1.5 w-20 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tabular-nums ${colorClasses}`}
      >
        <Star className="h-3 w-3 fill-current" />
        {clamped}/10
      </span>
    </div>
  );
}
