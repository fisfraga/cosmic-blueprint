import { getClassicalElements, getAlchemicalElements, getSignsByElement } from '../data';
import { Link } from 'react-router-dom';

const elementColors = {
  fire: {
    bg: 'bg-fire-500/10',
    border: 'border-fire-500/30 hover:border-fire-400/50',
    accent: 'text-fire-400',
    gradient: 'from-fire-500/20 to-fire-600/5',
  },
  earth: {
    bg: 'bg-earth-500/10',
    border: 'border-earth-500/30 hover:border-earth-400/50',
    accent: 'text-earth-400',
    gradient: 'from-earth-500/20 to-earth-600/5',
  },
  air: {
    bg: 'bg-air-500/10',
    border: 'border-air-500/30 hover:border-air-400/50',
    accent: 'text-air-400',
    gradient: 'from-air-500/20 to-air-600/5',
  },
  water: {
    bg: 'bg-water-500/10',
    border: 'border-water-500/30 hover:border-water-400/50',
    accent: 'text-water-400',
    gradient: 'from-water-500/20 to-water-600/5',
  },
};

export function Elements() {
  const classicalElements = getClassicalElements();
  const alchemicalElements = getAlchemicalElements();

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🜂</span>
          <h1 className="font-serif text-3xl font-medium">Elements</h1>
        </div>
        <p className="text-theme-text-secondary max-w-3xl">
          The elements are the fundamental building blocks of astrological temperament.
          They describe not what you are made of, but <em className="text-theme-text-secondary">how you are becoming</em>.
          Understanding your elemental balance reveals your natural way of engaging with life.
        </p>
      </section>

      {/* Classical Elements */}
      <section>
        <h2 className="font-serif text-xl mb-4 text-theme-text-secondary">
          Classical Elements
          <span className="text-theme-text-tertiary text-sm ml-2 font-sans">
            The four fundamental modes of being
          </span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {classicalElements.map((element) => {
            const colors = elementColors[element.id as keyof typeof elementColors];
            const signs = getSignsByElement(element.id);

            return (
              <Link
                key={element.id}
                to={`/elements/${element.id}`}
                className={`block p-6 rounded-xl border bg-gradient-to-br transition-all group ${colors?.border} ${colors?.gradient}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <span className={`text-4xl ${colors?.accent}`}>{element.symbol}</span>
                  <div>
                    <h3 className="font-serif text-xl font-medium group-hover:text-theme-text-primary transition-colors">
                      {element.name}
                    </h3>
                    <p className={`text-sm ${colors?.accent}`}>{element.corePrinciple}</p>
                  </div>
                </div>

                <p className="text-theme-text-secondary text-sm mb-4 line-clamp-2">
                  {element.coreQuality}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-theme-text-tertiary text-sm">Signs:</span>
                  <div className="flex gap-2">
                    {signs.map((sign) => (
                      <span key={sign.id} className={`text-lg ${colors?.accent}`} title={sign.name}>
                        {sign.symbol}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {element.keyTraits.slice(0, 4).map((trait) => (
                    <span
                      key={trait}
                      className={`px-2 py-1 rounded text-xs ${colors?.bg} ${colors?.accent}`}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Alchemical Elements */}
      <section>
        <h2 className="font-serif text-xl mb-4 text-theme-text-secondary">
          Alchemical Elements
          <span className="text-theme-text-tertiary text-sm ml-2 font-sans">
            The three principles of transformation
          </span>
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {alchemicalElements.map((element) => (
            <Link
              key={element.id}
              to={`/elements/${element.id}`}
              className="block p-5 rounded-xl border border-theme-border-subtle hover:border-theme-border bg-surface-base/50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl text-theme-text-secondary">{element.symbol}</span>
                <h3 className="font-serif text-lg font-medium group-hover:text-theme-text-primary transition-colors">
                  {element.name}
                </h3>
              </div>
              <p className="text-theme-text-secondary text-sm line-clamp-3">
                {element.coreQuality}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Element Dynamics */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h3 className="font-serif text-lg mb-4">Element Dynamics</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-theme-text-primary mb-2">Complementary Pairs</h4>
            <ul className="space-y-2 text-theme-text-secondary">
              <li className="flex items-center gap-2">
                <span className="text-fire-400">🜂</span> Fire + <span className="text-air-400">🜁</span> Air
                <span className="text-theme-text-tertiary">— Active, extroverted, energizing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-earth-400">🜃</span> Earth + <span className="text-water-400">🜄</span> Water
                <span className="text-theme-text-tertiary">— Receptive, introverted, grounding</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-theme-text-primary mb-2">Challenging Pairs</h4>
            <ul className="space-y-2 text-theme-text-secondary">
              <li className="flex items-center gap-2">
                <span className="text-fire-400">🜂</span> Fire + <span className="text-water-400">🜄</span> Water
                <span className="text-theme-text-tertiary">— Passion meets emotion</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-earth-400">🜃</span> Earth + <span className="text-air-400">🜁</span> Air
                <span className="text-theme-text-tertiary">— Practicality meets ideation</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Elements;
