import { Link } from 'react-router-dom';
import { hermeticPrinciples } from '../data';
import type { HermeticPrinciple } from '../types';

export function HermeticPrinciples() {
  const allPrinciples = Array.from(hermeticPrinciples.values()).sort(
    (a, b) => a.number - b.number
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl text-amber-400">⚚</span>
          <h1 className="font-serif text-3xl font-medium">The Hermetic Principles</h1>
        </div>
        <p className="text-theme-text-secondary max-w-3xl">
          The Seven Hermetic Principles from the Kybalion — ancient axioms of reality that underpin
          astrology, alchemy, Human Design, and Gene Keys alike. These are not beliefs but
          <em> operational laws</em> of existence that, when understood and applied, transform the
          practitioner's relationship to every experience.
        </p>
        <p className="text-theme-text-tertiary text-sm mt-2 italic">
          "The lips of wisdom are closed, except to the ears of Understanding." — The Kybalion
        </p>
      </section>

      {/* Principles List */}
      <section className="space-y-4">
        {allPrinciples.map((principle) => (
          <PrincipleRow key={principle.id} principle={principle} />
        ))}
      </section>

      {/* Kybalion Foundation Note */}
      <section className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-xl p-6 border border-amber-500/20">
        <h3 className="font-serif text-lg mb-2 text-amber-300">The Foundation of All Traditions</h3>
        <p className="text-theme-text-secondary text-sm mb-3">
          The Kybalion (1908) distilled the Hermetic teachings attributed to Hermes Trismegistus —
          the mythological synthesis of the Egyptian god Thoth and the Greek Hermes. These seven principles
          appear, in different forms, in virtually every wisdom tradition: as the five elements in
          Taoism, as the Sephirot in Kabbalah, as the tattvas in Vedanta.
        </p>
        <p className="text-theme-text-secondary text-sm">
          In the Cosmic Blueprint system, these principles serve as the <strong className="text-amber-300">
          meta-framework</strong> — the reason the cross-tradition correspondences (sign → chakra → HD gate →
          Gene Key) exist at all. They are one unified reality expressing through multiple languages.
        </p>
      </section>

      {/* Grid of all 7 */}
      <section>
        <h2 className="font-serif text-xl mb-4">All Seven Principles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allPrinciples.map((principle) => (
            <PrincipleCard key={principle.id} principle={principle} />
          ))}
        </div>
      </section>
    </div>
  );
}

function PrincipleRow({ principle }: { principle: HermeticPrinciple }) {
  return (
    <Link
      to={`/hermetic/${principle.id}`}
      className="flex items-start gap-5 p-5 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-amber-500/40 transition-all group"
    >
      {/* Number + Symbol */}
      <div className="flex-shrink-0 text-center w-14">
        <div className="text-3xl text-amber-400 font-serif">{principle.symbol}</div>
        <div className="text-theme-text-muted text-xs mt-1">{principle.number}</div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-serif text-lg text-theme-text-primary group-hover:text-amber-300 transition-colors mb-1">
          {principle.name}
        </h3>
        <p className="text-amber-400/70 text-sm italic mb-2">"{principle.statement}"</p>
        <p className="text-theme-text-secondary text-sm line-clamp-2">{principle.essence}</p>
      </div>

      {/* Latin name badge */}
      <div className="flex-shrink-0">
        <span className="text-xs text-theme-text-muted italic">{principle.latinName}</span>
      </div>
    </Link>
  );
}

function PrincipleCard({ principle }: { principle: HermeticPrinciple }) {
  return (
    <Link
      to={`/hermetic/${principle.id}`}
      className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle hover:border-amber-500/50 hover:bg-surface-base transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl text-amber-400">{principle.symbol}</span>
        <span className="text-xs text-theme-text-muted italic">{principle.latinName}</span>
      </div>

      <h3 className="font-serif text-base text-theme-text-primary group-hover:text-amber-300 transition-colors mb-2">
        {principle.name}
      </h3>

      <p className="text-amber-400/60 text-xs italic mb-3 line-clamp-2">"{principle.statement}"</p>

      <p className="text-theme-text-tertiary text-xs line-clamp-3">{principle.essence}</p>
    </Link>
  );
}

export default HermeticPrinciples;
