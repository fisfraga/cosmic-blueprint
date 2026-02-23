import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { signs, elements, planets, houses, chakras, getGatesBySign, getGeneKeysBySign, getSignDecans } from '../data';
import { getPlacementsInSign } from '../data/userProfile';
import { useProfile } from '../context';
import { EntityStack } from '../components/entities/EntityStack';
import type { EntityInfo } from '../services/entities/registry';

const POLARITY_LABEL: Record<string, string> = {
  yang: 'Yang · Masculine',
  bridge: 'Bridge · Integration',
  yin: 'Yin · Feminine',
};
const POLARITY_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  yang:   { bg: 'bg-amber-500/5',   border: 'border-amber-500/20',   text: 'text-amber-400',   badge: 'bg-amber-500/20 text-amber-300'   },
  bridge: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
  yin:    { bg: 'bg-indigo-500/5',  border: 'border-indigo-500/20',  text: 'text-indigo-400',  badge: 'bg-indigo-500/20 text-indigo-300'  },
};

const elementColors = {
  fire: 'from-fire-500/20 to-fire-600/10 border-fire-500/30',
  earth: 'from-earth-500/20 to-earth-600/10 border-earth-500/30',
  air: 'from-air-500/20 to-air-600/10 border-air-500/30',
  water: 'from-water-500/20 to-water-600/10 border-water-500/30',
};

const elementTextColors = {
  fire: 'text-fire-400',
  earth: 'text-earth-400',
  air: 'text-air-400',
  water: 'text-water-400',
};

const VPER_ICONS: Record<string, string> = {
  vision: '🔥',
  plan: '💨',
  execute: '🌱',
  review: '🌊',
};

const VPER_LABELS: Record<string, string> = {
  vision: 'Vision',
  plan: 'Plan',
  execute: 'Execute',
  review: 'Review',
};

const DIMENSION_COLORS: Record<string, { badge: string; text: string }> = {
  physical: { badge: 'bg-earth-500/15 border-earth-500/30', text: 'text-earth-400' },
  mental:   { badge: 'bg-air-500/15 border-air-500/30',     text: 'text-air-400'   },
  spiritual:{ badge: 'bg-water-500/15 border-water-500/30', text: 'text-water-400'  },
};

