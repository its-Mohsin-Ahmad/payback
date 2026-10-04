import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { AlertTriangle, Check, CheckCircle2, Info, ShieldCheck, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ButtonLoader } from '@/components/loaders';

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

type ButtonVariant = 'primary' | 'emerald' | 'dark' | 'outline' | 'ghost' | 'soft' | 'danger' | 'link';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    'bg-navy text-white hover:bg-navy-800 active:bg-navy shadow-soft disabled:bg-slate-300 disabled:text-slate-500',
  emerald:
    'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 shadow-soft disabled:bg-emerald-500/40',
  dark: 'bg-navy-800 text-white hover:bg-navy active:bg-navy disabled:bg-slate-300',
  outline:
    'border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 disabled:text-slate-400',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:text-slate-400',
  soft: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-60',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 disabled:bg-rose-300',
  link: 'text-emerald-600 underline-offset-4 hover:underline px-0',
};

const buttonSizes: Record<ButtonSize, string> = {
  xs: 'h-7 gap-1.5 rounded-lg px-2.5 text-xs font-semibold',
  sm: 'h-9 gap-1.5 rounded-lg px-3.5 text-sm font-semibold',
  md: 'h-11 gap-2 rounded-xl px-5 text-sm font-semibold',
  lg: 'h-12 gap-2 rounded-xl px-6 text-base font-semibold',
  icon: 'h-11 w-11 rounded-xl',
  'icon-sm': 'h-9 w-9 rounded-lg',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  block?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  block,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'focus-ring inline-flex items-center justify-center whitespace-nowrap transition-colors duration-150',
        'disabled:cursor-not-allowed',
        buttonVariants[variant],
        buttonSizes[size],
        block && 'w-full',
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {/*
        The busy state comes from the unified loading system, so every button in
        the product shows the same arc and announces itself the same way instead
        of each screen rolling its own generic spinner.
      */}
      {loading ? (
        <ButtonLoader tone={variant === 'outline' || variant === 'ghost' || variant === 'soft' || variant === 'link' ? 'dark' : 'light'} />
      ) : (
        icon
      )}
      <span className={cn(loading && 'opacity-80')}>{children}</span>
      {loading ? null : iconRight}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Badge / Pill / Status                                               */
/* ------------------------------------------------------------------ */

type Tone = 'neutral' | 'emerald' | 'sky' | 'amber' | 'rose' | 'violet' | 'navy' | 'slate';

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  sky: 'bg-sky-50 text-sky-700 ring-sky-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200',
  violet: 'bg-violet-50 text-violet-700 ring-violet-200',
  navy: 'bg-navy text-white ring-navy',
  slate: 'bg-slate-800 text-white ring-slate-800',
};

