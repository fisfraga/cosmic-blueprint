import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hdGates72, hdGates, signs } from '../data';
import { EntityStack } from '../components/entities/EntityStack';
import type { EntityInfo } from '../services/entities/registry';

/**
 * Derive decan number from segmentNumber (2 segments per decan).
 */
function deriveDecanNumber(segmentNumber: number): number {
  return Math.ceil(segmentNumber / 2);
}

/**
 * Format absolute degree as a readable zodiac position string.
 */
function formatDegree(absLongitude: number): string {
  const normalized = ((absLongitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const degreeInSign = normalized - signIndex * 30;
  const degrees = Math.floor(degreeInSign);
  const minutes = Math.round((degreeInSign - degrees) * 60);
  const SIGN_SYMBOLS = ['♈︎', '♉︎', '♊︎', '♋︎', '♌︎', '♍︎', '♎︎', '♏︎', '♐︎', '♑︎', '♒︎', '♓︎'];
  const SIGN_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  return `${degrees}°${minutes.toString().padStart(2, '0')}' ${SIGN_SYMBOLS[signIndex]} ${SIGN_NAMES[signIndex]}`;
}

export function LostOctaveDetail() {
  const { id } = useParams<{ id: string }>();
  const gate = id ? hdGates72.get(id) : undefined;

  const [selectedEntities, setSelectedEntities] = useState<EntityInfo[]>([]);
  const handleEntityClick = useCallback((entity: EntityInfo) => {
    setSelectedEntities(prev => {
      const already = prev.findIndex(e => e.id === entity.id);
      if (already !== -1) return prev;
      if (prev.length >= 2) return [prev[1], entity];
      return [...prev, entity];
    });
  }, []);
  const handleCloseEntity = useCallback((id: string) => {
    setSelectedEntities(prev => prev.filter(e => e.id !== id));
  }, []);

  if (!gate) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Gate Not Found</h1>
        <Link to="/library/lost-octave" className="text-humandesign-400 hover:underline">
          Back to Lost Octave
        </Link>
      </div>
    );
  }

  // Derived fields
  const isMasterGate = (gate as { isMasterGate?: boolean }).isMasterGate ?? false;
  const decanNumber = (gate as { decanNumber?: number }).decanNumber ?? deriveDecanNumber(gate.segmentNumber);
  const gateName = gate.name ?? `Segment ${gate.segmentNumber}`;

  // Overlapping HD Gate
  const overlappingHDGate = hdGates.get(`gate-${gate.overlapping64GateSegment}`);
  const overlappingSign = overlappingHDGate?.tropicalSignId
    ? signs.get(overlappingHDGate.tropicalSignId)
    : undefined;

  // Start sign info
  const startSign = signs.get(gate.startSign);

  // Previous / next navigation
  const allGatesSorted = Array.from(hdGates72.values()).sort(
    (a, b) => a.segmentNumber - b.segmentNumber
  );
  const currentIndex = allGatesSorted.findIndex(g => g.id === gate.id);
  const prevGate = currentIndex > 0 ? allGatesSorted[currentIndex - 1] : undefined;
  const nextGate = currentIndex < allGatesSorted.length - 1 ? allGatesSorted[currentIndex + 1] : undefined;

  // Extra fields (may be populated in future data releases)
  const extraFields = gate as {
    crystal?: string;
    musicalTone?: string;
    egyptianAstrology?: string;
    divineName?: string;
    angel?: string;
    isMasterGate?: boolean;
    decanNumber?: number;
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="space-y-8 max-w-4xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-theme-text-tertiary">
            <Link to="/library/lost-octave" className="hover:text-humandesign-400 transition-colors">
              Lost Octave
            </Link>
            <span>&#8250;</span>
            <span className="text-theme-text-secondary">Segment {gate.segmentNumber}</span>
          </div>

          {/* Header */}
          <header className="text-center py-8">
            {isMasterGate && (
              <div className="inline-block mb-3 px-3 py-1 rounded-full bg-humandesign-500/20 text-humandesign-300 text-xs font-medium tracking-wider uppercase">
                Master Gate
              </div>
            )}
            <div className="text-6xl mb-4 font-serif text-humandesign-400">
              {gate.segmentNumber}
            </div>
            <h1 className={`font-serif text-4xl font-medium mb-2 ${gate.name ? '' : 'text-theme-text-tertiary italic'}`}>
              {gateName}
            </h1>
            <p className="text-xl text-theme-text-secondary mb-4">
              Lost Octave &middot; Segment {gate.segmentNumber} of 72
            </p>

            {/* Badges row */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              {startSign && (
                <span className="px-3 py-1.5 bg-humandesign-500/20 text-humandesign-300 rounded-full">
                  {startSign.symbol} {startSign.name}
                </span>
              )}
              <span className="px-3 py-1.5 bg-surface-raised text-theme-text-secondary rounded-full">
                Decan {decanNumber}
              </span>
              <span className="px-3 py-1.5 bg-surface-raised text-theme-text-secondary rounded-full">
                {formatDegree(gate.degreeStart)} &ndash; {formatDegree(gate.degreeEnd)}
              </span>
            </div>
          </header>

          {/* Description */}
          {gate.description && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-lg mb-3 text-humandesign-300">About this Gate</h2>
              <p className="text-theme-text-secondary leading-relaxed">{gate.description}</p>
            </section>
          )}

          {/* Data not yet available notice */}
          {!gate.name && !gate.description && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle text-center">
              <div className="text-2xl mb-3 text-humandesign-400/50">&#9674;</div>
              <h2 className="font-serif text-lg mb-2 text-theme-text-secondary">Gate Data Pending</h2>
              <p className="text-theme-text-tertiary text-sm">
                The name and description for this segment are being sourced from Robert Comber's
                Lost Octave manuscript. Check back as the data is progressively integrated.
              </p>
            </section>
          )}

          {/* Technical Details */}
          <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
            <h2 className="font-serif text-lg mb-4 text-humandesign-300">Zodiacal Position</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Start Position</p>
                <p className="text-theme-text-primary font-medium">
                  {formatDegree(gate.degreeStart)}
                </p>
                <p className="text-xs text-theme-text-tertiary mt-0.5">
                  {gate.startDegree.toFixed(2)}° within {gate.startSign}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">End Position</p>
                <p className="text-theme-text-primary font-medium">
                  {formatDegree(gate.degreeEnd)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Arc Span</p>
                <p className="text-theme-text-primary">5.000° (exact)</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Sign Group</p>
                <p className="text-theme-text-primary capitalize">
                  {gate.tropicalSignId.replace('/', ' / ')}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Decan</p>
                <p className="text-theme-text-primary">{decanNumber} of 36</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Segment</p>
                <p className="text-theme-text-primary">{gate.segmentNumber} of 72</p>
              </div>
            </div>
          </section>

          {/* HD Bridge: Overlapping 64-Gate */}
          <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
            <h2 className="font-serif text-lg mb-4 text-humandesign-300">
              Human Design Bridge
            </h2>
            <p className="text-theme-text-secondary text-sm mb-4">
              This Lost Octave segment most overlaps with Human Design Gate {gate.overlapping64GateSegment}
              in the standard 64-gate wheel. The two systems share the same wheel origin but use
              different arc sizes (5° vs 5.625°).
            </p>

            {overlappingHDGate ? (
              <Link
                to={`/human-design/${overlappingHDGate.id}`}
                className="block bg-humandesign-500/10 rounded-lg p-4 border border-humandesign-500/30 hover:border-humandesign-500/60 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-serif text-humandesign-400">
                    {overlappingHDGate.gateNumber}
                  </span>
                  {overlappingSign && (
                    <span className="text-theme-text-tertiary">{overlappingSign.symbol}</span>
                  )}
                </div>
                <h3 className="font-serif text-theme-text-primary group-hover:text-humandesign-300 transition-colors mb-1">
                  {overlappingHDGate.name}
                </h3>
                {overlappingHDGate.iChingName && (
                  <p className="text-xs text-theme-text-tertiary">{overlappingHDGate.iChingName}</p>
                )}
                {overlappingHDGate.coreTheme && (
                  <p className="text-sm text-humandesign-400/80 mt-2 line-clamp-2">
                    {overlappingHDGate.coreTheme}
                  </p>
                )}
                <span className="text-xs text-humandesign-400 mt-3 inline-block">
                  View HD Gate {gate.overlapping64GateSegment} &#8250;
                </span>
              </Link>
            ) : (
              <div className="bg-surface-raised rounded-lg p-4 text-theme-text-tertiary text-sm">
                Overlapping Gate {gate.overlapping64GateSegment} data not found.
              </div>
            )}
          </section>

          {/* Extra fields (crystal, musical tone, etc.) — shown when populated */}
          {(extraFields.crystal || extraFields.musicalTone || extraFields.egyptianAstrology ||
            extraFields.divineName || extraFields.angel) && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-lg mb-4 text-humandesign-300">Extended Correspondences</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {extraFields.crystal && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Crystal</p>
                    <p className="text-theme-text-primary">{extraFields.crystal}</p>
                  </div>
                )}
                {extraFields.musicalTone && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Musical Tone</p>
                    <p className="text-theme-text-primary">{extraFields.musicalTone}</p>
                  </div>
                )}
                {extraFields.egyptianAstrology && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Egyptian Astrology</p>
                    <p className="text-theme-text-primary">{extraFields.egyptianAstrology}</p>
                  </div>
                )}
                {extraFields.divineName && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Divine Name</p>
                    <p className="text-theme-text-primary">{extraFields.divineName}</p>
                  </div>
                )}
                {extraFields.angel && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Angel</p>
                    <p className="text-theme-text-primary">{extraFields.angel}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Prev/Next Navigation */}
          <nav className="flex items-center justify-between pt-4">
            {prevGate ? (
              <Link
                to={`/library/lost-octave/${prevGate.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-raised hover:bg-surface-interactive text-theme-text-secondary hover:text-theme-text-primary transition-colors text-sm"
              >
                <span>&#8592;</span>
                <div className="text-left">
                  <div className="text-xs text-theme-text-tertiary">Previous</div>
                  <div>Segment {prevGate.segmentNumber}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            <Link
              to="/library/lost-octave"
              className="text-xs text-theme-text-tertiary hover:text-humandesign-400 transition-colors"
            >
              All 72 Segments
            </Link>

            {nextGate ? (
              <Link
                to={`/library/lost-octave/${nextGate.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-raised hover:bg-surface-interactive text-theme-text-secondary hover:text-theme-text-primary transition-colors text-sm"
              >
                <div className="text-right">
                  <div className="text-xs text-theme-text-tertiary">Next</div>
                  <div>Segment {nextGate.segmentNumber}</div>
                </div>
                <span>&#8594;</span>
              </Link>
            ) : (
              <div />
            )}
          </nav>

        </div>
      </div>

      {/* Entity Stack Side Panel */}
      {selectedEntities.length > 0 && (
        <EntityStack
          entities={selectedEntities}
          onCloseEntity={handleCloseEntity}
          onEntityClick={handleEntityClick}
        />
      )}
    </div>
  );
}

export default LostOctaveDetail;