export function SignDetail() {
  const { id } = useParams<{ id: string }>();
  const sign = id ? signs.get(id) : undefined;
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

  if (!sign) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Sign Not Found</h1>
        <Link to="/signs" className="text-air-400 hover:underline">
          Back to Signs
        </Link>
      </div>
    );
  }

  const element = elements.get(sign.elementId);
  const rulingPlanets = sign.rulingPlanetIds
    .map((pid) => planets.get(pid))
    .filter(Boolean);
  const oppositeSign = signs.get(sign.opposingSignId);
  const ruledHouse = Array.from(houses.values()).find(
    (h) => h.rulingSignId === sign.id
  );
  const myPlacements = getPlacementsInSign(sign.id, profile);
  const hdGates = getGatesBySign(sign.id);
  const geneKeys = getGeneKeysBySign(sign.id);
  const relatedChakra = Array.from(chakras.values()).find(c => c.relatedSigns.includes(sign.id));
  const signDecans = getSignDecans(sign.id);

  const colorClasses = elementColors[sign.elementId as keyof typeof elementColors] || elementColors.fire;
  const textColor = elementTextColors[sign.elementId as keyof typeof elementTextColors] || 'text-theme-text-secondary';

  const alchemicalElement = sign.alchemicalElementId ? elements.get(sign.alchemicalElementId) : null;
  const siblingSignIds = alchemicalElement?.zodiacSignIds ?? [];

  return (
    <div className="flex h-full">
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Header */}
          <header className={`text-center py-8 rounded-2xl bg-gradient-to-br border ${colorClasses}`}>
            <div className="text-6xl mb-4">{sign.symbol}</div>
            <h1 className="font-serif text-4xl font-medium mb-2">{sign.name}</h1>
            <p className={`text-xl italic ${textColor}`}>"{sign.keyPhrase}"</p>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-theme-text-secondary">
              <span className="px-3 py-1 bg-surface-overlay rounded-full">{sign.signModality}</span>
              <span className={`px-3 py-1 bg-surface-overlay rounded-full ${textColor}`}>
                {element?.name || sign.elementId}
              </span>
              <span className="px-3 py-1 bg-surface-overlay rounded-full">{sign.dateRange}</span>
            </div>
          </header>

          {/* Quick Facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-base/50 rounded-xl p-4 text-center border border-theme-border-subtle">
              <div className="text-theme-text-secondary text-xs uppercase tracking-wider mb-1">Order</div>
              <div className="font-serif text-2xl">{sign.orderInZodiac}</div>
            </div>
            <div className="bg-surface-base/50 rounded-xl p-4 text-center border border-theme-border-subtle">
              <div className="text-theme-text-secondary text-xs uppercase tracking-wider mb-1">Modality</div>
              <div className="font-serif text-lg">{sign.signModality}</div>
            </div>
            <div className="bg-surface-base/50 rounded-xl p-4 text-center border border-theme-border-subtle">
              <div className="text-theme-text-secondary text-xs uppercase tracking-wider mb-1">Element</div>
              <div className={`font-serif text-lg ${textColor}`}>{element?.name}</div>
            </div>
            <div className="bg-surface-base/50 rounded-xl p-4 text-center border border-theme-border-subtle">
              <div className="text-theme-text-secondary text-xs uppercase tracking-wider mb-1">Body Part</div>
              <div className="font-serif text-lg">{sign.bodyPart}</div>
            </div>
          </div>

          {/* My Placements in this Sign */}
          {myPlacements.length > 0 && (
            <section className={`rounded-xl p-6 border bg-gradient-to-br ${colorClasses}`}>
              <h2 className="font-serif text-xl mb-4">My Placements in {sign.name}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {myPlacements.map((placement) => (
                  <div
                    key={placement.planetId}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      placement.placementType === 'planet'
                        ? 'bg-surface-raised/60'
                        : 'bg-surface-raised/40 border border-theme-border-subtle/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{placement.planetSymbol}</span>
                      <div>
                        <div className="font-medium">
                          {placement.planetName}
                          {placement.isRetrograde && (
                            <span className="text-xs text-red-400 ml-1">R</span>
                          )}
                        </div>
                        {placement.dignity && (
                          <span className="text-xs text-amber-400">({placement.dignity})</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-theme-text-secondary">{placement.degree}</div>
                      <div className="text-xs text-theme-text-tertiary">House {placement.houseNumber}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Characteristics */}
          <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
            <h2 className="font-serif text-xl mb-4">Characteristics & Qualities</h2>
            <p className="text-theme-text-secondary leading-relaxed">{sign.characteristicsAndQualities}</p>
          </section>

          {/* Traits */}
          {sign.traits && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-4">Key Traits</h2>
              <p className="text-theme-text-secondary leading-relaxed">{sign.traits}</p>
            </section>
          )}

          {/* Shadow → Light (Julia Balaz / ILOS) */}
          {(sign.shadowExpression || sign.lightExpression) && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl">Shadow → Light</h2>
                {sign.vperPhase && (
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface-overlay border border-theme-border-subtle ${textColor}`}>
                    <span>{VPER_ICONS[sign.vperPhase]}</span>
                    <span>{VPER_LABELS[sign.vperPhase]} Phase</span>
                  </span>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {sign.shadowExpression && (
                  <div className="p-4 rounded-lg bg-rose-500/5 border border-rose-500/20">
                    <div className="text-xs uppercase tracking-wider text-rose-400 mb-2">Shadow Expression</div>
                    <p className="text-theme-text-secondary italic leading-relaxed">{sign.shadowExpression}</p>
                  </div>
                )}
                {sign.lightExpression && (
                  <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                    <div className="text-xs uppercase tracking-wider text-emerald-400 mb-2">Light Expression</div>
                    <p className="text-theme-text-secondary italic leading-relaxed">{sign.lightExpression}</p>
                  </div>
                )}
              </div>
              {sign.managementGuidance && (
                <div className="mt-4 p-4 rounded-lg bg-surface-overlay border border-theme-border-subtle">
                  <div className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">Working with this Energy</div>
                  <p className="text-theme-text-secondary leading-relaxed">{sign.managementGuidance}</p>
                </div>
              )}
            </section>
          )}

          {/* Three Decans */}
          {signDecans.length > 0 && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-1">Three Decans</h2>
              <p className="text-theme-text-tertiary text-sm mb-4">
                Each sign is divided into three 10° segments — Physical, Mental, and Spiritual dimensions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {signDecans.map((decan) => {
                  const dim = decan.dimension;
                  const dimColors = dim ? (DIMENSION_COLORS[dim] ?? DIMENSION_COLORS.physical) : DIMENSION_COLORS.physical;
                  const rulerPlanet = planets.get(decan.rulerPlanetId);
                  return (
                    <div
                      key={decan.id}
                      className="p-4 rounded-lg border border-theme-border-subtle bg-surface-overlay hover:bg-surface-raised transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-theme-text-tertiary">{decan.degrees}</span>
                        {dim && (
                          <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${dimColors.badge} ${dimColors.text}`}>
                            {dim}
                          </span>
                        )}
                      </div>
                      <p className={`font-serif font-medium mb-1 ${textColor}`}>"{decan.keyword}"</p>
                      <p className="text-xs text-theme-text-tertiary mb-2">
                        Decan {decan.decanNumber} · {rulerPlanet?.symbol} {rulerPlanet?.name}
                      </p>
                      {decan.dimensionDescription && (
                        <p className="text-xs text-theme-text-secondary leading-relaxed line-clamp-3">
                          {decan.dimensionDescription}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Connections */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Ruling Planets */}
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-4">Ruling Planets</h2>
              <div className="space-y-3">
                {rulingPlanets.map((planet) => planet && (
                  <div
                    key={planet.id}
                    className="flex items-center gap-3 p-3 bg-surface-overlay hover:bg-surface-raised rounded-lg transition-colors cursor-pointer"
                    onClick={() => handleEntityClick(planet as unknown as EntityInfo)}
                  >
                    <span className="text-2xl">{planet.symbol}</span>
                    <div>
                      <div className="font-medium">{planet.name}</div>
                      <div className="text-sm text-theme-text-secondary">{planet.archetype}</div>
                    </div>
                    <Link
                      to={`/planets/${planet.id}`}
                      className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary ml-auto"
                      onClick={e => e.stopPropagation()}
                    >
                      →
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* Opposite Sign */}
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-4">Polarity Axis</h2>
              {oppositeSign && (
                <div
                  className="flex items-center gap-3 p-3 bg-surface-overlay hover:bg-surface-raised rounded-lg transition-colors cursor-pointer"
                  onClick={() => handleEntityClick(oppositeSign as unknown as EntityInfo)}
                >
                  <span className="text-2xl">{oppositeSign.symbol}</span>
                  <div>
                    <div className="font-medium">{oppositeSign.name}</div>
                    <div className="text-sm text-theme-text-secondary">Opposite Sign</div>
                  </div>
                  <Link
                    to={`/signs/${oppositeSign.id}`}
                    className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary ml-auto"
                    onClick={e => e.stopPropagation()}
                  >
                    →
                  </Link>
                </div>
              )}
              {ruledHouse && (
                <div
                  className="flex items-center gap-3 p-3 mt-3 bg-surface-overlay hover:bg-surface-raised rounded-lg transition-colors cursor-pointer"
                  onClick={() => handleEntityClick(ruledHouse as unknown as EntityInfo)}
                >
                  <span className="text-2xl">⌂</span>
                  <div>
                    <div className="font-medium">{ruledHouse.name}</div>
                    <div className="text-sm text-theme-text-secondary">Natural House</div>
                  </div>
                  <Link
                    to={`/houses/${ruledHouse.id}`}
                    className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary ml-auto"
                    onClick={e => e.stopPropagation()}
                  >
                    →
                  </Link>
                </div>
              )}
            </section>
          </div>

          {/* Human Design Gates & Gene Keys in this Sign */}
          {(hdGates.length > 0 || geneKeys.length > 0) && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-4">Cross-System Connections</h2>
              <p className="text-theme-text-secondary text-sm mb-6">
                In the unified wisdom traditions, each zodiac sign contains specific Human Design Gates
                and Gene Keys that express through its archetypal energy.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* HD Gates */}
                {hdGates.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-humandesign-400 font-medium mb-3">
                      <span>&#9672;</span> Human Design Gates
                    </h3>
                    <div className="space-y-2">
                      {hdGates.map(gate => (
                        <div
                          key={gate.id}
                          className="flex items-center gap-3 p-3 bg-surface-overlay hover:bg-surface-raised rounded-lg transition-colors cursor-pointer"
                          onClick={() => handleEntityClick(gate as unknown as EntityInfo)}
                        >
                          <span className="text-xl font-serif text-humandesign-400 w-8">{gate.gateNumber}</span>
                          <div className="min-w-0">
                            <div className="font-medium truncate">{gate.name}</div>
                            <div className="text-xs text-theme-text-tertiary truncate">{gate.iChingName}</div>
                          </div>
                          <Link
                            to={`/human-design/${gate.id}`}
                            className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary ml-auto flex-shrink-0"
                            onClick={e => e.stopPropagation()}
                          >
                            →
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gene Keys */}
                {geneKeys.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-genekey-400 font-medium mb-3">
                      <span>&#10022;</span> Gene Keys
                    </h3>
                    <div className="space-y-2">
                      {geneKeys.map(gk => (
                        <div
                          key={gk.id}
                          className="flex items-center gap-3 p-3 bg-surface-overlay hover:bg-surface-raised rounded-lg transition-colors cursor-pointer"
                          onClick={() => handleEntityClick(gk as unknown as EntityInfo)}
                        >
                          <span className="text-xl font-serif text-genekey-400 w-8">{gk.keyNumber}</span>
                          <div className="min-w-0">
                            <div className="font-medium truncate">{gk.name}</div>
                            <div className="text-xs text-theme-text-tertiary truncate">
                              {gk.shadow.name} &#8594; {gk.gift.name}
                            </div>
                          </div>
                          <Link
                            to={`/gene-keys/${gk.id}`}
                            className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary ml-auto flex-shrink-0"
                            onClick={e => e.stopPropagation()}
                          >
                            →
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Chakra Resonance */}
          {relatedChakra && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-4">Chakra Resonance</h2>
              <p className="text-theme-text-tertiary text-sm mb-4">
                In astrological alchemy, each zodiac sign resonates with a specific energy center —
                the chakra whose archetypal energy mirrors the sign's essential nature and life theme.
              </p>
              <div
                className="flex items-center gap-4 p-4 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors border border-theme-border-subtle mb-4 cursor-pointer"
                onClick={() => handleEntityClick(relatedChakra as unknown as EntityInfo)}
              >
                <div
                  className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-xl"
                  style={{ backgroundColor: relatedChakra.colorHex + '33', border: `2px solid ${relatedChakra.colorHex}66` }}
                >
                  {relatedChakra.symbol}
                </div>
                <div>
                  <p className="text-theme-text-primary font-medium">{relatedChakra.name}</p>
                  <p className="text-theme-text-secondary text-sm italic">{relatedChakra.sanskritName}</p>
                  <p className="text-theme-text-tertiary text-xs mt-1">{relatedChakra.lifeTheme}</p>
                </div>
                <Link
                  to={`/chakras/${relatedChakra.id}`}
                  className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary ml-auto"
                  onClick={e => e.stopPropagation()}
                >
                  Full profile →
                </Link>
              </div>
              {relatedChakra.alchemyNote && (
                <div
                  className="p-4 rounded-lg bg-surface-raised/30 border-l-2"
                  style={{ borderLeftColor: relatedChakra.colorHex + '90' }}
                >
                  <p className="text-theme-text-secondary text-sm italic leading-relaxed">
                    "{relatedChakra.alchemyNote}"
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Element Link */}
          {element && (
            <section className={`rounded-xl p-6 border bg-gradient-to-br ${colorClasses}`}>
              <div
                className="flex items-center gap-4 group cursor-pointer"
                onClick={() => handleEntityClick(element as unknown as EntityInfo)}
              >
                <span className="text-4xl">{element.symbol}</span>
                <div>
                  <h2 className="font-serif text-xl group-hover:text-theme-text-primary transition-colors">
                    {element.name} Element
                  </h2>
                  <p className="text-theme-text-secondary">{element.corePrinciple}</p>
                </div>
                <Link
                  to={`/elements/${element.id}`}
                  className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary ml-auto"
                  onClick={e => e.stopPropagation()}
                >
                  Full profile →
                </Link>
              </div>
            </section>
          )}

          {/* Alchemical Nature */}
          {alchemicalElement && (
            <section className={`rounded-xl p-6 border ${POLARITY_COLORS[sign.substancePolarity].bg} ${POLARITY_COLORS[sign.substancePolarity].border}`}>
              <h2 className="font-serif text-xl font-semibold text-theme-text-primary mb-4">Alchemical Nature</h2>
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl shrink-0">{alchemicalElement.symbol}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold text-lg ${POLARITY_COLORS[sign.substancePolarity].text}`}>
                      {alchemicalElement.name}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${POLARITY_COLORS[sign.substancePolarity].badge}`}>
                      {POLARITY_LABEL[sign.substancePolarity]}
                    </span>
                  </div>
                  <p className="text-sm text-theme-text-secondary">{alchemicalElement.corePrinciple}</p>
                  <p className="text-xs text-theme-text-tertiary mt-1">{alchemicalElement.coreQuality}</p>
                </div>
              </div>
              {/* Sibling signs */}
              {siblingSignIds.length > 0 && (
                <div>
                  <p className="text-xs text-theme-text-tertiary mb-2 uppercase tracking-wider">Signs of this substance</p>
                  <div className="flex flex-wrap gap-2">
                    {siblingSignIds.map((sid) => {
                      const s = signs.get(sid);
                      if (!s) return null;
                      const isCurrent = s.id === sign.id;
                      return isCurrent ? (
                        <span
                          key={sid}
                          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm ${POLARITY_COLORS[sign.substancePolarity].badge} font-semibold cursor-default`}
                        >
                          <span>{s.symbol}</span>
                          <span>{s.name.replace(' ', '')}</span>
                        </span>
                      ) : (
                        <div
                          key={sid}
                          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm bg-surface-overlay text-theme-text-secondary hover:bg-surface-interactive/60 transition-colors cursor-pointer"
                          onClick={() => handleEntityClick(s as unknown as EntityInfo)}
                        >
                          <span>{s.symbol}</span>
                          <span>{s.name.replace(' ', '')}</span>
                          <Link
                            to={`/signs/${sid}`}
                            className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary"
                            onClick={e => e.stopPropagation()}
                          >
                            →
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Navigation */}
          <nav className="flex justify-between pt-6 border-t border-theme-border-subtle">
            <Link to="/signs" className="text-theme-text-secondary hover:text-theme-text-primary transition-colors">
              &larr; All Signs
            </Link>
            {oppositeSign && (
              <Link to={`/signs/${oppositeSign.id}`} className="text-theme-text-secondary hover:text-theme-text-primary transition-colors">
                {oppositeSign.name} &rarr;
              </Link>
            )}
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
export default SignDetail;
