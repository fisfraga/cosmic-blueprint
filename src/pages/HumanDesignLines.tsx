import { getHDLines, getProfilesByLine } from '../data';
import { EntityCard } from '../components';
import { Link } from 'react-router-dom';

export function HumanDesignLines() {
  const lines = getHDLines();

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">▵</span>
          <h1 className="font-serif text-3xl font-medium">Human Design Lines</h1>
        </div>
        <p className="text-neutral-400 max-w-3xl">
          The six Lines form the building blocks of the I Ching hexagram and are fundamental to understanding
          your Profile. Each Line carries a distinct theme, gift, and way of engaging with the world.
          Lines 1-3 form the lower trigram (personal), while Lines 4-6 form the upper trigram (transpersonal).
        </p>
      </section>

      {/* Lines Grid */}
      <section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lines.map((line) => (
            <EntityCard key={line.id} entity={line} />
          ))}
        </div>
      </section>

      {/* Lines Overview */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h3 className="font-serif text-lg mb-4">The Six Lines at a Glance</h3>
        <div className="space-y-4">
          {lines.map((line) => {
            const profileCount = getProfilesByLine(line.lineNumber).length;
            return (
              <div key={line.id} className="flex gap-4 items-start border-b border-neutral-800 pb-4 last:border-0 last:pb-0">
                <div className="w-12 h-12 flex items-center justify-center bg-humandesign-500/10 rounded-lg">
                  <span className="text-2xl font-serif text-humandesign-400">{line.lineNumber}</span>
                </div>
                <div className="flex-1">
                  <Link
                    to={`/human-design/lines/${line.id}`}
                    className="font-medium text-neutral-200 hover:text-white transition-colors"
                  >
                    {line.archetype}
                  </Link>
                  <p className="text-neutral-400 text-sm mt-1">{line.theme}</p>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-neutral-500">
                      Trigram: <span className="text-humandesign-400">{line.trigram}</span>
                    </span>
                    <span className="text-neutral-500">
                      In {profileCount} profiles
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trigram Explanation */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h3 className="font-serif text-lg mb-3 text-humandesign-300">Lower Trigram (Lines 1-3)</h3>
          <p className="text-neutral-400 text-sm mb-4">
            The lower trigram represents the personal, introspective, and foundational aspects of life.
            These lines learn primarily through internal processes—investigation, natural talent, and trial and error.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-humandesign-400">1</span>
              <span className="text-neutral-300">Investigator — Foundation through research</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-humandesign-400">2</span>
              <span className="text-neutral-300">Hermit — Natural talent, called out</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-humandesign-400">3</span>
              <span className="text-neutral-300">Martyr — Learning through experience</span>
            </li>
          </ul>
        </div>
        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h3 className="font-serif text-lg mb-3 text-humandesign-300">Upper Trigram (Lines 4-6)</h3>
          <p className="text-neutral-400 text-sm mb-4">
            The upper trigram represents the transpersonal, external, and collective aspects.
            These lines engage primarily through relationships, influence, and leadership.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-humandesign-400">4</span>
              <span className="text-neutral-300">Opportunist — Network and influence</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-humandesign-400">5</span>
              <span className="text-neutral-300">Heretic — Projection and solutions</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-humandesign-400">6</span>
              <span className="text-neutral-300">Role Model — Wisdom through process</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Related Links */}
      <section className="flex gap-4">
        <Link
          to="/human-design/profiles"
          className="flex-1 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-lg">⟁</span>
          <h4 className="font-medium mt-2">Profiles</h4>
          <p className="text-sm text-neutral-400 mt-1">See how lines combine into profiles</p>
        </Link>
        <Link
          to="/human-design"
          className="flex-1 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-lg">⬡</span>
          <h4 className="font-medium mt-2">Gates</h4>
          <p className="text-sm text-neutral-400 mt-1">Each gate has 6 lines</p>
        </Link>
      </section>
    </div>
  );
}
export default HumanDesignLines;