export function Badge({
  tone = 'neutral',
  className,
  children,
  icon,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset',
        toneClasses[tone],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function Pill({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600', className)}>
      {children}
    </span>
  );
}

const statusTone: Record<string, Tone> = {
  completed: 'emerald',
  paid: 'emerald',
  active: 'emerald',
  approved: 'emerald',
  verified: 'emerald',
  success: 'emerald',
  resolved: 'emerald',
  available: 'emerald',
  connected: 'emerald',
  operational: 'emerald',
  pending: 'amber',
  processing: 'amber',
  due: 'amber',
  'in review': 'amber',
  'in progress': 'amber',
  investigating: 'amber',
  'awaiting merchant': 'amber',
  'awaiting info': 'amber',
  'additional info needed': 'amber',
  scheduled: 'sky',
  sent: 'sky',
  review: 'sky',
  draft: 'neutral',
  invited: 'sky',
  restricted: 'amber',
  limited: 'amber',
  failed: 'rose',
  cancelled: 'rose',
  flagged: 'rose',
  overdue: 'rose',
  blocked: 'rose',
  suspended: 'rose',
  frozen: 'rose',
  expired: 'rose',
  high: 'rose',
  medium: 'amber',
  low: 'emerald',
  degraded: 'rose',
  simulated: 'violet',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = statusTone[status.toLowerCase()] ?? 'neutral';
  return (
    <Badge tone={tone} className={className}>
      {status}
    </Badge>
  );
}

export function SecurityBadge({ label = '256-bit encrypted' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
      <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

export function Card({
  className,
  children,
  as: As = 'div',
}: {
  className?: string;
  children: ReactNode;
  as?: 'div' | 'section' | 'article' | 'li';
}) {
  return <As className={cn('card-base', className)}>{children}</As>;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
  icon,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4', className)}>
      <div className="flex min-w-0 items-start gap-3">
        {icon ? <span className="mt-0.5 text-emerald-600">{icon}</span> : null}
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-900">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>;
}

export function CardFooter({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-3', className)}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Form controls                                                       */
/* ------------------------------------------------------------------ */

const controlBase =
  'focus-ring w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors disabled:bg-slate-50 disabled:text-slate-500';

export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  className,
}: {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label ? (
        <label htmlFor={htmlFor} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
          {required ? <span className="text-rose-500">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="flex items-center gap-1 text-xs font-medium text-rose-600">
          <XCircle className="h-3.5 w-3.5" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  containerClassName?: string;
}

export function Input({ label, hint, error, leftIcon, rightSlot, className, containerClassName, id, required, ...rest }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={inputId} className={containerClassName}>
      <div className="relative">
        {leftIcon ? <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{leftIcon}</span> : null}
        <input
          id={inputId}
          className={cn(
            controlBase,
            'h-11',
            error ? 'border-rose-300 focus-visible:ring-rose-500' : 'border-slate-300',
            leftIcon && 'pl-10',
            rightSlot && 'pr-12',
            className
          )}
          aria-invalid={error ? true : undefined}
          {...rest}
        />
        {rightSlot ? <span className="absolute right-2 top-1/2 -translate-y-1/2">{rightSlot}</span> : null}
      </div>
    </Field>
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
}

export function Textarea({ label, hint, error, className, id, required, rows = 4, ...rest }: TextareaProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={inputId}>
      <textarea
        id={inputId}
        rows={rows}
        className={cn(controlBase, 'py-2.5', error ? 'border-rose-300' : 'border-slate-300', className)}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
    </Field>
  );
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  options?: { value: string; label: string }[];
  containerClassName?: string;
}

const chevronBg =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")";

export function Select({ label, hint, error, options, className, containerClassName, id, required, children, ...rest }: SelectProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={inputId} className={containerClassName}>
      <select
        id={inputId}
        className={cn(
          controlBase,
          'h-11 appearance-none bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pr-10',
          error ? 'border-rose-300' : 'border-slate-300',
          className
        )}
        style={{ backgroundImage: chevronBg }}
        {...rest}
      >
        {options
          ? options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))
          : children}
      </select>
    </Field>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
  disabled,
  id,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
  id?: string;
}) {
  const autoId = useId();
  const switchId = id ?? autoId;
  return (
    <div className="flex items-start justify-between gap-4">
      {label ? (
        <label htmlFor={switchId} className="cursor-pointer">
          <span className="block text-sm font-medium text-slate-800">{label}</span>
          {hint ? <span className="mt-0.5 block text-xs text-slate-500">{hint}</span> : null}
        </label>
      ) : null}
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={typeof label === 'string' ? label : 'Toggle'}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'focus-ring relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
          checked ? 'bg-emerald-500' : 'bg-slate-300',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <span
          className={cn('inline-block h-[18px] w-[18px] rounded-full bg-white shadow transition-transform', checked ? 'translate-x-[22px]' : 'translate-x-[3px]')}
        />
      </button>
    </div>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: ReactNode;
  disabled?: boolean;
}) {
  return (
    <label className={cn('inline-flex cursor-pointer items-start gap-2.5', disabled && 'cursor-not-allowed opacity-60')}>
      <span
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors',
          checked ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 bg-white'
        )}
      >
        {checked ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Overlays: Modal & Drawer                                            */
/* ------------------------------------------------------------------ */

function useLockScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}

function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, onEscape]);
}

/**
 * Focus management for overlays (spec §188).
 *
 * Opening a sheet moves focus inside it, and closing returns focus to the
 * control that opened it. Without this, keyboard and screen-reader users are
 * dropped back at the top of the document after every dismissal.
 */
