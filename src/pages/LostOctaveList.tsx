import { Link } from 'react-router-dom';
import { hdGates72, hdGates, signs } from '../data';
import type { HDGate72 } from '../types';

// Zodiac sign order for grouping
const ZODIAC_SIGN_ORDER = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

const ZODIAC_SIGN_LABELS: Record<string, string> = {
  aries: 'Aries',
  taurus: 'Taurus',
  gemini: 'Gemini',
  cancer: 'Cancer',
  leo: 'Leo',
  virgo: 'Virgo',
  libra: 'Libra',
  scorpio: 'Scorpio',
  sagittarius: 'Sagittarius',
  capricorn: 'Capricorn',
  aquarius: 'Aquarius',
  pisces: 'Pisces',
};

/**
 * Determine which primary sign a gate belongs to for grouping purposes.
 * Gates that straddle two signs (e.g. "pisces/aries") are assigned to the
 * sign that contains their start degree.
 */
function getPrimarySign(gate: HDGate72): string {
  // startSign is the IANA sign ID of the degree where the gate begins
  return gate.startSign;
}

/**
 * Derive decan number from segmentNumber (1-36 decans, 2 segments per decan).
 * decanNumber = ceil(segmentNumber / 2)
 */
function deriveDecanNumber(segmentNumber: number): number {
  return Math.ceil(segmentNumber / 2);
}

/**
 * Derive whether a gate is a "master gate" — one per zodiac sign (every 6th segment).
 * Master gates are the last segment in each sign group (index 6 out of 6).
 */
function deriveIsMasterGate(gate: HDGate72, allGatesInSign: HDGate72[]): boolean {
  // isMasterGate field exists on the type; use it if the data has it
  if ((gate as { isMasterGate?: boolean }).isMasterGate === true) return true;
  if ((gate as { isMasterGate?: boolean }).isMasterGate === false) return false;
  // Fallback: mark the last gate in each sign group as master
  const lastInGroup = allGatesInSign[allGatesInSign.length - 1];
  return lastInGroup?.id === gate.id;
}

