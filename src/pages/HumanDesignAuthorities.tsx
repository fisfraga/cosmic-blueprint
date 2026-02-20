import { getHDAuthorities, hdCenters } from '../data';
import { EntityCard } from '../components';
import { Link } from 'react-router-dom';

export function HumanDesignAuthorities() {
  const authorities = getHDAuthorities();

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">⌖</span>
          <h1 className="font-serif text-3xl font-medium">Human Design Authority</h1>
        </div>
        <p className="text-neutral-400 max-w-3xl">
          Your Authority is your inner decision-making compass—the reliable way your body
          communicates what's correct for you. While Strategy tells you <em className="text-neutral-300">how to engage</em> with
          life, Authority tells you <em className="text-neutral-300">how to make decisions</em>.
        </p>
        <p className="text-neutral-500 text-sm mt-2 italic">
          "Authority is never about the mind. It's about the body's intelligence."
        </p>
      </section>

      {/* Authorities Grid */}
      <section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {authorities.map((authority) => (
            <EntityCard key={authority.id} entity={authority} />
          ))}
        </div>
      </section>

      {/* Authority Overview */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h3 className="font-serif text-lg mb-4">Understanding Authority</h3>
        <div className="space-y-4 text-sm">
          {authorities.map((authority) => {
            const center = authority.centerId ? hdCenters.get(authority.centerId) : null;
            return (
              <div key={authority.id} className="flex gap-4 items-start">
                <div className="w-16 text-center">
                  <span className="text-2xl">{authority.symbol}</span>
                  <p className="text-xs text-neutral-500 mt-1">{authority.percentage}</p>
                </div>
                <div className="flex-1">
                  <Link
                    to={`/human-design/authorities/${authority.id}`}
                    className="font-medium text-neutral-200 hover:text-white transition-colors"
                  >
                    {authority.name}
                  </Link>
                  {authority.alternativeNames.length > 0 && (
                    <span className="text-neutral-500 text-xs ml-2">
                      ({authority.alternativeNames.join(', ')})
                    </span>
                  )}
                  <p className="text-neutral-400 mt-1">{authority.decisionProcess.slice(0, 150)}...</p>
                  <div className="flex gap-4 mt-2 text-xs">
                    {center && (
                      <span className="text-neutral-500">
                        Center: <span className="text-humandesign-400">{center.name}</span>
                      </span>
                    )}
                    <span className="text-neutral-500">
                      Timeframe: <span className="text-neutral-300">{authority.timeframe}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Authority Hierarchy */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h3 className="font-serif text-lg mb-4">Authority Hierarchy</h3>
        <p className="text-neutral-400 mb-4 text-sm">
          Authority is determined by which centers are defined in your chart. If multiple centers
          are defined, the one highest in this hierarchy determines your authority:
        </p>
        <div className="space-y-2">
          {[
            { name: 'Solar Plexus (Emotional)', desc: 'If defined, always takes precedence', pct: '~50%' },
            { name: 'Sacral', desc: 'For Generators/MGs with undefined Solar Plexus', pct: '~35%' },
            { name: 'Spleen', desc: 'Instant intuitive knowing', pct: '~11%' },
            { name: 'Heart/Ego', desc: 'What do I truly want?', pct: '~1%' },
            { name: 'G Center (Self-Projected)', desc: 'Projectors with G to Throat', pct: '~3%' },
            { name: 'Mental (None/Outer)', desc: 'Mental Projectors—talk it through', pct: '~3%' },
            { name: 'Lunar', desc: 'Reflectors only—28 day cycle', pct: '~1%' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-2 border-b border-neutral-800 last:border-0">
              <span className="w-6 h-6 flex items-center justify-center bg-humandesign-500/20 text-humandesign-400 rounded text-sm">
                {i + 1}
              </span>
              <div className="flex-1">
                <span className="text-neutral-200">{item.name}</span>
                <span className="text-neutral-500 text-sm ml-2">— {item.desc}</span>
              </div>
              <span className="text-neutral-500 text-xs">{item.pct}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Important Note */}
      <section className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-xl p-6 border border-amber-500/20">
        <h3 className="font-serif text-lg mb-3 text-amber-300">The Mind Is Not Authority</h3>
        <p className="text-neutral-300 text-sm">
          In Human Design, the mind is never the authority for making decisions—it's meant for
          outer expression, processing information, and sharing insights. Your authority is always
          a body-based intelligence that operates beneath the mental chatter. Learning to trust
          your authority over your mind is one of the most transformative aspects of living your design.
        </p>
      </section>

      {/* Related Links */}
      <section className="flex gap-4">
        <Link
          to="/human-design/types"
          className="flex-1 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-lg">◉</span>
          <h4 className="font-medium mt-2">Types</h4>
          <p className="text-sm text-neutral-400 mt-1">Learn about the five HD types</p>
        </Link>
        <Link
          to="/human-design/centers"
          className="flex-1 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-lg">⚬</span>
          <h4 className="font-medium mt-2">Centers</h4>
          <p className="text-sm text-neutral-400 mt-1">Explore the nine energy centers</p>
        </Link>
      </section>
    </div>
  );
}
export default HumanDesignAuthorities;
