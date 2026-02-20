import { getTrigrams } from '../data';
import { Link } from 'react-router-dom';
import type { Trigram } from '../types';

export function Trigrams() {
  const allTrigrams = getTrigrams();

  // Primary polarities
  const heaven = allTrigrams.find(t => t.id === 'heaven');
  const earth = allTrigrams.find(t => t.id === 'earth');
  const otherTrigrams = allTrigrams.filter(t => t.id !== 'heaven' && t.id !== 'earth');

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">☰</span>
          <h1 className="font-serif text-3xl font-medium">The 8 Trigrams</h1>
        </div>
        <p className="text-neutral-400 max-w-3xl">
          The eight trigrams are the building blocks of the 64 hexagrams of the I Ching.
          Each trigram consists of three lines—either broken (yin) or unbroken (yang)—representing
          fundamental forces of nature. In the Gene Keys system, the trigrams form the upper and
          lower halves of each hexagram, coloring the expression of each Gene Key.
        </p>
      </section>

      {/* Yin-Yang Basics */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h3 className="font-serif text-lg mb-4">The Dance of Yin & Yang</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-neutral-800/50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">━━━</span>
              <span className="font-medium">Yang (Unbroken Line)</span>
            </div>
            <p className="text-neutral-400 text-sm">
              Creative, active, light, masculine principle. Yang energy initiates, expands,
              and moves outward. It is the force of creation and action.
            </p>
          </div>
          <div className="p-4 bg-neutral-800/50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">━ ━</span>
              <span className="font-medium">Yin (Broken Line)</span>
            </div>
            <p className="text-neutral-400 text-sm">
              Receptive, passive, dark, feminine principle. Yin energy receives, contracts,
              and draws inward. It is the force of form and nurturing.
            </p>
          </div>
        </div>
      </section>

      {/* Primary Polarities: Heaven & Earth */}
      <section>
        <h2 className="font-serif text-xl mb-4">The Primal Pair</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {heaven && <TrigramCard trigram={heaven} featured />}
          {earth && <TrigramCard trigram={earth} featured />}
        </div>
      </section>

      {/* The Six Children */}
      <section>
        <h2 className="font-serif text-xl mb-4">The Six Children</h2>
        <p className="text-neutral-400 text-sm mb-4">
          The remaining six trigrams arise from the interaction of Heaven and Earth.
          They form three pairs of sons and daughters, each with complementary qualities.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherTrigrams.map((trigram) => (
            <TrigramCard key={trigram.id} trigram={trigram} />
          ))}
        </div>
      </section>

      {/* Trigram Relationships */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h3 className="font-serif text-lg mb-4">Trigram Correspondence Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-700 text-left">
                <th className="py-2 px-3 text-neutral-400">Trigram</th>
                <th className="py-2 px-3 text-neutral-400">Symbol</th>
                <th className="py-2 px-3 text-neutral-400">Nature</th>
                <th className="py-2 px-3 text-neutral-400">Element</th>
                <th className="py-2 px-3 text-neutral-400 hidden md:table-cell">Direction</th>
                <th className="py-2 px-3 text-neutral-400 hidden md:table-cell">Family</th>
              </tr>
            </thead>
            <tbody>
              {allTrigrams.map((t) => (
                <tr key={t.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                  <td className="py-3 px-3 font-medium">
                    {t.name} ({t.chineseName})
                  </td>
                  <td className="py-3 px-3 text-2xl">{t.symbol}</td>
                  <td className="py-3 px-3 text-neutral-300">{t.nature}</td>
                  <td className="py-3 px-3 text-neutral-400">{t.element}</td>
                  <td className="py-3 px-3 text-neutral-400 hidden md:table-cell">{t.direction}</td>
                  <td className="py-3 px-3 text-neutral-400 hidden md:table-cell">{t.familyMember}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Trigrams in Gene Keys */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h3 className="font-serif text-lg mb-4">Trigrams in the Gene Keys</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-amber-300 mb-2">Upper Trigram</h4>
            <p className="text-neutral-400">
              The upper trigram (formed by lines 4, 5, 6) of a hexagram represents how the Gene Key
              expresses outwardly—how its energy interacts with the world and others. It shows the
              transpersonal and collective dimension.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-teal-300 mb-2">Lower Trigram</h4>
            <p className="text-neutral-400">
              The lower trigram (formed by lines 1, 2, 3) represents the internal foundation—how
              the Gene Key is processed individually and forms the basis for outer expression.
              It shows the personal and introspective dimension.
            </p>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="flex gap-4 flex-wrap">
        <Link
          to="/gene-keys"
          className="flex-1 min-w-[200px] p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-lg">✧</span>
          <h4 className="font-medium mt-2">Gene Keys</h4>
          <p className="text-sm text-neutral-400 mt-1">Explore all 64 hexagrams</p>
        </Link>
        <Link
          to="/gene-keys/lines"
          className="flex-1 min-w-[200px] p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-lg">---</span>
          <h4 className="font-medium mt-2">The 6 Lines</h4>
          <p className="text-sm text-neutral-400 mt-1">Line archetypes within hexagrams</p>
        </Link>
        <Link
          to="/human-design"
          className="flex-1 min-w-[200px] p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-lg">⬡</span>
          <h4 className="font-medium mt-2">Human Design</h4>
          <p className="text-sm text-neutral-400 mt-1">The 64 Gates</p>
        </Link>
      </section>
    </div>
  );
}

function TrigramCard({ trigram, featured = false }: { trigram: Trigram; featured?: boolean }) {
  const elementColors: Record<string, string> = {
    'Metal': 'text-neutral-300',
    'Earth': 'text-amber-400',
    'Wood': 'text-green-400',
    'Water': 'text-blue-400',
    'Fire': 'text-red-400',
  };

  return (
    <div className={`bg-neutral-900/50 rounded-xl p-5 border border-neutral-800 hover:border-neutral-700 transition-colors ${featured ? 'md:p-6' : ''}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl">{trigram.symbol}</div>
        <div>
          <h3 className={`font-serif ${featured ? 'text-xl' : 'text-lg'} font-medium`}>
            {trigram.name}
          </h3>
          <p className="text-neutral-500 text-sm">{trigram.chineseName}</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-4">
          <div>
            <span className="text-neutral-500">Nature: </span>
            <span className="text-neutral-300">{trigram.nature}</span>
          </div>
          <div>
            <span className="text-neutral-500">Element: </span>
            <span className={elementColors[trigram.element] || 'text-neutral-300'}>{trigram.element}</span>
          </div>
        </div>

        <div>
          <span className="text-neutral-500">Image: </span>
          <span className="text-neutral-300">{trigram.image}</span>
        </div>

        <p className="text-neutral-400 text-sm pt-2 border-t border-neutral-800 line-clamp-3">
          {trigram.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {trigram.keywords.slice(0, 4).map((keyword) => (
            <span key={keyword} className="px-2 py-0.5 bg-neutral-800 rounded text-neutral-400 text-xs">
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Trigrams;