function useFocusReturn(open: boolean, container: React.RefObject<HTMLElement>) {
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (open) {
      opener.current = (document.activeElement as HTMLElement) ?? null;
      // Focus the container itself rather than its first control, so a screen
      // reader announces the sheet's title before its contents.
      const target = container.current;
      if (target) {
        target.focus({ preventScroll: true });
      }
      return;
    }
    const el = opener.current;
    if (el && document.contains(el)) el.focus({ preventScroll: true });
    opener.current = null;
  }, [open, container]);
}

/**
 * Bottom sheet — the mobile form of every dialog (spec §106).
 *
 * On a phone a centred modal is a desktop artefact: it floats in the middle of
 * the screen where thumbs cannot reach and wastes the space either side. This
 * anchors to the bottom edge instead, with a drag handle, and grows only as far
 * as its content needs.
 *
 * Drag-to-dismiss is implemented with pointer events so it works for mouse,
 * touch and pen alike. A 96px pull commits the dismissal; anything shorter
 * springs back, which stops an accidental nudge from closing a form the user
 * was midway through.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  height = 'auto',
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** `auto` fits its content, `tall` is 85vh, `full` covers the screen (§107). */
  height?: 'auto' | 'tall' | 'full';
}) {
  useLockScroll(open);
  useEscape(open, onClose);
  const sheetRef = useRef<HTMLDivElement>(null);
  useFocusReturn(open, sheetRef);
  const [dragY, setDragY] = useState(0);
  const dragFrom = useRef<number | null>(null);

  if (!open) return null;

  const heights = { auto: 'max-h-[85vh]', tall: 'h-[85vh]', full: 'h-[100dvh]' } as const;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragFrom.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragFrom.current === null) return;
    // Only downward drag is honoured; pulling above the resting point does
    // nothing rather than detaching the sheet from the bottom edge.
    setDragY(Math.max(0, e.clientY - dragFrom.current));
  };
  const onPointerUp = () => {
    if (dragY > 96) onClose();
    dragFrom.current = null;
    setDragY(0);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center" role="presentation">
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        tabIndex={-1}
        className={cn(
          'animate-sheet-up relative z-10 flex w-full flex-col overflow-hidden rounded-t-sheet bg-white shadow-lift outline-none',
          heights[height],
          height === 'auto' && 'max-h-[85vh]',
        )}
        style={dragY ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}
      >
        {/* Drag handle. `touch-action: none` stops the browser scrolling the
            page while the user is dragging the sheet itself. */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="flex shrink-0 cursor-grab touch-none justify-center pb-1 pt-3 active:cursor-grabbing"
        >
          <span className="h-1.5 w-10 rounded-full bg-slate-300" aria-hidden />
          <span className="sr-only">Drag down to close</span>
        </div>

        {(title || description) && (
          <div className="shrink-0 px-5 pb-3 pt-1">
            {title ? <h2 className="text-section-title font-bold text-slate-900">{title}</h2> : null}
            {description ? <p className="mt-1 text-caption-fluid text-slate-500">{description}</p> : null}
          </div>
        )}

        <div className="sidebar-scroll flex-1 overflow-y-auto overscroll-contain px-5 pb-2">{children}</div>

        {footer ? (
          /* Sticky actions sit above the home indicator (spec §06) and stack
             full-width, which is how a thumb actually reaches them. */
          <div className="safe-bottom shrink-0 border-t border-slate-100 bg-white px-5 py-4">
            <div className="flex flex-col-reverse gap-2 xs:flex-row xs:justify-end">{footer}</div>
          </div>
        ) : (
          <div className="safe-bottom shrink-0" />
        )}
      </div>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  hideClose,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hideClose?: boolean;
}) {
  useLockScroll(open);
  useEscape(open, onClose);
  if (!open) return null;
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' } as const;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4" role="presentation">
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'animate-slide-up relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-lift sm:rounded-2xl',
          widths[size]
        )}
      >
        {(title || !hideClose) && (
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
            <div className="min-w-0">
              {title ? <h2 className="text-base font-semibold text-slate-900">{title}</h2> : null}
              {description ? <p className="mt-0.5 text-sm text-slate-500">{description}</p> : null}
            </div>
            {!hideClose ? (
              <button type="button" onClick={onClose} aria-label="Close dialog" className="focus-ring rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X className="h-5 w-5" aria-hidden />
              </button>
            ) : null}
          </div>
        )}
        <div className="sidebar-scroll flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">{footer}</div> : null}
      </div>
    </div>
  );
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  side = 'right',
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  side?: 'right' | 'left';
}) {
  useLockScroll(open);
  useEscape(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80]" role="presentation">
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <aside
        role="dialog"
        aria-modal="true"
        className={cn(
          'absolute inset-y-0 flex w-full max-w-md flex-col bg-white shadow-lift',
          side === 'right' ? 'right-0 animate-fade-in' : 'left-0 animate-fade-in'
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close panel" className="focus-ring rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="sidebar-scroll flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? <div className="border-t border-slate-100 px-5 py-4">{footer}</div> : null}
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Toast                                                               */
/* ------------------------------------------------------------------ */

type ToastTone = 'success' | 'error' | 'info' | 'warning';
interface ToastItem {
  id: number;
  tone: ToastTone;
  title: string;
  message?: string;
}

interface ToastContextValue {
  push: (tone: ToastTone, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastIcons: Record<ToastTone, ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden />,
  error: <XCircle className="h-5 w-5 text-rose-500" aria-hidden />,
  info: <Info className="h-5 w-5 text-sky-500" aria-hidden />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden />,
};

let toastSeq = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<number[]>([]);

  const push = useCallback((tone: ToastTone, title: string, message?: string) => {
    toastSeq += 1;
    const id = toastSeq;
    setItems((prev) => [...prev, { id, tone, title, message }]);
    const handle = window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
    timers.current.push(handle);
  }, []);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const value = useMemo<ToastContextValue>(
    () => ({
      push,
      success: (title, message) => push('success', title, message),
      error: (title, message) => push('error', title, message),
      info: (title, message) => push('info', title, message),
      warning: (title, message) => push('warning', title, message),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[95] flex flex-col items-center gap-2 p-4 sm:items-end">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className="animate-slide-up pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-lift"
          >
            <span className="mt-0.5">{toastIcons[t.tone]}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">{t.title}</p>
              {t.message ? <p className="mt-0.5 text-xs text-slate-500">{t.message}</p> : null}
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
              className="focus-ring rounded-md p-1 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Stepper / Progress / Segmented control                              */
/* ------------------------------------------------------------------ */

export function Stepper({ steps, current }: { steps: { label: string; hint?: string }[]; current: number }) {
  return (
    <ol className="no-scrollbar flex items-center gap-2 overflow-x-auto">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step.label} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  done ? 'bg-emerald-500 text-white' : active ? 'bg-navy text-white' : 'bg-slate-100 text-slate-500'
                )}
              >
                {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className={cn('block truncate text-xs font-semibold', active ? 'text-slate-900' : 'text-slate-500')}>{step.label}</span>
                {step.hint ? <span className="block truncate text-[11px] text-slate-400">{step.hint}</span> : null}
              </span>
            </div>
            {i < steps.length - 1 ? <span className={cn('h-0.5 flex-1 rounded-full', done ? 'bg-emerald-500' : 'bg-slate-200')} /> : null}
          </li>
        );
      })}
    </ol>
  );
}

export function ProgressBar({ value, max = 100, tone = '#10B981', className, label }: { value: number; max?: number; tone?: string; className?: string; label?: string }) {
  const pct = max === 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-100', className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${pct}%`, backgroundColor: tone }} />
    </div>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  className,
}: {
  options: { value: T; label: string; icon?: ReactNode; count?: number }[];
  value: T;
  onChange: (next: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}) {
  return (
    <div role="tablist" className={cn('no-scrollbar inline-flex items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1', className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'focus-ring inline-flex shrink-0 items-center gap-1.5 rounded-lg font-semibold transition-colors',
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
              active ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {o.icon}
            {o.label}
            {typeof o.count === 'number' ? (
              <span className={cn('rounded-full px-1.5 text-[10px] font-bold', active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600')}>{o.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Skeletons & empty / error / success states                          */
/* ------------------------------------------------------------------ */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-lg bg-slate-100', className)} aria-hidden>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent motion-safe:animate-[shimmer_1.6s_infinite]" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card-base space-y-4 p-5">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 px-6 py-12 text-center', className)}>
      {icon ? <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">{icon}</div> : null}
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {description ? <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', description, onRetry }: { title?: string; description?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/60 px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <AlertTriangle className="h-6 w-6" aria-hidden />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-rose-900">{title}</h3>
        {description ? <p className="mx-auto mt-1 max-w-md text-sm text-rose-700/80">{description}</p> : null}
      </div>
      {onRetry ? (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function SuccessState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 className="h-8 w-8" aria-hidden />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {description ? <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Avatar                                                              */
/* ------------------------------------------------------------------ */

export function Avatar({
  name,
  size = 'md',
  color = '#10B981',
  className,
}: {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}) {
  const sizes = {
    xs: 'h-7 w-7 text-[10px]',
    sm: 'h-9 w-9 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-2xl',
  } as const;
  const letters = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white', sizes[size], className)}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {letters}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Alerts & notices                                                    */
/* ------------------------------------------------------------------ */

export function Alert({
  tone = 'info',
  title,
  children,
  icon,
  className,
}: {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  title?: ReactNode;
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  const tones = {
    info: 'border-sky-200 bg-sky-50 text-sky-900',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    danger: 'border-rose-200 bg-rose-50 text-rose-900',
  } as const;
  const defaults = {
    info: <Info className="h-5 w-5 text-sky-500" aria-hidden />,
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden />,
    danger: <XCircle className="h-5 w-5 text-rose-500" aria-hidden />,
  } as const;
  return (
    <div className={cn('flex items-start gap-3 rounded-xl border p-3.5', tones[tone], className)} role="status">
      <span className="mt-0.5 shrink-0">{icon ?? defaults[tone]}</span>
      <div className="min-w-0 text-sm">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className={cn(title && 'mt-0.5')}>{children}</div> : null}
      </div>
    </div>
  );
}

/** Clearly marks simulated / non-connected surfaces. */
export function DemoBanner({
  label = 'Demo Data',
  text,
  className,
}: {
  label?: string;
  text?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-amber-900', className)}>
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
      <p className="text-xs leading-relaxed">
        <span className="mr-1 font-bold uppercase tracking-wide">{label}</span>
        {text ?? 'This prototype uses synthetic data. Values and provider connections are illustrative only and no real money moves.'}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Layout helpers                                                      */
/* ------------------------------------------------------------------ */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">{eyebrow}</p> : null}
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-sm text-slate-500">{description}</p> : null}
        {children}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function SectionTitle({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {description ? <p className="mt-0.5 text-sm text-slate-500">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon,
  tone = '#10B981',
  footer,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  delta?: number;
  icon?: ReactNode;
  tone?: string;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('card-base p-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        {icon ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${tone}1a`, color: tone }}>
            {icon}
          </span>
        ) : null}
      </div>
      <p className="tnum mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {typeof delta === 'number' ? (
        <p className={cn('mt-1 text-xs font-semibold', delta >= 0 ? 'text-emerald-600' : 'text-rose-600')}>
          {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
        </p>
      ) : null}
      {footer ? <div className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">{footer}</div> : null}
    </div>
  );
}

export function KeyValue({
  items,
  className,
  columns = 2,
}: {
  items: { label: ReactNode; value: ReactNode; mono?: boolean }[];
  className?: string;
  columns?: 1 | 2 | 3;
}) {
  const grid = { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3' } as const;
  return (
    <dl className={cn('grid grid-cols-1 gap-x-6 gap-y-4', grid[columns], className)}>
      {items.map((item, i) => (
        <div key={i} className="min-w-0">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.label}</dt>
          <dd className={cn('mt-1 truncate text-sm font-semibold text-slate-900', item.mono && 'tnum font-mono text-[13px]')}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function InfoRow({
  icon,
  title,
  subtitle,
  value,
  action,
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  value?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-3 py-3', className)}>
      {icon ? <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">{icon}</span> : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
        {subtitle ? <p className="truncate text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      {value ? <div className="shrink-0 text-right text-sm font-semibold text-slate-900">{value}</div> : null}
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Accordion & timeline                                                */
/* ------------------------------------------------------------------ */

export function Accordion({ items, className }: { items: { title: ReactNode; body: ReactNode }[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className={cn('divide-y divide-slate-100', className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="focus-ring flex w-full items-center justify-between gap-4 py-3.5 text-left"
            >
              <span className="text-sm font-semibold text-slate-900">{item.title}</span>
              <span className={cn('text-slate-400 transition-transform', isOpen && 'rotate-180')} aria-hidden>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
            {isOpen ? <div className="pb-4 text-sm leading-relaxed text-slate-600">{item.body}</div> : null}
          </div>
        );
      })}
    </div>
  );
}

export function Timeline({
  items,
  className,
}: {
  items: { title: ReactNode; time?: ReactNode; detail?: ReactNode; tone?: string; active?: boolean }[];
  className?: string;
}) {
  return (
    <ol className={cn('relative space-y-4 pl-6', className)}>
      <span className="absolute left-[7px] top-1 h-[calc(100%-0.5rem)] w-px bg-slate-200" aria-hidden />
      {items.map((item, i) => (
        <li key={i} className="relative">
          <span
            className={cn('absolute -left-6 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-white')}
            style={{ backgroundColor: item.tone ?? '#10B981' }}
            aria-hidden
          />
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <p className={cn('text-sm font-semibold', item.active ? 'text-emerald-700' : 'text-slate-900')}>{item.title}</p>
            {item.time ? <p className="text-xs text-slate-400">{item.time}</p> : null}
          </div>
          {item.detail ? <p className="mt-0.5 text-xs text-slate-500">{item.detail}</p> : null}
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Table & pagination                                                  */
/* ------------------------------------------------------------------ */

export function TableWrap({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('sidebar-scroll -mx-px overflow-x-auto', className)}>
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className, align = 'left' }: { children?: ReactNode; className?: string; align?: 'left' | 'right' | 'center' }) {
  return (
    <th
      scope="col"
      className={cn(
        'sticky top-0 z-10 whitespace-nowrap border-b border-slate-100 bg-slate-50/80 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 backdrop-blur',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className, align = 'left' }: { children?: ReactNode; className?: string; align?: 'left' | 'right' | 'center' }) {
  return (
    <td
      className={cn(
        'border-b border-slate-100 px-4 py-3 align-middle text-slate-700',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className
      )}
    >
      {children}
    </td>
  );
}

export function Tr({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr
      className={cn('transition-colors', onClick && 'cursor-pointer hover:bg-slate-50', className)}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' ? onClick() : undefined) : undefined}
    >
      {children}
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/* Responsive table → cards (spec §116)                                */
/* ------------------------------------------------------------------ */

export type TableColumn<T> = {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
  /** Extra classes for the desktop `<td>` — e.g. `whitespace-nowrap text-xs`. */
  cellClassName?: string;
  /** Drop this column from the desktop table below the given breakpoint. */
  desktopHidden?: 'md' | 'lg';
  /**
   * How this column is presented in the mobile card:
   *  - `primary` — the card headline (the first one wins)
   *  - `value`   — trailing value, sitting opposite the headline
   *  - `meta`    — a labelled row inside the card body
   *  - `hidden`  — desktop only, for genuinely decorative columns
   */
  mobile?: 'primary' | 'value' | 'meta' | 'hidden';
};

/**
 * One definition, two presentations (spec §116).
 *
 * A table is the right control on a large screen and the wrong one on a phone:
 * seven columns cannot fit in 360px, and the usual fix — `hidden md:table-cell`
 * — quietly deletes information from the mobile experience. Instead this
 * renders a real `<table>` from `md` up and the same rows as stacked cards
 * below it, so nothing is withheld and nothing has to be scrolled sideways.
 *
 * Cards label every value, because a bare "12 Mar 2026" floating under a
 * headline means nothing without its column header to explain it.
 */
export function ResponsiveTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  mobileLabel,
}: {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  /** Accessible name for the list on mobile, e.g. "Transactions". */
  mobileLabel?: string;
}) {
  const primary = columns.find((c) => c.mobile === 'primary');
  const value = columns.find((c) => c.mobile === 'value');
  const meta = columns.filter((c) => c.mobile === 'meta');

  const desktopOnly = (c: TableColumn<T>) =>
    cn(c.desktopHidden === 'md' && 'hidden md:table-cell', c.desktopHidden === 'lg' && 'hidden lg:table-cell');

  return (
    <>
      <div className="hidden md:block">
        <TableWrap>
          <thead>
            <tr>
              {columns.map((c) => (
                <Th key={c.key} align={c.align} className={desktopOnly(c)}>
                  {c.header}
                </Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <Tr key={rowKey(row)} onClick={onRowClick ? () => onRowClick(row) : undefined}>
                {columns.map((c) => (
                  <Td key={c.key} align={c.align} className={cn(c.cellClassName, desktopOnly(c))}>
                    {c.cell(row)}
                  </Td>
                ))}
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </div>

      <ul className="divide-y divide-slate-100 md:hidden" aria-label={mobileLabel}>
        {rows.map((row) => (
          <li key={rowKey(row)}>
            {/* Mirrors `Tr`: focusable and Enter/Space activatable only when the
                row actually does something. Space is handled too — `Tr` does not,
                which leaves keyboard users unable to activate a row. */}
            <div
              role={onRowClick ? 'button' : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onKeyDown={
                onRowClick
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onRowClick(row);
                      }
                    }
                  : undefined
              }
              className={cn(
                'focus-ring flex min-h-[3.5rem] flex-col gap-2 px-4 py-3.5',
                onRowClick && 'cursor-pointer active:bg-slate-50',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">{primary ? primary.cell(row) : null}</div>
                {value ? <div className="shrink-0 text-right">{value.cell(row)}</div> : null}
              </div>

              {meta.length > 0 && (
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                  {meta.map((c) => (
                    <Fragment key={c.key}>
                      {/* Label from the desktop header, so the two presentations
                          can never drift apart. */}
                      <dt className="text-caption-fluid text-slate-500">{c.header}</dt>
                      <dd className="text-caption-fluid text-right text-slate-700">{c.cell(row)}</dd>
                    </Fragment>
                  ))}
                </dl>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function Pagination({
  page,
  pageCount,
  onPage,
  className,
}: {
  page: number;
  pageCount: number;
  onPage: (next: number) => void;
  className?: string;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav className={cn('flex items-center justify-between gap-3', className)} aria-label="Pagination">
      <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Previous
      </Button>
      <span className="text-xs text-slate-500">
        Page <span className="font-semibold text-slate-700">{page}</span> of {pageCount}
      </span>
      <Button size="sm" variant="outline" disabled={page >= pageCount} onClick={() => onPage(page + 1)}>
        Next
      </Button>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Copy field & OTP                                                    */
/* ------------------------------------------------------------------ */

export function CopyField({ label, value, hint }: { label?: ReactNode; value: string; hint?: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard?.writeText(value).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-2">
        <code className="tnum min-w-0 flex-1 truncate rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 font-mono text-[13px] text-slate-700">{value}</code>
        <Button size="sm" variant="outline" onClick={copy} aria-label="Copy value">
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </Field>
  );
}

export function OtpInput({ length = 6, value, onChange }: { length?: number; value: string; onChange: (next: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(length, ' ').slice(0, length).split('');

  const setAt = (index: number, char: string) => {
    const next = digits.map((d, i) => (i === index ? char : d)).join('').replace(/\s/g, '');
    onChange(next.slice(0, length));
  };

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          value={digits[i]?.trim() ?? ''}
          onChange={(e) => {
            const char = e.target.value.replace(/\D/g, '').slice(-1);
            setAt(i, char);
            if (char && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !digits[i]?.trim() && i > 0) refs.current[i - 1]?.focus();
          }}
          className="focus-ring h-12 w-11 rounded-xl border border-slate-300 bg-white text-center text-lg font-bold text-slate-900"
        />
      ))}
    </div>
  );
}

/** Quick-amount chips used by transfer / top-up flows. */
export function AmountChips({
  amounts,
  onPick,
  currency = '$',
  className,
}: {
  amounts: number[];
  onPick: (value: number) => void;
  currency?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {amounts.map((a) => (
        <button
          key={a}
          type="button"
          onClick={() => onPick(a)}
          className="focus-ring tnum rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
        >
          {currency}
          {a.toLocaleString('en-US')}
        </button>
      ))}
    </div>
  );
}