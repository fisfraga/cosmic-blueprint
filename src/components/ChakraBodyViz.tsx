/**
 * ChakraBodyViz
 *
 * Interactive SVG visualization of the seven chakra energy centers along the spine.
 * Shows each chakra's position, color, name, and the Shadow→Gift→Siddhi spectrum.
 * Clicking any chakra navigates to its detail page.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { chakras } from '../data';
import type { Chakra } from '../types';

// ─── Chakra position map ──────────────────────────────────────────────────────

// Y positions (0–1 scale) for each chakra number along the spine.
// 1 = Root (bottom), 7 = Crown (top). We render top-to-bottom so we invert.
const CHAKRA_Y: Record<number, number> = {
  7: 0.06,  // Crown
  6: 0.19,  // Third Eye
  5: 0.34,  // Throat
  4: 0.49,  // Heart
  3: 0.63,  // Solar Plexus
  2: 0.76,  // Sacral
  1: 0.90,  // Root
};

// SVG canvas dimensions
const W = 320;
const H = 560;
const CX = W / 2; // spine center x

// ─── Tooltip ─────────────────────────────────────────────────────────────────

interface TooltipProps {
  chakra: Chakra;
  y: number;
}

function ChakraTooltip({ chakra, y }: TooltipProps) {
  // Position tooltip to the right on desktop
  const tipY = Math.max(0, Math.min(y * H - 80, H - 200));

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.18 }}
      className="absolute left-full ml-3 z-10 w-52 rounded-xl border bg-surface-base/95 p-4 shadow-2xl"
      style={{
        top: `${tipY}px`,
        borderColor: chakra.colorHex + '40',
      }}
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base"
          style={{ backgroundColor: chakra.colorHex + '30', border: `2px solid ${chakra.colorHex}60` }}
        >
          {chakra.symbol}
        </div>
        <div>
          <p className="text-sm font-semibold text-theme-text-primary">{chakra.name}</p>
          <p className="text-[11px] italic text-theme-text-tertiary">{chakra.sanskritName}</p>
        </div>
      </div>

      {/* Hz frequency */}
      <p className="mb-3 text-[11px] text-theme-text-tertiary">
        {chakra.frequency} Hz · {chakra.element} · Mantra: {chakra.seed_mantra}
      </p>

      {/* Frequency spectrum */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-start gap-2">
          <span className="mt-px h-2 w-2 shrink-0 rounded-full bg-red-500" />
          <div>
            <span className="font-medium text-red-400">{chakra.constricted.name}</span>
            <p className="mt-0.5 text-[10px] leading-relaxed text-theme-text-tertiary line-clamp-2">
              {chakra.constricted.expression}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-px h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
          <div>
            <span className="font-medium text-emerald-400">{chakra.flowing.name}</span>
            <p className="mt-0.5 text-[10px] leading-relaxed text-theme-text-tertiary line-clamp-2">
              {chakra.flowing.expression}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-px h-2 w-2 shrink-0 rounded-full bg-purple-500" />
          <div>
            <span className="font-medium text-purple-400">{chakra.radiant.name}</span>
          </div>
        </div>
      </div>

      {/* Click CTA */}
      <p
        className="mt-3 text-[10px] font-medium uppercase tracking-widest"
        style={{ color: chakra.colorHex }}
      >
        Click to explore →
      </p>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ChakraBodyVizProps {
  /** If provided, this chakra node will glow as "active" (e.g. current detail page) */
  activeChakraId?: string;
  className?: string;
}

export function ChakraBodyViz({ activeChakraId, className = '' }: ChakraBodyVizProps) {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const sorted = Array.from(chakras.values()).sort((a, b) => a.number - b.number);

  // Helper: pixel Y for a chakra number (1-7 on canvas H)
  const cy = (number: number) => (CHAKRA_Y[number] ?? 0.5) * H;

  // Min/max y for spine endpoints
  const spineTop = cy(7) - 2;
  const spineBottom = cy(1) + 2;

  const hoveredChakra = hoveredId ? sorted.find((c) => c.id === hoveredId) ?? null : null;

  return (
    <div className={`relative inline-flex ${className}`} style={{ width: W }}>
      {/* SVG canvas */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        role="img"
        aria-label="Chakra body visualization — seven energy centers along the spine"
      >
        <defs>
          {/* Glow filter per chakra color applied via a single generic filter */}
          <filter id="chakra-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Spine ── */}
        {/* Outer glow */}
        <line
          x1={CX}
          y1={spineTop}
          x2={CX}
          y2={spineBottom}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={10}
        />
        {/* Core line */}
        <line
          x1={CX}
          y1={spineTop}
          x2={CX}
          y2={spineBottom}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={2}
          strokeDasharray="4 4"
        />

        {/* ── Chakra nodes ── */}
        {sorted.map((chakra) => {
          const nodeY = cy(chakra.number);
          const isHovered = hoveredId === chakra.id;
          const isActive = activeChakraId === chakra.id;
          const r = isHovered || isActive ? 20 : 15;

          return (
            <g
              key={chakra.id}
              role="button"
              tabIndex={0}
              aria-label={`${chakra.name} — ${chakra.flowing.name}`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredId(chakra.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => navigate(`/chakras/${chakra.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') navigate(`/chakras/${chakra.id}`);
              }}
            >
              {/* Outer glow ring (hover/active) */}
              {(isHovered || isActive) && (
                <circle
                  cx={CX}
                  cy={nodeY}
                  r={r + 10}
                  fill="none"
                  stroke={chakra.colorHex}
                  strokeWidth={1.5}
                  opacity={0.3}
                  filter="url(#chakra-glow)"
                />
              )}

              {/* Background fill circle */}
              <circle
                cx={CX}
                cy={nodeY}
                r={r}
                fill={chakra.colorHex + '20'}
                stroke={chakra.colorHex}
                strokeWidth={isHovered || isActive ? 2.5 : 1.5}
                strokeOpacity={isHovered || isActive ? 0.9 : 0.5}
                style={{ transition: 'r 0.2s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease' }}
              />

              {/* Symbol */}
              <text
                x={CX}
                y={nodeY + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={isHovered || isActive ? 14 : 12}
                fill={chakra.colorHex}
                fillOpacity={isHovered || isActive ? 1 : 0.7}
                style={{ userSelect: 'none', transition: 'font-size 0.2s ease' }}
              >
                {chakra.number}
              </text>

              {/* Name label — right side */}
              <text
                x={CX + 28}
                y={nodeY - 4}
                fontSize={11}
                fill={isHovered || isActive ? '#fff' : '#a1a1a3'}
                style={{ userSelect: 'none', transition: 'fill 0.2s ease' }}
              >
                {chakra.name.replace(' Chakra', '')}
              </text>

              {/* Sanskrit — right side, smaller */}
              <text
                x={CX + 28}
                y={nodeY + 10}
                fontSize={9}
                fill={chakra.colorHex}
                fillOpacity={isHovered || isActive ? 0.9 : 0.5}
                fontStyle="italic"
                style={{ userSelect: 'none', transition: 'fill-opacity 0.2s ease' }}
              >
                {chakra.sanskritName}
              </text>

              {/* Gift label — left side (only when hovered) */}
              {isHovered && (
                <text
                  x={CX - 28}
                  y={nodeY + 4}
                  textAnchor="end"
                  fontSize={9.5}
                  fill="#34d399"
                  style={{ userSelect: 'none' }}
                >
                  {chakra.flowing.name}
                </text>
              )}

              {/* Connection dot on spine */}
              <circle
                cx={CX}
                cy={nodeY}
                r={2}
                fill={chakra.colorHex}
                opacity={0.6}
              />
            </g>
          );
        })}

        {/* Frequency label at top */}
        <text
          x={CX}
          y={16}
          textAnchor="middle"
          fontSize={9}
          fill="rgba(255,255,255,0.2)"
          style={{ userSelect: 'none' }}
        >
          CROWN
        </text>
        <text
          x={CX}
          y={H - 6}
          textAnchor="middle"
          fontSize={9}
          fill="rgba(255,255,255,0.2)"
          style={{ userSelect: 'none' }}
        >
          ROOT
        </text>
      </svg>

      {/* Floating tooltip (HTML overlay — richer than SVG text) */}
      <AnimatePresence>
        {hoveredChakra && (
          <ChakraTooltip
            key={hoveredChakra.id}
            chakra={hoveredChakra}
            y={CHAKRA_Y[hoveredChakra.number] ?? 0.5}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChakraBodyViz;
