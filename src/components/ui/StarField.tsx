import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StarFieldConfig {
  /** Number of stars. Default: 18 */
  count?: number;
  /** Min star diameter in px. Default: 1 */
  minSize?: number;
  /** Max star diameter in px. Default: 2.5 */
  maxSize?: number;
  /** Min opacity 0–1. Default: 0.35 */
  minOpacity?: number;
  /** Max opacity 0–1. Default: 0.74 */
  maxOpacity?: number;
  /** Slowest rise duration in seconds. Default: 8 */
  minDuration?: number;
  /** Fastest rise duration in seconds. Default: 18 */
  maxDuration?: number;
  /** Star color. Default: "#ffffff" */
  color?: string;
}

interface StarFieldProps extends StarFieldConfig {
  children: ReactNode;
  /** Extra className applied to the outer wrapper (e.g. "min-h-screen bg-black") */
  className?: string;
}

// ─── Deterministic star generator ────────────────────────────────────────────
// Uses a simple LCG so the same stars render on server and client (no hydration mismatch).

interface StarData {
  id: number;
  x: number; // % from left
  startBottom: number; // % from bottom
  size: number; // px
  opacity: number;
  duration: number; // seconds
  delay: number; // seconds (negative = already mid-flight)
}

function lcg(seed: number) {
  // Park-Miller LCG — returns next seed and a 0..1 float
  const next = (seed * 1664525 + 1013904223) & 0xffffffff;
  return { next, value: (next >>> 0) / 0xffffffff };
}

function generateStars(cfg: Required<StarFieldConfig>): StarData[] {
  let seed = 0xdeadbeef;
  const stars: StarData[] = [];

  for (let i = 0; i < cfg.count; i++) {
    let v: number;

    ({ next: seed, value: v } = lcg(seed));
    const x = v * 96 + 1; // 1–97%

    ({ next: seed, value: v } = lcg(seed));
    const startBottom = v * 95; // 0–95%

    ({ next: seed, value: v } = lcg(seed));
    const size = cfg.minSize + v * (cfg.maxSize - cfg.minSize);

    ({ next: seed, value: v } = lcg(seed));
    const opacity = cfg.minOpacity + v * (cfg.maxOpacity - cfg.minOpacity);

    ({ next: seed, value: v } = lcg(seed));
    const duration = cfg.minDuration + v * (cfg.maxDuration - cfg.minDuration);

    ({ next: seed, value: v } = lcg(seed));
    const delay = -(v * cfg.maxDuration); // negative = already mid-flight

    stars.push({ id: i, x, startBottom, size, opacity, duration, delay });
  }

  return stars;
}

// ─── Component ────────────────────────────────────────────────────────────────

const KEYFRAMES = `
@keyframes __starFieldRise {
    0%   { transform: translateY(0);      opacity: var(--star-op); }
    80%  { opacity: var(--star-op); }
    100% { transform: translateY(-110vh); opacity: 0; }
}
`;

/**
 * StarField
 *
 * Drop-in wrapper that layers a rising-stars animation behind any content.
 *
 * @example
 * // Basic usage
 * <StarField className="min-h-screen bg-black">
 *   <MyComponent />
 * </StarField>
 *
 * @example
 * // Custom density & colour
 * <StarField count={30} color="#a0c4ff" minDuration={6} maxDuration={14}>
 *   <MyComponent />
 * </StarField>
 */
export default function StarField({
  children,
  className = "",
  count = 36,
  minSize = 2,
  maxSize = 4.5,
  minOpacity = 0.35,
  maxOpacity = 0.74,
  minDuration = 4,
  maxDuration = 18,
  color = "#ffffff",
}: StarFieldProps) {
  const stars = generateStars({
    count,
    minSize,
    maxSize,
    minOpacity,
    maxOpacity,
    minDuration,
    maxDuration,
    color,
  });

  return (
    <>
      <style>{KEYFRAMES}</style>

      <div className={`relative ${className}`} style={{ isolation: "isolate" }}>
        {/* clipped stars only */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {stars.map((s) => (
            <span
              key={s.id}
              aria-hidden="true"
              style={{
                position: "absolute",
                left: `${s.x}%`,
                bottom: `${s.startBottom}%`,
                width: s.size,
                height: s.size,
                borderRadius: "50%",
                backgroundColor: color,
                pointerEvents: "none",
                opacity: s.opacity,
                ["--star-op" as string]: s.opacity,
                animation: `__starFieldRise ${s.duration.toFixed(2)}s ${s.delay.toFixed(2)}s linear infinite`,
              }}
            />
          ))}
        </div>

        {/* sticky content must NOT be inside overflow-hidden */}
        <div className="relative z-10">{children}</div>
      </div>
    </>
  );
}
