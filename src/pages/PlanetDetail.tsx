import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { planets, signs, points, geneKeys, chakras, codonRings, getGateByDegree, signPositionToAbsoluteDegree } from '../data';
import { getPlacementByPlanetId } from '../data/userProfile';
import { useProfile } from '../context';
import { EntityStack } from '../components/entities/EntityStack';
import type { EntityInfo } from '../services/entities/registry';
import type { Planet } from '../types';

export function PlanetDetail() {
  const { id } = useParams<{ id: string }>();
  const planet = id ? (planets.get(id) || points.get(id)) : undefined;
  const isPlanet = planet?.type === 'planet';
  const planetData = isPlanet ? (planet as Planet) : undefined;
  const { profile } = useProfile();

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

  if (!planet) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Planet Not Found</h1>
        <Link to="/planets" className="text-air-400 hover:underline">
          Back to Planets
        </Link>
      </div>
    );
  }

  // Get signs ruled by this planet (only planets have signsRuled)
  const ruledSigns = ('signsRuled' in planet && planet.signsRuled)
    ? planet.signsRuled.map((signId) => signs.get(signId)).filter(Boolean)
    : [];

  // Get active profile's placement for this planet
  const myPlacement = id ? getPlacementByPlanetId(id, profile) : undefined;
  const placementSign = myPlacement ? signs.get(myPlacement.signId) : undefined;

  // Derive the HD gate and gene key activated by the planet's zodiac degree
  const hdActivation = (() => {
    if (!myPlacement) return undefined;
    const match = myPlacement.degree.match(/(\d+)°(\d+)/);
    if (!match) return undefined;
    const absD = signPositionToAbsoluteDegree(myPlacement.signId, parseInt(match[1]), parseInt(match[2]));
    return getGateByDegree(absD);
  })();
  const activatedGK = hdActivation?.gate.geneKeyId ? geneKeys.get(hdActivation.gate.geneKeyId) : undefined;
  const activatedChakra = hdActivation
    ? Array.from(chakras.values()).find(c => c.relatedHDCenters.includes(hdActivation.gate.centerId))
    : undefined;
  const activatedCodonRing = activatedGK?.codonRingId ? codonRings.get(activatedGK.codonRingId) : undefined;

  return (
    <div className="flex h-full">
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center py-8">
            <div className="text-6xl mb-4">{planet.symbol}</div>
            <h1 className="font-serif text-4xl font-medium mb-2">{planet.name}</h1>
            <p className="text-xl text-theme-text-secondary italic">{planet.archetype}</p>
            {planetData && (
              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-theme-text-secondary">
                <span className="px-3 py-1 bg-surface-raised rounded-full">{planetData.planetType}</span>
                <span className="px-3 py-1 bg-surface-raised rounded-full">Cycle: {planetData.cycleDuration}</span>
                <span className="px-3 py-1 bg-surface-raised rounded-full">Importance: {planetData.planetImportance}/4</span>
              </div>
            )}
          </header>

          {/* My Placement */}
          {myPlacement && placementSign && (
            <section className="rounded-xl p-6 border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
              <h2 className="font-serif text-xl mb-4 text-purple-300">My {planet.name} Placement</h2>
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center gap-3 p-4 bg-surface-raised/60 hover:bg-surface-raised rounded-lg transition-colors flex-1 cursor-pointer"
                  onClick={() => handleEntityClick(placementSign as unknown as EntityInfo)}
                >
                  <span className="text-3xl">{placementSign.symbol}</span>
                  <div>
                    <div className="font-medium text-lg">
                      {planet.name} in {placementSign.name}
                      {myPlacement.isRetrograde && (
                        <span className="text-sm text-red-400 ml-2">Retrograde</span>
                      )}
                    </div>
                    <div className="text-sm text-theme-text-secondary">
                      {myPlacement.degree} in House {myPlacement.houseNumber}
                      {myPlacement.dignity && (
                        <span className="text-amber-400 ml-2">({myPlacement.dignity})</span>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/signs/${placementSign.id}`}
                    className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary ml-auto"
                    onClick={e => e.stopPropagation()}
                  >
                    Full profile →
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* HD Activation — bridge: this planet's degree → HD Gate → Gene Key */}
          {hdActivation && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-humandesign-500/20">
              <h2 className="font-serif text-xl mb-2 text-humandesign-300">Human Design Activation</h2>
              <p className="text-theme-text-tertiary text-sm mb-4">
                Your {planet.name} at {myPlacement?.degree} {placementSign?.name} activates this specific gate and gene key in your body graph.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div
                  className="flex items-center gap-3 p-4 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors border border-theme-border-subtle cursor-pointer"
                  onClick={() => handleEntityClick(hdActivation.gate as unknown as EntityInfo)}
                >
                  <span className="text-2xl font-serif text-humandesign-400 w-10 text-center">
                    {hdActivation.gate.gateNumber}
                  </span>
                  <div>
                    <p className="text-theme-text-secondary text-xs mb-0.5">Gate · Line {hdActivation.line}</p>
                    <p className="text-theme-text-primary font-medium">{hdActivation.gate.name}</p>
                    <p className="text-theme-text-tertiary text-sm">{hdActivation.gate.iChingName}</p>
                  </div>
                  <Link
                    to={`/human-design/${hdActivation.gate.id}`}
                    className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary ml-auto"
                    onClick={e => e.stopPropagation()}
                  >
                    Full profile →
                  </Link>
                </div>
                {activatedGK && (
                  <div
                    className="flex items-center gap-3 p-4 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors border border-theme-border-subtle cursor-pointer"
                    onClick={() => handleEntityClick(activatedGK as unknown as EntityInfo)}
                  >
                    <span className="text-2xl font-serif text-genekey-400 w-10 text-center">
                      {activatedGK.keyNumber}
                    </span>
                    <div>
                      <p className="text-theme-text-secondary text-xs mb-0.5">Gene Key</p>
                      <p className="text-theme-text-primary font-medium">{activatedGK.name}</p>
                      <p className="text-theme-text-tertiary text-sm">
                        <span className="text-red-400/70">{activatedGK.shadow.name}</span>
                        {' → '}
                        <span className="text-emerald-400/70">{activatedGK.gift.name}</span>
                      </p>
                    </div>
                    <Link
                      to={`/gene-keys/${activatedGK.id}`}
                      className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary ml-auto"
                      onClick={e => e.stopPropagation()}
                    >
                      Full profile →
                    </Link>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Chakra + Codon Ring bridge */}
          {(activatedChakra || activatedCodonRing) && hdActivation && (
            <section className="flex flex-wrap gap-3">
              {activatedChakra && (
                <div
                  className="flex items-center gap-2 px-3 py-1.5 bg-surface-base/50 hover:bg-surface-raised rounded-lg border border-theme-border-subtle transition-colors cursor-pointer"
                  onClick={() => handleEntityClick(activatedChakra as unknown as EntityInfo)}
                >
                  <span style={{ color: activatedChakra.colorHex }}>{activatedChakra.symbol}</span>
                  <span className="text-theme-text-secondary text-sm">{activatedChakra.name}</span>
                  <Link
                    to={`/chakras/${activatedChakra.id}`}
                    className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary"
                    onClick={e => e.stopPropagation()}
                  >
                    →
                  </Link>
                </div>
              )}
              {activatedCodonRing && (
                <Link
                  to={`/gene-keys/codon-rings/${activatedCodonRing.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 bg-surface-base/50 hover:bg-surface-raised rounded-lg border border-theme-border-subtle transition-colors"
                >
                  <span className="text-genekey-500 text-xs">⬡</span>
                  <span className="text-theme-text-secondary text-sm">{activatedCodonRing.name}</span>
                </Link>
              )}
            </section>
          )}

          {/* Function & Meaning */}
          <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
            <h2 className="font-serif text-xl mb-4">Function & Meaning</h2>
            <p className="text-theme-text-secondary leading-relaxed">{planet.functionAndMeaning}</p>
          </section>

          {/* Gift & Shadow */}
          {planetData && (
            <div className="grid md:grid-cols-2 gap-6">
              <section className="bg-gradient-to-br from-water-500/10 to-water-600/5 rounded-xl p-6 border border-water-500/20">
                <h2 className="font-serif text-xl mb-3 text-water-400">Gift Expression</h2>
                <p className="text-theme-text-secondary leading-relaxed">{planetData.giftExpression}</p>
              </section>
              <section className="bg-gradient-to-br from-fire-500/10 to-fire-600/5 rounded-xl p-6 border border-fire-500/20">
                <h2 className="font-serif text-xl mb-3 text-fire-400">Shadow Expression</h2>
                <p className="text-theme-text-secondary leading-relaxed">{planetData.shadowExpression}</p>
              </section>
            </div>
          )}

          {/* Signs Ruled */}
          {ruledSigns.length > 0 && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-4">Signs Ruled</h2>
              <div className="flex flex-wrap gap-3">
                {ruledSigns.map((sign) => sign && (
                  <div
                    key={sign.id}
                    className="flex items-center gap-2 px-4 py-2 bg-surface-raised hover:bg-surface-interactive rounded-lg transition-colors cursor-pointer"
                    onClick={() => handleEntityClick(sign as unknown as EntityInfo)}
                  >
                    <span className="text-xl">{sign.symbol}</span>
                    <span>{sign.name}</span>
                    <Link
                      to={`/signs/${sign.id}`}
                      className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary"
                      onClick={e => e.stopPropagation()}
                    >
                      →
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contemplation Questions */}
          {planet.contemplationQuestions && planet.contemplationQuestions.length > 0 && (
            <section className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-4">Contemplation Questions</h2>
              <ul className="space-y-3">
                {planet.contemplationQuestions.map((question, index) => (
                  <li key={index} className="flex gap-3 text-theme-text-secondary">
                    <span className="text-theme-text-tertiary">{index + 1}.</span>
                    <span className="italic">{question}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Navigation */}
          <nav className="flex justify-between pt-6 border-t border-theme-border-subtle">
            <Link to="/planets" className="text-theme-text-secondary hover:text-theme-text-primary transition-colors">
              &larr; All Planets & Points
            </Link>
          </nav>
        </div>
      </div>
      <EntityStack
        entities={selectedEntities}
        onCloseEntity={handleCloseEntity}
        onEntityClick={handleEntityClick}
      />
    </div>
  );
}
export default PlanetDetail;
