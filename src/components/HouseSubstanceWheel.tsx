/**
 * HouseSubstanceWheel
 *
 * SVG wheel showing all 12 astrological houses in their natural positions.
 * Houses 1-6 = Inner World Experience (bottom half)
 * Houses 7-12 = Outer World Experience (top half)
 * Color-coded by alchemical substance: Sulphur (amber), Salt (emerald), Mercurius (indigo)
 *
 * Astrological convention: House 1 (Ascendant) on the LEFT horizon.
 * Houses run counter-clockwise from left horizon.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { houses, signs } from '../data';
import { d3SubstanceColors } from '../styles/colors';
import type { House } from '../types';

// ─── Substance color mapping ───────────────────────────────────────────────

const SUBSTANCE_COLORS = d3SubstanceColors;

// ─── House → substance polarity (via ruling sign) ─────────────────────────

// House 1→Aries(yang), 2→Taurus(yang), 3→Gemini(yang), 4→Cancer(yang)
// House 5→Leo(bridge), 6→Virgo(bridge), 7→Libra(bridge), 8→Scorpio(bridge)
// House 9→Sag(yin), 10→Cap(yin), 11→Aquarius(yin), 12→Pisces(yin)
const HOUSE_POLARITY: Record<number, 'yang' | 'bridge' | 'yin'> = {
  1: 'yang', 2: 'yang', 3: 'yang', 4: 'yang',
  5: 'bridge', 6: 'bridge', 7: 'bridge', 8: 'bridge',
  9: 'yin', 10: 'yin', 11: 'yin', 12: 'yin',
};

// ─── SVG math helpers ─────────────────────────────────────────────────────

function polarToXY(angleDeg: number, r: number, cx: number, cy: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function wedgePath(
  startAngle: number,
  endAngle: number,
  innerR: number,
  outerR: number,
  cx: number,
  cy: number,
): string {
  const s1 = polarToXY(startAngle, outerR, cx, cy);
  const e1 = polarToXY(endAngle, outerR, cx, cy);
  const s2 = polarToXY(endAngle, innerR, cx, cy);
  const e2 = polarToXY(startAngle, innerR, cx, cy);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${e2.x} ${e2.y}`,
    'Z',
  ].join(' ');
}

// ─── Types ────────────────────────────────────────────────────────────────

interface HouseSubstanceWheelProps {
  activeHouseId?: string;
  size?: number;
  onHouseClick?: (houseId: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────

export function HouseSubstanceWheel({
  activeHouseId,
  size = 480,
  onHouseClick,
}: HouseSubstanceWheelProps) {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.46;
  const innerR = size * 0.22;
  const labelR = size * 0.35;   // ring for house number + sign
  const keywordR = size * 0.43; // ring for keyword text

  void labelR;
  void keywordR;

  const sortedHouses = Array.from(houses.values()).sort(
    (a, b) => a.houseNumber - b.houseNumber,
  );

  // Astrological convention:
  // House 1 starts at 180° (left horizon), goes counter-clockwise (negative angle step).
  // In SVG coords (y-axis inverted), counter-clockwise = positive angle step clockwise.
  // We place house N starting at: 180 - (N-1)*30 degrees, going to 180 - N*30 degrees.
  // Actually: in SVG, 0° = right, angles increase clockwise.
  // Astrological: House 1 Ascendant = left (180° in SVG), houses go counter-clockwise.
  // Counter-clockwise in SVG = decreasing angle.
  // So House 1: start=180°, end=150° (going CW in SVG terms but looks CCW in astro).
  // Let's use: houseStartAngle(n) = 180 - (n-1)*30  (decreasing, CCW in astro view)
  //            houseEndAngle(n)   = 180 - n*30

  const houseStartAngle = (n: number) => 180 - (n - 1) * 30;
  const houseEndAngle = (n: number) => 180 - n * 30;
  const houseMidAngle = (n: number) => 180 - (n - 0.5) * 30;

  const handleClick = (house: House) => {
    if (onHouseClick) {
      onHouseClick(house.id);
    } else {
      navigate(`/houses/${house.id}`);
    }
  };

  // Arc label path helpers for "Inner World Experience" and "Outer World Experience"
  // Inner World = bottom arc (Houses 1-6, angles 180° to -30° = 180° to 330°)
  // Outer World = top arc (Houses 7-12, angles 0° to 150° going CCW = 0° to 150° CW area)
  const arcLabelR = outerR + size * 0.045;

  // Inner arc: from House 6 end (180 - 6*30 = 0°) to House 1 start (180°), going through bottom
  const innerArcId = 'inner-arc-label';
  const outerArcId = 'outer-arc-label';

  return (
    <div className="relative inline-flex flex-col items-center" style={{ width: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        role="img"
        aria-label="House Substance Wheel — 12 astrological houses"
      >
        <defs>
          {/* Inner world arc path (Houses 1-6, bottom half) */}
          <path
            id={innerArcId}
            d={`M ${polarToXY(180, arcLabelR, cx, cy).x} ${polarToXY(180, arcLabelR, cx, cy).y} A ${arcLabelR} ${arcLabelR} 0 0 1 ${polarToXY(0, arcLabelR, cx, cy).x} ${polarToXY(0, arcLabelR, cx, cy).y}`}
          />
          {/* Outer world arc path (Houses 7-12, top half) */}
          <path
            id={outerArcId}
            d={`M ${polarToXY(180, arcLabelR, cx, cy).x} ${polarToXY(180, arcLabelR, cx, cy).y} A ${arcLabelR} ${arcLabelR} 0 0 0 ${polarToXY(0, arcLabelR, cx, cy).x} ${polarToXY(0, arcLabelR, cx, cy).y}`}
          />
        </defs>

        {/* ── Curved arc labels ── */}
        <text fontSize={size * 0.022} fill="rgba(255,255,255,0.25)" letterSpacing="1.5">
          <textPath href={`#${innerArcId}`} startOffset="20%">
            INNER WORLD EXPERIENCE
          </textPath>
        </text>
        <text fontSize={size * 0.022} fill="rgba(255,255,255,0.25)" letterSpacing="1.5">
          <textPath href={`#${outerArcId}`} startOffset="20%">
            OUTER WORLD EXPERIENCE
          </textPath>
        </text>

        {/* ── House wedges ── */}
        {sortedHouses.map((house) => {
          const n = house.houseNumber;
          const startAngle = houseStartAngle(n);
          const endAngle = houseEndAngle(n);
          const midAngle = houseMidAngle(n);
          const polarity = HOUSE_POLARITY[n] ?? 'yang';
          const colors = SUBSTANCE_COLORS[polarity];
          const isHovered = hoveredId === house.id;
          const isActive = activeHouseId === house.id;
          const highlight = isHovered || isActive;

          // Get ruling sign symbol
          const rulingSign = house.rulingSignId ? signs.get(house.rulingSignId) : null;

          // House number position (inner ring)
          const numPos = polarToXY(midAngle, innerR + (outerR - innerR) * 0.28, cx, cy);
          // Sign symbol position (outer ring)
          const signPos = polarToXY(midAngle, innerR + (outerR - innerR) * 0.62, cx, cy);

          return (
            <g
              key={house.id}
              role="button"
              tabIndex={0}
              aria-label={`House ${n} — ${house.name}`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredId(house.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleClick(house)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleClick(house);
              }}
            >
              {/* Wedge */}
              <path
                d={wedgePath(startAngle, endAngle, innerR, outerR, cx, cy)}
                fill={colors.fill + (highlight ? '35' : '18')}
                stroke={colors.stroke}
                strokeWidth={highlight ? 1.5 : 0.8}
                strokeOpacity={highlight ? 0.9 : 0.4}
                style={{ transition: 'fill 0.2s ease, stroke-opacity 0.2s ease' }}
              />

              {/* House number */}
              <text
                x={numPos.x}
                y={numPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={size * 0.038}
                fontWeight={highlight ? '600' : '400'}
                fill={highlight ? colors.fill : 'rgba(255,255,255,0.6)'}
                style={{ userSelect: 'none', transition: 'fill 0.2s ease' }}
              >
                {n}
              </text>

              {/* Ruling sign symbol */}
              {rulingSign && (
                <text
                  x={signPos.x}
                  y={signPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={size * 0.03}
                  fill={colors.fill}
                  fillOpacity={highlight ? 0.95 : 0.5}
                  style={{ userSelect: 'none', transition: 'fill-opacity 0.2s ease' }}
                >
                  {rulingSign.symbol}
                </text>
              )}
            </g>
          );
        })}

        {/* ── Spoke dividers ── */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = 180 - i * 30;
          const inner = polarToXY(angle, innerR, cx, cy);
          const outer = polarToXY(angle, outerR, cx, cy);
          return (
            <line
              key={i}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={1}
            />
          );
        })}

        {/* ── Center hub ── */}
        <circle cx={cx} cy={cy} r={innerR} fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        <text
          x={cx}
          y={cy - size * 0.03}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.028}
          fill="rgba(255,255,255,0.3)"
          style={{ userSelect: 'none' }}
        >
          ⌂
        </text>
        <text
          x={cx}
          y={cy + size * 0.025}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.02}
          fill="rgba(255,255,255,0.2)"
          style={{ userSelect: 'none' }}
        >
          HOUSES
        </text>

        {/* ── Horizon line ── */}
        <line
          x1={cx - outerR - size * 0.01}
          y1={cy}
          x2={cx + outerR + size * 0.01}
          y2={cy}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
      </svg>

      {/* ── Tooltip (HTML overlay) ── */}
      {hoveredId && (() => {
        const house = houses.get(hoveredId);
        if (!house) return null;
        const n = house.houseNumber;
        const polarity = HOUSE_POLARITY[n] ?? 'yang';
        const colors = SUBSTANCE_COLORS[polarity];
        const rulingSign = house.rulingSignId ? signs.get(house.rulingSignId) : null;
        return (
          <div
            className="absolute z-10 rounded-xl border bg-neutral-950/95 p-3 shadow-2xl pointer-events-none"
            style={{
              borderColor: colors.fill + '40',
              top: size / 2 - 80,
              left: size + 12,
              width: 200,
            }}
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm font-semibold text-white">House {n}</span>
              <span
                className="rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                style={{ backgroundColor: colors.fill + '25', color: colors.fill }}
              >
                {colors.polarity}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mb-1">{house.name.replace('House', '').trim()} {rulingSign && `· ${rulingSign.symbol} ${rulingSign.name}`}</p>
            <p className="text-[10px] text-neutral-500">{house.worldHalfTheme}</p>
            <p className="mt-1.5 text-[10px] font-medium uppercase tracking-widest" style={{ color: colors.fill }}>
              {colors.label} · {n <= 6 ? 'Inner' : 'Outer'} World
            </p>
          </div>
        );
      })()}
    </div>
  );
}

export default HouseSubstanceWheel;
