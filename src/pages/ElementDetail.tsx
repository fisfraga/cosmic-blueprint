import { useParams, Link } from 'react-router-dom';
import { elements, signs, geneKeys } from '../data';
import { EntityCard } from '../components/EntityCard';
import { elementColors, type ElementColorKey } from '../styles';

export function ElementDetail() {
  const { id } = useParams<{ id: string }>();
  const element = id ? elements.get(id) : undefined;

  if (!element) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Element Not Found</h1>
        <Link to="/elements" className="text-air-400 hover:underline">
          Back to Elements
        </Link>
      </div>
    );
  }

  // Get signs of this element
  const elementSigns = Array.from(signs.values())
    .filter((s) => s.elementId === element.id)
    .sort((a, b) => a.orderInZodiac - b.orderInZodiac);

  // Gene Keys associated with this element's signs
  const elementSignIds = new Set(elementSigns.map((s) => s.id));
  const elementGeneKeys = Array.from(geneKeys.values())
    .filter((gk) => gk.tropicalSignId && elementSignIds.has(gk.tropicalSignId))
    .sort((a, b) => a.keyNumber - b.keyNumber);

  const colors = elementColors[element.id as ElementColorKey] || elementColors.fire;
  const isAlchemical = element.elementCategory === 'Alchemical';

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className={`text-center py-10 rounded-2xl bg-gradient-to-br border ${colors.gradient} ${colors.border}`}>
        <div className="text-7xl mb-4">{element.symbol}</div>
        <h1 className="font-serif text-4xl font-medium mb-2">{element.name}</h1>
        <p className={`text-xl italic ${colors.text}`}>{element.corePrinciple}</p>
        <div className="flex items-center justify-center gap-4 mt-4 text-sm text-theme-text-secondary">
          <span className={`px-3 py-1 rounded-full ${colors.bg}`}>
            {element.elementCategory} Element
          </span>
          <span className="px-3 py-1 bg-surface-overlay rounded-full">
            {element.coreQuality}
          </span>
        </div>
      </header>

      {/* Core Quality */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h2 className="font-serif text-xl mb-4">Core Quality</h2>
        <p className="text-theme-text-secondary text-lg leading-relaxed">{element.coreQuality}</p>
      </section>

      {/* Key Traits */}
      <section className={`rounded-xl p-6 border bg-gradient-to-br ${colors.gradient} ${colors.border}`}>
        <h2 className="font-serif text-xl mb-4">Key Traits</h2>
        <div className="flex flex-wrap gap-2">
          {element.keyTraits.map((trait, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-surface-overlay rounded-lg text-theme-text-primary"
            >
              {trait}
            </span>
          ))}
        </div>
      </section>

      {/* Recognition Pattern */}
      {element.recognitionPattern && element.recognitionPattern.length > 0 && (
        <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl mb-4">How to Recognize {element.name}</h2>
          <ul className="space-y-2">
            {element.recognitionPattern.map((pattern, index) => (
              <li key={index} className="flex gap-3 text-theme-text-secondary">
                <span className={colors.text}>•</span>
                <span>{pattern}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Modality Expressions */}
      {!isAlchemical && element.modalityExpression && (
        <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl mb-4">Modality Expressions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {element.modalityExpression.cardinal && (
              <div className="p-4 bg-surface-overlay rounded-lg">
                <h3 className="font-medium text-fire-400 mb-2">Cardinal</h3>
                <p className="text-theme-text-secondary text-sm">{element.modalityExpression.cardinal}</p>
              </div>
            )}
            {element.modalityExpression.fixed && (
              <div className="p-4 bg-surface-overlay rounded-lg">
                <h3 className="font-medium text-earth-400 mb-2">Fixed</h3>
                <p className="text-theme-text-secondary text-sm">{element.modalityExpression.fixed}</p>
              </div>
            )}
            {element.modalityExpression.mutable && (
              <div className="p-4 bg-surface-overlay rounded-lg">
                <h3 className="font-medium text-air-400 mb-2">Mutable</h3>
                <p className="text-theme-text-secondary text-sm">{element.modalityExpression.mutable}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Shadow Side */}
      <section className="bg-gradient-to-br from-fire-500/5 to-fire-600/5 rounded-xl p-6 border border-fire-500/20">
        <h2 className="font-serif text-xl mb-4 text-fire-400">Shadow Expression</h2>
        <p className="text-theme-text-secondary leading-relaxed">{element.shadowSide}</p>
      </section>

      {/* Balancing Practices */}
      {element.balancingPractice && (
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
            <h2 className="font-serif text-lg mb-3 text-water-400">To Increase {element.name}</h2>
            <p className="text-theme-text-secondary text-sm leading-relaxed">{element.balancingPractice.toIncrease}</p>
          </section>
          <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
            <h2 className="font-serif text-lg mb-3 text-fire-400">To Balance Excess</h2>
            <p className="text-theme-text-secondary text-sm leading-relaxed">{element.balancingPractice.toDecrease}</p>
          </section>
        </div>
      )}

      {/* Element Dynamics */}
      {element.elementDynamics && (
        <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl mb-4">Element Dynamics</h2>
          <p className="text-theme-text-secondary leading-relaxed">{element.elementDynamics}</p>
        </section>
      )}

      {/* Signs of this Element */}
      {elementSigns.length > 0 && (
        <section>
          <h2 className="font-serif text-xl mb-4">{element.name} Signs</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {elementSigns.map((sign) => (
              <EntityCard key={sign.id} entity={sign} />
            ))}
          </div>
        </section>
      )}

      {/* For alchemical elements: show signs by zodiacSignIds */}
      {isAlchemical && element.zodiacSignIds && element.zodiacSignIds.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl font-semibold text-theme-text-primary mb-6">
            Signs of the {element.name} Principle
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {element.zodiacSignIds.map((sid) => {
              const s = signs.get(sid);
              if (!s) return null;
              const polarityColors: Record<string, string> = {
                yang:   'border-amber-500/30 bg-amber-500/10',
                bridge: 'border-emerald-500/30 bg-emerald-500/10',
                yin:    'border-indigo-500/30 bg-indigo-500/10',
              };
              const polarityText: Record<string, string> = {
                yang: 'text-amber-400',
                bridge: 'text-emerald-400',
                yin: 'text-indigo-400',
              };
              const colorClass = polarityColors[s.substancePolarity] ?? 'border-theme-border-subtle bg-surface-raised/30';
              const textClass = polarityText[s.substancePolarity] ?? 'text-theme-text-secondary';
              return (
                <Link
                  key={sid}
                  to={`/signs/${sid}`}
                  className={`rounded-xl border p-4 text-center transition-colors hover:bg-surface-interactive/30 ${colorClass}`}
                >
                  <div className="text-3xl mb-2">{s.symbol}</div>
                  <div className="font-semibold text-theme-text-primary text-sm">{s.name}</div>
                  <div className={`text-xs mt-1 ${textClass}`}>{s.keyPhrase}</div>
                  <div className="text-xs text-theme-text-tertiary mt-1">House {s.houseRuled}</div>
                </Link>
              );
            })}
          </div>
          {/* Polarity explanation */}
          <div className="mt-4 rounded-lg border border-theme-border-subtle/40 bg-surface-raised/20 p-4">
            <p className="text-sm text-theme-text-secondary">{element.coreQuality}</p>
          </div>
        </section>
      )}

      {/* Gene Keys of this Element */}
      {elementGeneKeys.length > 0 && (
        <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl mb-2">Gene Keys</h2>
          <p className="text-theme-text-tertiary text-sm mb-4">
            These Gene Keys fall within the zodiac degrees of {element.name} signs — their transformation frequency resonates with this elemental quality.
          </p>
          <div className="flex flex-wrap gap-2">
            {elementGeneKeys.map((gk) => (
              <Link
                key={gk.id}
                to={`/gene-keys/${gk.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-genekey-500/10 hover:bg-genekey-500/20 rounded-lg transition-colors text-sm group"
              >
                <span className={`font-serif font-medium ${colors.text}`}>{gk.keyNumber}</span>
                <span className="text-theme-text-secondary">·</span>
                <span className="text-theme-text-secondary group-hover:text-theme-text-primary transition-colors">{gk.name}</span>
                <span className="text-theme-text-muted text-xs ml-1">
                  {gk.gift.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Navigation */}
      <nav className="flex justify-between pt-6 border-t border-theme-border-subtle">
        <Link to="/elements" className="text-theme-text-secondary hover:text-theme-text-primary transition-colors">
          &larr; All Elements
        </Link>
      </nav>
    </div>
  );
}
export default ElementDetail;
