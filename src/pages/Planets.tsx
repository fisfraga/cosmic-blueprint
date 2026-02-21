import { Link } from 'react-router-dom';
import { getTraditionalPlanets, getModernPlanets, points } from '../data';
import { EntityCard } from '../components/EntityCard';
import { getPlacementByPlanetId } from '../data/userProfile';

// Group points by type for display
const keyPoints = ['ascendant', 'midheaven', 'north-node', 'south-node'];
const otherPoints = ['chiron', 'lilith', 'part-of-fortune', 'vertex'];

export function Planets() {
  const traditionalPlanets = getTraditionalPlanets();
  const modernPlanets = getModernPlanets();
  const allPoints = Array.from(points.values());

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">☉</span>
          <h1 className="font-serif text-3xl font-medium">Planets</h1>
        </div>
        <p className="text-theme-text-secondary max-w-3xl">
          The planets are the living archetypes that animate your psyche—psychological forces
          that express through different signs and houses. Each planet represents a distinct
          type of energy and motivation within you.
        </p>
      </section>

      {/* Traditional Planets */}
      <section>
        <h2 className="font-serif text-xl mb-4 text-theme-text-secondary">
          Traditional Planets
          <span className="text-theme-text-tertiary text-sm ml-2 font-sans">
            The classical seven + Saturn's transcendent pair
          </span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {traditionalPlanets.map((planet) => (
            <EntityCard key={planet.id} entity={planet} />
          ))}
        </div>
      </section>

      {/* Modern Planets */}
      <section>
        <h2 className="font-serif text-xl mb-4 text-theme-text-secondary">
          Modern Planets
          <span className="text-theme-text-tertiary text-sm ml-2 font-sans">
            The outer planets of transformation
          </span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modernPlanets.map((planet) => (
            <EntityCard key={planet.id} entity={planet} />
          ))}
        </div>
      </section>

      {/* Astrological Points - Key Points */}
      <section>
        <div className="flex items-center gap-3 mb-2 mt-8">
          <span className="text-3xl">☊</span>
          <h2 className="font-serif text-2xl font-medium">Astrological Points</h2>
        </div>
        <p className="text-theme-text-secondary max-w-3xl mb-6">
          Beyond planets, these sensitive points in your chart reveal your soul's direction,
          public purpose, core wounds, and hidden powers. They mark key intersections
          of celestial and earthly energies.
        </p>

        <h3 className="font-serif text-xl mb-4 text-theme-text-secondary">
          Key Points
          <span className="text-theme-text-tertiary text-sm ml-2 font-sans">
            The Angles & Lunar Nodes
          </span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {allPoints
            .filter(p => keyPoints.includes(p.id))
            .sort((a, b) => keyPoints.indexOf(a.id) - keyPoints.indexOf(b.id))
            .map((point) => {
              const placement = getPlacementByPlanetId(point.id);
              return (
                <Link
                  key={point.id}
                  to={`/planets/${point.id}`}
                  className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle hover:border-purple-500/50 hover:bg-surface-base transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{point.symbol}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-lg text-theme-text-primary group-hover:text-purple-300 transition-colors">
                        {point.name}
                      </h4>
                      <p className="text-theme-text-secondary text-sm mb-2">{point.archetype}</p>
                      {placement && (
                        <div className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded inline-block">
                          Your {point.name}: {placement.signId.charAt(0).toUpperCase() + placement.signId.slice(1)} in House {placement.houseNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>

        <h3 className="font-serif text-xl mb-4 text-theme-text-secondary">
          Other Points
          <span className="text-theme-text-tertiary text-sm ml-2 font-sans">
            Wounds, Shadows & Fortune
          </span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {allPoints
            .filter(p => otherPoints.includes(p.id))
            .sort((a, b) => otherPoints.indexOf(a.id) - otherPoints.indexOf(b.id))
            .map((point) => {
              const placement = getPlacementByPlanetId(point.id);
              return (
                <Link
                  key={point.id}
                  to={`/planets/${point.id}`}
                  className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle hover:border-purple-500/50 hover:bg-surface-base transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{point.symbol}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-lg text-theme-text-primary group-hover:text-purple-300 transition-colors">
                        {point.name}
                      </h4>
                      <p className="text-theme-text-secondary text-sm mb-2">{point.archetype}</p>
                      {placement && (
                        <div className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded inline-block">
                          Your {point.name}: {placement.signId.charAt(0).toUpperCase() + placement.signId.slice(1)} in House {placement.houseNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>

      {/* Understanding Note */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h3 className="font-serif text-lg mb-2">Understanding Planetary Importance</h3>
        <p className="text-theme-text-secondary text-sm">
          Planets are rated by importance (1-4) based on their influence in natal chart interpretation.
          The luminaries (Sun and Moon) and Saturn are rated highest (4) as they form the core
          of identity and life lessons. Personal planets (Mercury, Venus, Mars, Jupiter) are rated (2)
          as they color daily experience. Generational planets (Uranus, Neptune, Pluto) are rated (1)
          as they describe collective trends more than individual traits.
        </p>
      </section>

      {/* Points Understanding Note */}
      <section className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-6 border border-purple-500/20">
        <h3 className="font-serif text-lg mb-2 text-purple-300">Understanding Astrological Points</h3>
        <p className="text-theme-text-secondary text-sm">
          Unlike planets which are physical bodies, astrological points are calculated positions
          that hold profound meaning. The <strong className="text-purple-300">Ascendant</strong> and <strong className="text-purple-300">Midheaven</strong> are
          the most personal points, changing every few minutes. The <strong className="text-purple-300">Lunar Nodes</strong> reveal
          your soul's evolutionary path. <strong className="text-purple-300">Chiron</strong> shows your core wound and healing gift,
          while <strong className="text-purple-300">Lilith</strong> represents your wild, untamed power. The <strong className="text-purple-300">Part of Fortune</strong> indicates
          where you find natural success, and the <strong className="text-purple-300">Vertex</strong> marks fated encounters.
        </p>
      </section>
    </div>
  );
}
export default Planets;
