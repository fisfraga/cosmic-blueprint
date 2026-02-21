import { useParams, Link } from 'react-router-dom';
import { signs, elements, planets, houses, chakras, getGatesBySign, getGeneKeysBySign } from '../data';
import { getPlacementsInSign } from '../data/userProfile';

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

export function SignDetail() {
  const { id } = useParams<{ id: string }>();
  const sign = id ? signs.get(id) : undefined;

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
  const myPlacements = getPlacementsInSign(sign.id);
  const hdGates = getGatesBySign(sign.id);
  const geneKeys = getGeneKeysBySign(sign.id);
  const relatedChakra = Array.from(chakras.values()).find(c => c.relatedSigns.includes(sign.id));

  const colorClasses = elementColors[sign.elementId as keyof typeof elementColors] || elementColors.fire;
  const textColor = elementTextColors[sign.elementId as keyof typeof elementTextColors] || 'text-theme-text-secondary';

  const alchemicalElement = sign.alchemicalElementId ? elements.get(sign.alchemicalElementId) : null;
  const siblingSignIds = alchemicalElement?.zodiacSignIds ?? [];

  return (
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

      {/* Connections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Ruling Planets */}
        <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl mb-4">Ruling Planets</h2>
          <div className="space-y-3">
            {rulingPlanets.map((planet) => planet && (
              <Link
                key={planet.id}
                to={`/planets/${planet.id}`}
                className="flex items-center gap-3 p-3 bg-surface-overlay hover:bg-surface-raised rounded-lg transition-colors"
              >
                <span className="text-2xl">{planet.symbol}</span>
                <div>
                  <div className="font-medium">{planet.name}</div>
                  <div className="text-sm text-theme-text-secondary">{planet.archetype}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Opposite Sign */}
        <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl mb-4">Polarity Axis</h2>
          {oppositeSign && (
            <Link
              to={`/signs/${oppositeSign.id}`}
              className="flex items-center gap-3 p-3 bg-surface-overlay hover:bg-surface-raised rounded-lg transition-colors"
            >
              <span className="text-2xl">{oppositeSign.symbol}</span>
              <div>
                <div className="font-medium">{oppositeSign.name}</div>
                <div className="text-sm text-theme-text-secondary">Opposite Sign</div>
              </div>
            </Link>
          )}
          {ruledHouse && (
            <Link
              to={`/houses/${ruledHouse.id}`}
              className="flex items-center gap-3 p-3 mt-3 bg-surface-overlay hover:bg-surface-raised rounded-lg transition-colors"
            >
              <span className="text-2xl">⌂</span>
              <div>
                <div className="font-medium">{ruledHouse.name}</div>
                <div className="text-sm text-theme-text-secondary">Natural House</div>
              </div>
            </Link>
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
                    <Link
                      key={gate.id}
                      to={`/human-design/${gate.id}`}
                      className="flex items-center gap-3 p-3 bg-surface-overlay hover:bg-surface-raised rounded-lg transition-colors"
                    >
                      <span className="text-xl font-serif text-humandesign-400 w-8">{gate.gateNumber}</span>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{gate.name}</div>
                        <div className="text-xs text-theme-text-tertiary truncate">{gate.iChingName}</div>
                      </div>
                    </Link>
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
                    <Link
                      key={gk.id}
                      to={`/gene-keys/${gk.id}`}
                      className="flex items-center gap-3 p-3 bg-surface-overlay hover:bg-surface-raised rounded-lg transition-colors"
                    >
                      <span className="text-xl font-serif text-genekey-400 w-8">{gk.keyNumber}</span>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{gk.name}</div>
                        <div className="text-xs text-theme-text-tertiary truncate">
                          {gk.shadow.name} &#8594; {gk.gift.name}
                        </div>
                      </div>
                    </Link>
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
          <Link
            to={`/chakras/${relatedChakra.id}`}
            className="flex items-center gap-4 p-4 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors border border-theme-border-subtle mb-4"
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
          </Link>
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
          <Link to={`/elements/${element.id}`} className="flex items-center gap-4 group">
            <span className="text-4xl">{element.symbol}</span>
            <div>
              <h2 className="font-serif text-xl group-hover:text-theme-text-primary transition-colors">
                {element.name} Element
              </h2>
              <p className="text-theme-text-secondary">{element.corePrinciple}</p>
            </div>
          </Link>
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
                  return (
                    <Link
                      key={sid}
                      to={`/signs/${sid}`}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                        isCurrent
                          ? `${POLARITY_COLORS[sign.substancePolarity].badge} font-semibold cursor-default`
                          : 'bg-surface-overlay text-theme-text-secondary hover:bg-surface-interactive/60'
                      }`}
                    >
                      <span>{s.symbol}</span>
                      <span>{s.name.replace(' ', '')}</span>
                    </Link>
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
  );
}
export default SignDetail;
