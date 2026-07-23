import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showRing?: boolean;
  showStatus?: boolean;
  className?: string;
  speechBubble?: string;
}

const AVATAR_URL = '/avatar.png';
const FALLBACK_INITIALS = 'PM';

const sizeClasses = {
  sm: 'w-8 h-8 text-[0.7rem]',
  md: 'w-16 h-16 text-[1.1rem]',
  lg: 'w-[120px] h-[120px] text-[1.8rem]',
  xl: 'w-[184px] h-[184px] text-[2.4rem]',
};

const statusSizes = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3.5 h-3.5',
  xl: 'w-4 h-4',
};

/**
 * Perimeter of our chamfer polygon (viewBox 0 0 100 100):
 * points: "15,0 100,0 100,85 85,100 0,100 0,15"
 *
 * Side lengths (Manhattan approximation of the chamfer polygon):
 *   top:          85   (15→100 along y=0)
 *   right:        85   (y=0→85 along x=100)
 *   bottom-cut:   ~21  (100,85 → 85,100)
 *   bottom:       85   (x=85→0 along y=100)
 *   left:         85   (y=100→15 along x=0)
 *   top-cut:      ~21  (0,15 → 15,0)
 * Total ≈ 382
 */
const POLY_PERIMETER = 382;
const DASH_LEN = Math.round(POLY_PERIMETER * 0.14); // ~54 — the travelling bright segment
const GAP_LEN = POLY_PERIMETER - DASH_LEN;

