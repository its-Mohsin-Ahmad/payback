import { useId, useState } from 'react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function buildPath(values: number[], width: number, height: number, pad = 2) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const stepX = values.length > 1 ? width / (values.length - 1) : width;
  return values.map((v, i) => {
    const x = i * stepX;
    const y = pad + (height - pad * 2) * (1 - (v - min) / span);
    return { x, y };
  });
}

function smooth(points: { x: number; y: number }[], tension = 0.28) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const dx = (p1.x - p0.x) * tension;
    d += ` C ${p0.x + dx} ${p0.y}, ${p1.x - dx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

/* ------------------------------------------------------------------ */
/* Sparkline                                                           */
/* ------------------------------------------------------------------ */

export function Sparkline({
  values,
  tone = '#10B981',
  height = 40,
  className,
  strokeWidth = 2,
}: {
  values: number[];
  tone?: string;
  height?: number;
  className?: string;
  strokeWidth?: number;
}) {
  const width = 120;
  const points = buildPath(values, width, height, 4);
  const line = smooth(points);
  const gid = useId().replace(/:/g, '');
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className={cn('h-10 w-full', className)} aria-hidden>
      <defs>
        <linearGradient id={`spark-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone} stopOpacity="0.28" />
          <stop offset="100%" stopColor={tone} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L ${width} ${height} L 0 ${height} Z`} fill={`url(#spark-${gid})`} />
      <path d={line} fill="none" stroke={tone} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Area chart with hover tooltip                                       */
/* ------------------------------------------------------------------ */

export function AreaChart({
  data,
  tone = '#10B981',
  height = 200,
  valueFormatter = (n: number) => String(n),
  className,
}: {
  data: { label: string; value: number }[];
  tone?: string;
  height?: number;
  valueFormatter?: (n: number) => string;
  className?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const gid = useId().replace(/:/g, '');
  const width = 640;
  const padY = 18;
  const values = data.map((d) => d.value);
  const points = buildPath(values, width, height, padY);
  const line = smooth(points);
  const max = Math.max(...values);
  const min = Math.min(...values);

  return (
    <div className={cn('relative w-full', className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ height }}
        className="w-full"
        role="img"
        aria-label="Balance trend chart"
        onMouseLeave={() => setActive(null)}
      >
        <defs>
          <linearGradient id={`area-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tone} stopOpacity="0.3" />
            <stop offset="100%" stopColor={tone} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={width} y1={height * g} y2={height * g} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 6" />
        ))}
        <path d={`${line} L ${width} ${height} L 0 ${height} Z`} fill={`url(#area-${gid})`} />
        <path d={line} fill="none" stroke={tone} strokeWidth="2.5" strokeLinecap="round" />
        {points.map((p, i) => (
          <g key={i}>
            <rect
              x={(i / Math.max(1, points.length - 1)) * width - width / (points.length * 2)}
              y={0}
              width={width / Math.max(1, points.length)}
              height={height}
              fill="transparent"
              onMouseEnter={() => setActive(i)}
            />
            {active === i ? (
              <>
                <line x1={p.x} x2={p.x} y1={0} y2={height} stroke={tone} strokeWidth="1" strokeDasharray="3 3" />
                <circle cx={p.x} cy={p.y} r="5" fill="#fff" stroke={tone} strokeWidth="3" />
              </>
            ) : null}
          </g>
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-400">
        {data.map((d, i) => (
          <span key={d.label} className={cn(active === i && 'font-bold text-slate-600')}>
            {d.label}
          </span>
        ))}
      </div>
      {active !== null ? (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-navy px-2.5 py-1.5 text-xs font-semibold text-white shadow-lift"
          style={{ left: `${(active / Math.max(1, data.length - 1)) * 100}%`, top: `${(1 - (data[active].value - min) / (max - min || 1)) * (height - 36) + 8}px` }}
        >
          {valueFormatter(data[active].value)}
          <span className="ml-1.5 font-normal text-white/60">{data[active].label}</span>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Grouped bar chart (income vs spending / inflow vs outflow)          */
/* ------------------------------------------------------------------ */

export function GroupedBarChart({
  data,
  series,
  height = 200,
  valueFormatter = (n: number) => String(n),
  className,
}: {
  data: { label: string; [key: string]: number | string }[];
  series: { key: string; label: string; tone: string }[];
  height?: number;
  valueFormatter?: (n: number) => string;
  className?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...data.flatMap((d) => series.map((s) => Number(d[s.key]) || 0))) || 1;

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center gap-4 pb-3">
        {series.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.tone }} />
            {s.label}
          </span>
        ))}
      </div>
      <div className="flex items-end gap-2 sm:gap-4" style={{ height }}>
        {data.map((d, i) => (
          <div
            key={d.label}
            className="group relative flex flex-1 flex-col items-center justify-end gap-1"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <div className="flex h-full w-full items-end justify-center gap-1">
              {series.map((s) => {
                const v = Number(d[s.key]) || 0;
                const pct = (v / max) * 100;
                return (
                  <div
                    key={s.key}
                    className="w-full max-w-[22px] rounded-t-md transition-all duration-500"
                    style={{ height: `${Math.max(pct, 2)}%`, backgroundColor: s.tone, opacity: active === null || active === i ? 1 : 0.45 }}
                    title={`${s.label}: ${valueFormatter(v)}`}
                  />
                );
              })}
            </div>
            <span className="shrink-0 text-[11px] font-medium text-slate-400">{d.label}</span>
            {active === i ? (
              <div className="pointer-events-none absolute -top-2 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-navy px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-lift">
                {series.map((s) => (
                  <span key={s.key} className="mr-2 last:mr-0">
                    {s.label}: <span className="font-bold">{valueFormatter(Number(d[s.key]) || 0)}</span>
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Donut chart                                                         */
/* ------------------------------------------------------------------ */

export function DonutChart({
  data,
  size = 200,
  thickness = 26,
  centerLabel,
  centerValue,
  className,
}: {
  data: { label: string; value: number; pct?: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
  className?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let offset = 0;

  return (
    <div className={cn('flex flex-col items-center gap-5 sm:flex-row', className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} role="img" aria-label="Breakdown by category">
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            {data.map((d, i) => {
              const fraction = d.value / total;
              const dash = fraction * circumference;
              const el = (
                <circle
                  key={d.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={d.color}
                  strokeWidth={active === i ? thickness + 5 : thickness}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                  className="transition-all duration-300"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  opacity={active === null || active === i ? 1 : 0.45}
                />
              );
              offset += dash;
              return el;
            })}
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="max-w-[70%] text-[11px] font-medium uppercase tracking-wide text-slate-400">
            {active !== null ? data[active].label : centerLabel}
          </span>
          <span className="tnum mt-0.5 text-lg font-bold text-slate-900">
            {active !== null ? `${Math.round((data[active].value / total) * 100)}%` : centerValue}
          </span>
        </div>
      </div>
      <ul className="w-full space-y-2.5">
        {data.map((d, i) => (
          <li
            key={d.label}
            className={cn('flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors', active === i && 'bg-slate-50')}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="min-w-0 flex-1 truncate text-sm text-slate-600">{d.label}</span>
            <span className="tnum shrink-0 text-sm font-semibold text-slate-900">{d.pct ?? Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Line chart (rates / prices) with axes                               */
/* ------------------------------------------------------------------ */

export function LineChart({
  data,
  tone = '#0EA5E9',
  height = 180,
  yFormatter = (n: number) => String(n),
  showYAxis = true,
  className,
}: {
  data: { label: string; value: number }[];
  tone?: string;
  height?: number;
  yFormatter?: (n: number) => string;
  showYAxis?: boolean;
  className?: string;
}) {
  const gid = useId().replace(/:/g, '');
  const width = 560;
  const axisW = showYAxis ? 46 : 0;
  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const spread = max - min || 1;
  const points = buildPath(values, width - axisW, height - 26, 10).map((p) => ({ x: p.x + axisW, y: p.y + 4 }));
  const line = smooth(points);
  const ticks = [max, min + spread / 2, min];

  return (
    <div className={cn('w-full', className)}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ height }} className="w-full" role="img" aria-label="Rate history chart">
        <defs>
          <linearGradient id={`line-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tone} stopOpacity="0.22" />
            <stop offset="100%" stopColor={tone} stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t, i) => {
          const y = 10 + ((height - 36) * i) / 2;
          return (
            <g key={i}>
              <line x1={axisW} x2={width} y1={y} y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 6" />
              {showYAxis ? (
                <text x={axisW - 8} y={y + 4} textAnchor="end" className="fill-slate-400" style={{ fontSize: 10, fontWeight: 600 }}>
                  {yFormatter(t)}
                </text>
              ) : null}
            </g>
          );
        })}
        <path d={`${line} L ${width} ${height - 26} L ${axisW} ${height - 26} Z`} fill={`url(#line-${gid})`} />
        <path d={line} fill="none" stroke={tone} strokeWidth="2.5" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#fff" stroke={tone} strokeWidth="2" />
        ))}
      </svg>
      <div className={cn('mt-1 flex justify-between text-[11px] font-medium text-slate-400', showYAxis && 'pl-[46px]')}>
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Progress ring + mini bars                                           */
/* ------------------------------------------------------------------ */

export function ProgressRing({
  value,
  max = 100,
  size = 120,
  thickness = 10,
  tone = '#10B981',
  label,
  sublabel,
}: {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  tone?: string;
  label?: string;
  sublabel?: string;
}) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = max === 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F1F5F9" strokeWidth={thickness} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={tone}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * circumference} ${circumference}`}
            className="transition-[stroke-dasharray] duration-700"
          />
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tnum text-xl font-bold text-slate-900">{label ?? `${Math.round(pct)}%`}</span>
        {sublabel ? <span className="text-[11px] font-medium text-slate-400">{sublabel}</span> : null}
      </div>
    </div>
  );
}

export function MiniBars({ values, tone = '#38BDF8', height = 44 }: { values: number[]; tone?: string; height?: number }) {
  const max = Math.max(...values) || 1;
  return (
    <div className="flex items-end gap-1" style={{ height }} aria-hidden>
      {values.map((v, i) => (
        <span
          key={i}
          className="w-1.5 rounded-full transition-all duration-500"
          style={{ height: `${Math.max((v / max) * 100, 8)}%`, backgroundColor: tone, opacity: 0.45 + (i / values.length) * 0.55 }}
        />
      ))}
    </div>
  );
}
