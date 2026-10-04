import { useSession } from '@/lib/session/SessionProvider';
import { cn } from '@/lib/utils';

/**
 * Theme picker (spec §66, §89).
 *
 * Writes to `session.preferences.theme` rather than toggling a class directly, so
 * the choice persists with the rest of the profile, survives a reload, and is
 * honoured by the pre-paint script in `index.html` on the very next load.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { session, updatePreferences } = useSession();
  const current = session.preferences.theme;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span id="theme-label" className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Theme
      </span>
      <div role="radiogroup" aria-labelledby="theme-label" className="inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900/60">
        {(['light', 'dark', 'system'] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={current === option}
            onClick={() => updatePreferences({ theme: option })}
            className={cn(
              'focus-ring min-h-[38px] rounded-lg px-3 text-xs font-semibold capitalize transition-colors',
              current === option
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