export default function Avatar({
  size = 'md',
  showRing = true,
  showStatus = false,
  className = '',
  speechBubble = '',
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Pixel height for the scanner sweep — driven by the actual size
  const scanHeights: Record<typeof size, number> = { sm: 32, md: 64, lg: 120, xl: 184 };
  const scanHeight = scanHeights[size];

  return (
    <div
      className={twMerge(
        'group relative inline-flex shrink-0 cursor-pointer items-center justify-center',
        className
      )}
      data-cursor-hover
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── SVG HUD Frame ── */}
      {showRing && (
        <div className="absolute inset-[-8px] pointer-events-none z-30">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 overflow-visible"
            style={{ filter: hovered ? 'drop-shadow(0 0 6px rgba(102,192,244,0.55))' : 'none', transition: 'filter 0.4s' }}
          >
            <defs>
              {/* Idle running-light animation — correct stroke-dashoffset approach */}
              <style>{`
                @keyframes hud-trace-idle {
                  from { stroke-dashoffset: ${POLY_PERIMETER}; }
                  to   { stroke-dashoffset: 0; }
                }
                @keyframes hud-trace-hover {
                  from { stroke-dashoffset: ${POLY_PERIMETER}; }
                  to   { stroke-dashoffset: 0; }
                }
              `}</style>
            </defs>

            {/* Static base outline — always faintly visible */}
            <polygon
              points="15,0 100,0 100,85 85,100 0,100 0,15"
              fill="none"
              stroke="#66c0f4"
              strokeWidth="0.4"
              opacity={hovered ? 0.5 : 0.18}
              style={{ transition: 'opacity 0.3s' }}
            />

            {/* Running-light trace — idle: 8s, hover: 1.4s */}
            <polygon
              points="15,0 100,0 100,85 85,100 0,100 0,15"
              fill="none"
              stroke="#66c0f4"
              strokeWidth={hovered ? 1.8 : 1}
              strokeDasharray={`${DASH_LEN} ${GAP_LEN}`}
              strokeDashoffset={POLY_PERIMETER}
              strokeLinecap="butt"
              opacity={hovered ? 1 : 0.6}
              style={{
                animation: `hud-trace-${hovered ? 'hover' : 'idle'} ${hovered ? '1.4s' : '8s'} linear infinite`,
                transition: 'stroke-width 0.3s, opacity 0.3s',
              }}
            />

            {/* Top-left chamfer cross-hair tick — shows on hover */}
            <g opacity={hovered ? 1 : 0} style={{ transition: 'opacity 0.25s 0.1s' }}>
              <line x1="15" y1="-4" x2="15" y2="4" stroke="#66c0f4" strokeWidth="1" />
              <line x1="11" y1="0" x2="19" y2="0" stroke="#66c0f4" strokeWidth="1" />
            </g>

            {/* Bottom-right chamfer cross-hair tick — shows on hover */}
            <g opacity={hovered ? 1 : 0} style={{ transition: 'opacity 0.25s 0.2s' }}>
              <line x1="85" y1="96" x2="85" y2="104" stroke="#66c0f4" strokeWidth="1" />
              <line x1="81" y1="100" x2="89" y2="100" stroke="#66c0f4" strokeWidth="1" />
            </g>

            {/* Corner accent dots at remaining 4 vertices */}
            {[
              { cx: 100, cy: 0 },
              { cx: 100, cy: 85 },
              { cx: 0, cy: 100 },
              { cx: 0, cy: 15 },
            ].map((pt, i) => (
              <circle
                key={i}
                cx={pt.cx}
                cy={pt.cy}
                r="1.5"
                fill="#66c0f4"
                opacity={hovered ? 1 : 0}
                style={{ transition: `opacity 0.2s ${0.05 * i}s` }}
              />
            ))}
          </svg>
        </div>
      )}

      {/* ── Avatar Image Container ── */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className={twMerge(
          'relative z-10 overflow-hidden bg-zinc-950',
          sizeClasses[size]
        )}
        style={{
          clipPath: 'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)',
        }}
      >
        {/* Holographic scanner sweep */}
        <div
          className="absolute left-0 w-full z-20 pointer-events-none"
          style={{
            top: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent 0%, #66c0f4 40%, #a5dcff 50%, #66c0f4 60%, transparent 100%)',
            boxShadow: '0 0 10px 2px rgba(102,192,244,0.5)',
            opacity: hovered ? 1 : 0,
            animation: hovered ? `scan-sweep ${scanHeight}px 1.8s ease-in-out infinite alternate` : 'none',
          }}
        />

        {/* Subtle blue wash on hover */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(102,192,244,0.12) 0%, transparent 70%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.4s',
          }}
        />

        {!imgError ? (
          <img
            src={AVATAR_URL}
            alt="Prithwin M"
            className="block h-full w-full object-cover object-top"
            style={{
              // Desaturated at idle → full colour on hover (the "subject revealed" moment)
              filter: hovered ? 'grayscale(0%) brightness(1.05)' : 'grayscale(40%) brightness(0.9)',
              transition: 'filter 0.45s ease',
            }}
            onError={() => setImgError(true)}
            loading="eager"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-900 border border-white/10">
            <span className="font-mono font-bold tracking-widest text-zinc-500">
              {FALLBACK_INITIALS}
            </span>
          </div>
        )}

        {/* Scanner keyframes */}
        <style>{`
          @keyframes scan-sweep {
            0%   { transform: translateY(0); }
            100% { transform: translateY(${scanHeight}px); }
          }
        `}</style>
      </motion.div>

      {/* ── JJK Domain Expansion Speech Bubble ── */}
      {speechBubble && (
        <div
          className="pointer-events-none absolute bottom-[calc(100%+16px)] left-1/2 z-30 -translate-x-1/2 flex flex-col items-center"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(6px)',
            transition: 'opacity 0.25s, transform 0.3s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div
            className="relative flex flex-col items-center gap-1 px-4 py-2.5 bg-black/95 border backdrop-blur-md"
            style={{
              borderColor: hovered ? 'rgba(102,192,244,0.6)' : 'rgba(102,192,244,0.2)',
              animation: hovered ? 'bubble-border-pulse 1.8s ease-in-out infinite alternate' : 'none',
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full bg-steam-blue"
                style={{ animation: 'pulse 1.2s infinite' }}
              />
              <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-steam-blue uppercase whitespace-nowrap">
                {speechBubble}
              </span>
            </div>
            <span className="font-mono text-[8px] tracking-[0.2em] text-steam-blue/50 uppercase whitespace-nowrap">
              [ Unlimited Void ]
            </span>
            {/* Tail */}
            <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-black/95 border-r border-b border-steam-blue/40" />
          </div>

          <style>{`
            @keyframes bubble-border-pulse {
              from { border-color: rgba(102,192,244,0.35); box-shadow: none; }
              to   { border-color: rgba(102,192,244,0.85); box-shadow: 0 0 12px rgba(102,192,244,0.2); }
            }
          `}</style>
        </div>
      )}

      {/* ── Online status ── */}
      {showStatus && (
        <div className="absolute -bottom-2 right-0 z-30 flex items-center gap-1.5 bg-zinc-950 px-1.5 py-1.5 border border-zinc-800 rounded-full shadow-lg">
          <span
            className={twMerge(
              'block rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
              statusSizes[size]
            )}
          />
        </div>
      )}
    </div>
  );
}
