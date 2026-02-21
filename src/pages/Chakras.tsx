import { Link } from 'react-router-dom';
import { chakras } from '../data';
import { ChakraBodyViz } from '../components/ChakraBodyViz';
import type { Chakra } from '../types';

export function Chakras() {
  const allChakras = Array.from(chakras.values()).sort((a, b) => a.number - b.number);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl text-emerald-400">◎</span>
          <h1 className="font-serif text-3xl font-medium">Chakras</h1>
        </div>
        <p className="text-theme-text-secondary max-w-3xl">
          The seven chakras form an energy map of human consciousness — from the Root's primal belonging
          to the Crown's universal recognition. Through astrological alchemy, each chakra
          corresponds to specific astrological houses, creating a living bridge between the celestial chart
          and the body's own wisdom.
        </p>
      </section>

      {/* Interactive spine visualization + row list side by side */}
      <section>
        <h2 className="font-serif text-xl text-theme-text-secondary mb-4">The Energy Column</h2>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* SVG Spine */}
          <div className="flex-shrink-0 rounded-2xl border border-theme-border-subtle bg-surface-base/40 p-4">
            <p className="text-xs text-theme-text-muted text-center mb-2 uppercase tracking-widest">
              Hover to explore · Click to dive deeper
            </p>
            <ChakraBodyViz />
          </div>

          {/* Chakra rows list */}
          <div className="flex-1 space-y-3 w-full">
            {[...allChakras].reverse().map((chakra) => (
              <ChakraRow key={chakra.id} chakra={chakra} />
            ))}
          </div>
        </div>
      </section>

      {/* House-Chakra Bridge */}
      <section className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl p-6 border border-emerald-500/20">
        <h3 className="font-serif text-lg mb-2 text-emerald-300">Astrological Alchemy</h3>
        <p className="text-theme-text-secondary text-sm mb-4">
          In this synthesis, the 12 astrological houses map onto 7 chakras — creating a direct
          bridge between the natal chart and the body's energy centers. When a planet occupies a house,
          it activates the corresponding chakra. This allows astrological transits to be understood as
          energy activations in the physical and energetic body.
        </p>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          {allChakras.map((chakra) => (
            <div
              key={chakra.id}
              className="flex items-center gap-3 p-3 bg-surface-base/50 rounded-lg border border-theme-border-subtle"
            >
              <div
                className="w-8 h-8 rounded-full flex-shrink-0"
                style={{ backgroundColor: chakra.colorHex + '44', border: `2px solid ${chakra.colorHex}66` }}
              />
              <div>
                <span className="text-theme-text-primary">{chakra.name}</span>
                <span className="text-theme-text-tertiary mx-2">→</span>
                <span className="text-theme-text-secondary">
                  House{chakra.relatedHouses.length > 1 ? 's' : ''} {chakra.relatedHouses.join(', ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full Grid */}
      <section>
        <h2 className="font-serif text-xl mb-4">All Seven Centers</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allChakras.map((chakra) => (
            <ChakraCard key={chakra.id} chakra={chakra} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ChakraRow({ chakra }: { chakra: Chakra }) {
  return (
    <Link
      to={`/chakras/${chakra.id}`}
      className="flex items-center gap-4 p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-emerald-500/40 transition-all group"
    >
      {/* Color dot */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 font-serif"
        style={{ backgroundColor: chakra.colorHex + '33', border: `2px solid ${chakra.colorHex}66` }}
      >
        {chakra.symbol}
      </div>

      {/* Number badge */}
      <div className="w-8 text-center flex-shrink-0">
        <span className="text-theme-text-tertiary text-sm font-mono">{chakra.number}</span>
      </div>

      {/* Name + Sanskrit */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-theme-text-primary font-medium group-hover:text-emerald-300 transition-colors">
            {chakra.name}
          </h3>
          <span className="text-theme-text-tertiary text-sm italic">{chakra.sanskritName}</span>
        </div>
        <p className="text-theme-text-tertiary text-xs truncate">{chakra.lifeTheme}</p>
      </div>

      {/* Houses */}
      <div className="flex-shrink-0 text-right">
        <div className="text-theme-text-tertiary text-xs">House{chakra.relatedHouses.length > 1 ? 's' : ''}</div>
        <div className="text-theme-text-secondary text-sm">{chakra.relatedHouses.join(', ')}</div>
      </div>
    </Link>
  );
}

function ChakraCard({ chakra }: { chakra: Chakra }) {
  return (
    <Link
      to={`/chakras/${chakra.id}`}
      className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle hover:border-emerald-500/50 hover:bg-surface-base transition-all group"
    >
      {/* Color header */}
      <div
        className="h-1.5 rounded-full mb-4"
        style={{ backgroundColor: chakra.colorHex + '80' }}
      />

      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: chakra.colorHex + '33', border: `2px solid ${chakra.colorHex}66` }}
        >
          {chakra.symbol}
        </div>
        <div>
          <h3 className="font-serif text-lg text-theme-text-primary group-hover:text-emerald-300 transition-colors">
            {chakra.name}
          </h3>
          <p className="text-theme-text-tertiary text-xs italic">{chakra.sanskritName}</p>
        </div>
      </div>

      <p className="text-theme-text-secondary text-sm mb-3">{chakra.archetype}</p>

      {/* Constricted → Flowing → Radiant */}
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-16 text-theme-text-tertiary text-xs">Constricted:</span>
          <span className="text-red-400">{chakra.constricted.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-16 text-theme-text-tertiary text-xs">Flowing:</span>
          <span className="text-emerald-400">{chakra.flowing.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-16 text-theme-text-tertiary text-xs">Radiant:</span>
          <span className="text-purple-400">{chakra.radiant.name}</span>
        </div>
      </div>
    </Link>
  );
}

export default Chakras;