export function LostOctaveList() {
  const allGates = Array.from(hdGates72.values()).sort(
    (a, b) => a.segmentNumber - b.segmentNumber
  );

  // Group gates by primary sign
  const gatesBySign = new Map<string, HDGate72[]>();
  for (const signId of ZODIAC_SIGN_ORDER) {
    gatesBySign.set(signId, []);
  }

  for (const gate of allGates) {
    const sign = getPrimarySign(gate);
    // Handle cross-sign gates: assign to the sign of the start degree
    const target = ZODIAC_SIGN_ORDER.includes(sign) ? sign : ZODIAC_SIGN_ORDER[0];
    gatesBySign.get(target)?.push(gate);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl text-humandesign-400">&#9674;</span>
          <h1 className="font-serif text-3xl font-medium">The Lost Octave</h1>
        </div>
        <p className="text-theme-text-secondary max-w-3xl">
          The Lost Octave is Robert James Comber's extended 72-gate system — an expansion
          of the Human Design 64-gate wheel that maps a complete octave of 72 archetypal
          energies across the zodiac. Each of the 12 signs contains exactly 6 gates of 5°
          each, with one master gate per sign anchoring the group's core theme.
        </p>
      </section>

      {/* System Overview Card */}
      <section className="bg-gradient-to-br from-humandesign-500/10 to-humandesign-600/5 rounded-xl p-6 border border-humandesign-500/20">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-2xl font-serif text-humandesign-400 mb-1">72</div>
            <div className="text-sm text-theme-text-secondary">Gates across the zodiac</div>
          </div>
          <div>
            <div className="text-2xl font-serif text-humandesign-400 mb-1">6</div>
            <div className="text-sm text-theme-text-secondary">Gates per zodiac sign</div>
          </div>
          <div>
            <div className="text-2xl font-serif text-humandesign-400 mb-1">5°</div>
            <div className="text-sm text-theme-text-secondary">Per gate arc (exact)</div>
          </div>
        </div>
        <p className="text-theme-text-tertiary text-sm mt-4">
          The wheel originates at 358°15' (Pisces 28°15') — the same starting point as the
          64-gate Human Design wheel. Gate data from the Comber source book is being
          integrated progressively.
        </p>
      </section>

      {/* Gates grouped by zodiac sign */}
      <section className="space-y-10">
        {ZODIAC_SIGN_ORDER.map((signId) => {
          const gatesInSign = gatesBySign.get(signId) ?? [];
          if (gatesInSign.length === 0) return null;

          const zodiacSign = signs.get(signId);
          const signLabel = ZODIAC_SIGN_LABELS[signId] ?? signId;

          return (
            <div key={signId}>
              {/* Sign header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-humandesign-500/20 flex items-center justify-center text-humandesign-400 text-lg">
                  {zodiacSign?.symbol ?? signLabel.charAt(0)}
                </div>
                <div>
                  <h2 className="font-serif text-xl text-theme-text-primary">{signLabel}</h2>
                  <p className="text-xs text-theme-text-tertiary">
                    {gatesInSign.length} gate{gatesInSign.length !== 1 ? 's' : ''} &middot; segments {gatesInSign[0]?.segmentNumber}–{gatesInSign[gatesInSign.length - 1]?.segmentNumber}
                  </p>
                </div>
              </div>

              {/* Gate cards grid */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {gatesInSign.map((gate) => {
                  const isMaster = deriveIsMasterGate(gate, gatesInSign);
                  const decanNum = (gate as { decanNumber?: number }).decanNumber ?? deriveDecanNumber(gate.segmentNumber);
                  const overlappingHDGate = hdGates.get(`gate-${gate.overlapping64GateSegment}`);
                  const gateName = gate.name ?? `Seg. ${gate.segmentNumber}`;

                  return (
                    <Link
                      key={gate.id}
                      to={`/library/lost-octave/${gate.id}`}
                      className={`rounded-xl p-4 border transition-all group flex flex-col ${
                        isMaster
                          ? 'bg-humandesign-500/15 border-humandesign-400/50 hover:border-humandesign-400 hover:bg-humandesign-500/20'
                          : 'bg-surface-base/50 border-theme-border-subtle hover:border-humandesign-500/40 hover:bg-surface-base'
                      }`}
                    >
                      {/* Segment number + master badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-lg font-serif font-medium ${isMaster ? 'text-humandesign-300' : 'text-humandesign-400'}`}>
                          {gate.segmentNumber}
                        </span>
                        {isMaster && (
                          <span className="text-xs bg-humandesign-500/30 text-humandesign-300 px-1.5 py-0.5 rounded font-medium">
                            Master
                          </span>
                        )}
                      </div>

                      {/* Gate name */}
                      <h3 className={`font-serif text-sm leading-tight mb-2 group-hover:text-humandesign-300 transition-colors flex-1 ${
                        gate.name ? 'text-theme-text-primary' : 'text-theme-text-tertiary italic'
                      }`}>
                        {gateName}
                      </h3>

                      {/* Decan badge */}
                      <div className="flex flex-wrap gap-1 mt-auto">
                        <span className="text-xs text-theme-text-tertiary bg-surface-raised px-1.5 py-0.5 rounded">
                          Decan {decanNum}
                        </span>
                        {overlappingHDGate && (
                          <span className="text-xs text-humandesign-400/70 bg-surface-raised px-1.5 py-0.5 rounded">
                            HD {gate.overlapping64GateSegment}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Context Note */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h3 className="font-serif text-lg mb-2 text-humandesign-300">About the Lost Octave</h3>
        <p className="text-theme-text-secondary text-sm mb-3">
          Robert James Comber's Lost Octave expands the Human Design mandala from 64 to 72 gates,
          recovering an "eighth octave" that bridges the 64-hexagram I Ching system with a full
          360° zodiacal mapping. Each gate occupies exactly 5° of the ecliptic — compared to the
          64-gate system's 5.625° per gate.
        </p>
        <p className="text-theme-text-secondary text-sm">
          The master gate in each sign (highlighted with a gold border) anchors that sign's
          essential archetypal energy within the extended system. Gate names and descriptions
          are being populated from the Comber source material.
        </p>
      </section>
    </div>
  );
}

export default LostOctaveList;
