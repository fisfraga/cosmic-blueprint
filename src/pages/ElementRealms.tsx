import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getClassicalElements, getSignsByElement, elements } from '../data';
import type { Element } from '../types';

const elementStyles = {
  fire: {
    gradient: 'from-fire-500/30 via-fire-600/20 to-transparent',
    border: 'border-fire-500/40',
    glow: 'shadow-fire-500/20 shadow-lg',
    text: 'text-fire-400',
    bg: 'bg-fire-500/10',
  },
  earth: {
    gradient: 'from-earth-500/30 via-earth-600/20 to-transparent',
    border: 'border-earth-500/40',
    glow: 'shadow-earth-500/20 shadow-lg',
    text: 'text-earth-400',
    bg: 'bg-earth-500/10',
  },
  air: {
    gradient: 'from-air-500/30 via-air-600/20 to-transparent',
    border: 'border-air-500/40',
    glow: 'shadow-air-500/20 shadow-lg',
    text: 'text-air-400',
    bg: 'bg-air-500/10',
  },
  water: {
    gradient: 'from-water-500/30 via-water-600/20 to-transparent',
    border: 'border-water-500/40',
    glow: 'shadow-water-500/20 shadow-lg',
    text: 'text-water-400',
    bg: 'bg-water-500/10',
  },
};

function ElementRealm({ element }: { element: Element }) {
  const signs = getSignsByElement(element.id);
  const styles = elementStyles[element.id as keyof typeof elementStyles];

  if (!styles) return null;

  return (
    <section className={`rounded-2xl border ${styles.border} ${styles.glow} overflow-hidden`}>
      {/* Realm Header */}
      <div className={`bg-gradient-to-br ${styles.gradient} p-6`}>
        <Link to={`/elements/${element.id}`} className="flex items-center gap-4 group">
          <span className="text-5xl">{element.symbol}</span>
          <div>
            <h2 className="font-serif text-2xl group-hover:text-theme-text-primary transition-colors">
              {element.name} Realm
            </h2>
            <p className={`text-sm ${styles.text}`}>{element.corePrinciple}</p>
          </div>
        </Link>
      </div>

      {/* Signs */}
      <div className="p-4 bg-surface-base/50">
        <div className="grid md:grid-cols-3 gap-3">
          {signs.map((sign) => (
            <Link
              key={sign.id}
              to={`/signs/${sign.id}`}
              className={`flex items-center gap-3 p-4 rounded-xl border ${styles.border} ${styles.bg} hover:bg-opacity-20 transition-all group`}
            >
              <span className="text-3xl">{sign.symbol}</span>
              <div>
                <h3 className="font-serif text-lg group-hover:text-theme-text-primary transition-colors">
                  {sign.name}
                </h3>
                <p className="text-theme-text-secondary text-sm">{sign.signModality}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Key Traits */}
        <div className="mt-4 pt-4 border-t border-theme-border-subtle">
          <h3 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">Key Traits</h3>
          <div className="flex flex-wrap gap-2">
            {element.keyTraits.slice(0, 5).map((trait, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded text-xs ${styles.bg} ${styles.text}`}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ElementRealms() {
  const classicalElements = getClassicalElements();
  const [showAlchemical, setShowAlchemical] = useState(false);
  const alchemicalElements = Array.from(elements.values()).filter(
    (e) => e.elementCategory === 'Alchemical'
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="text-center">
        <h1 className="font-serif text-3xl font-medium mb-2">Element Realms</h1>
        <p className="text-theme-text-secondary max-w-2xl mx-auto">
          Explore the zodiac organized by elemental energies. Each realm contains three signs
          that share fundamental qualities of expression.
        </p>
      </section>

      {/* Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg bg-surface-base p-1 border border-theme-border-subtle">
          <button
            onClick={() => setShowAlchemical(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !showAlchemical ? 'bg-surface-interactive text-white' : 'text-theme-text-secondary hover:text-theme-text-primary'
            }`}
          >
            Classical (4)
          </button>
          <button
            onClick={() => setShowAlchemical(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showAlchemical ? 'bg-surface-interactive text-white' : 'text-theme-text-secondary hover:text-theme-text-primary'
            }`}
          >
            Alchemical (3)
          </button>
        </div>
      </div>

      {/* Classical Elements Grid */}
      {!showAlchemical && (
        <div className="grid md:grid-cols-2 gap-6">
          {classicalElements.map((element) => (
            <ElementRealm key={element.id} element={element} />
          ))}
        </div>
      )}

      {/* Alchemical Elements */}
      {showAlchemical && (
        <div className="space-y-8">
          <div className="text-center">
            <p className="text-theme-text-secondary max-w-2xl mx-auto text-sm">
              The alchemical view divides the zodiac into three phases of transformation:
              Sulphur (manifestation), Salt (integration), and Mercury (expansion).
            </p>
          </div>

          <div className="grid gap-6">
            {alchemicalElements.map((element) => {
              const associatedSigns = element.zodiacSignIds || [];
              return (
                <section
                  key={element.id}
                  className="rounded-2xl border border-theme-border-subtle bg-surface-base/50 overflow-hidden"
                >
                  <div className="p-6 bg-gradient-to-br from-neutral-800/50 to-transparent">
                    <Link to={`/elements/${element.id}`} className="flex items-center gap-4 group">
                      <span className="text-4xl">{element.symbol}</span>
                      <div>
                        <h2 className="font-serif text-xl group-hover:text-theme-text-primary transition-colors">
                          {element.name}
                        </h2>
                        <p className="text-theme-text-secondary text-sm">{element.corePrinciple}</p>
                      </div>
                    </Link>
                  </div>

                  <div className="p-4">
                    <p className="text-theme-text-secondary text-sm mb-4">{element.coreQuality}</p>
                    {associatedSigns.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {associatedSigns.map((signId) => {
                          const sign = Array.from(elements.values()).find((s) => s.id === signId);
                          return sign ? (
                            <span key={signId} className="px-2 py-1 bg-surface-raised rounded text-sm">
                              {sign.symbol} {sign.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}

      {/* Element Dynamics */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h2 className="font-serif text-xl mb-4">Element Dynamics</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-theme-text-secondary">
          <div>
            <h3 className="font-medium text-theme-text-primary mb-2">Complementary Pairs</h3>
            <ul className="space-y-1">
              <li>
                <span className="text-fire-400">Fire</span> + <span className="text-air-400">Air</span> = Active, expressive energy
              </li>
              <li>
                <span className="text-earth-400">Earth</span> + <span className="text-water-400">Water</span> = Receptive, nurturing energy
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-theme-text-primary mb-2">Challenging Pairs</h3>
            <ul className="space-y-1">
              <li>
                <span className="text-fire-400">Fire</span> / <span className="text-water-400">Water</span> = Steam or extinguishment
              </li>
              <li>
                <span className="text-earth-400">Earth</span> / <span className="text-air-400">Air</span> = Grounding or limitation
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
export default ElementRealms;
