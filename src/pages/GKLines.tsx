import { getGKLines } from '../data';
import { Link } from 'react-router-dom';
import type { GKLineEntity } from '../types';

export function GKLines() {
  const lines = getGKLines();

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">---</span>
          <h1 className="font-serif text-3xl font-medium">The 6 Lines</h1>
        </div>
        <p className="text-theme-text-secondary max-w-3xl">
          Each of the 64 Gene Keys is expressed through one of 6 lines, adding a specific color and nuance
          to the key's expression. If each Gene Key is like an individual melody, the lines are like
          6 different keys that melody can be played in. Understanding your line activations deepens
          your contemplation of the Gene Keys in your profile.
        </p>
      </section>

      {/* Trigram Structure */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h3 className="font-serif text-lg mb-4">The Hexagram Structure</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-purple-300 font-medium mb-2">Upper Trigram (Lines 4-6)</h4>
            <p className="text-theme-text-secondary text-sm mb-4">
              The upper trigram represents the transpersonal, collective, and outward-facing aspects
              of expression. These lines interact with the world and others.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 p-2 bg-surface-overlay rounded">
                <span className="text-lg font-mono">6</span>
                <span className="text-theme-text-secondary">Role Model - Integration & Wisdom</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-surface-overlay rounded">
                <span className="text-lg font-mono">5</span>
                <span className="text-theme-text-secondary">Heretic - Universal Projection</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-surface-overlay rounded">
                <span className="text-lg font-mono">4</span>
                <span className="text-theme-text-secondary">Opportunist - Network & Relationships</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-amber-300 font-medium mb-2">Lower Trigram (Lines 1-3)</h4>
            <p className="text-theme-text-secondary text-sm mb-4">
              The lower trigram represents the personal, foundational, and inward-facing aspects.
              These lines deal with self-discovery and individual growth.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 p-2 bg-surface-overlay rounded">
                <span className="text-lg font-mono">3</span>
                <span className="text-theme-text-secondary">Martyr - Trial & Error Learning</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-surface-overlay rounded">
                <span className="text-lg font-mono">2</span>
                <span className="text-theme-text-secondary">Hermit - Natural Calling</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-surface-overlay rounded">
                <span className="text-lg font-mono">1</span>
                <span className="text-theme-text-secondary">Investigator - Foundation & Research</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Line Cards */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lines.map((line) => (
          <LineCard key={line.id} line={line} />
        ))}
      </section>

      {/* Overview Table */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h3 className="font-serif text-lg mb-4">Lines at a Glance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme-border-subtle text-left">
                <th className="py-2 px-3 text-theme-text-secondary">Line</th>
                <th className="py-2 px-3 text-theme-text-secondary">Archetype</th>
                <th className="py-2 px-3 text-theme-text-secondary">Theme</th>
                <th className="py-2 px-3 text-theme-text-secondary hidden md:table-cell">Gift</th>
                <th className="py-2 px-3 text-theme-text-secondary hidden md:table-cell">Shadow</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.id} className="border-b border-theme-border-subtle hover:bg-surface-overlay">
                  <td className="py-3 px-3">
                    <span className="text-genekey-400 font-mono text-lg">{line.lineNumber}</span>
                  </td>
                  <td className="py-3 px-3 font-medium">{line.archetype}</td>
                  <td className="py-3 px-3 text-theme-text-secondary">{line.theme}</td>
                  <td className="py-3 px-3 text-theme-text-secondary hidden md:table-cell text-xs">{line.gift.substring(0, 80)}...</td>
                  <td className="py-3 px-3 text-theme-text-secondary hidden md:table-cell text-xs">{line.shadow.substring(0, 80)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Working with Lines */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h3 className="font-serif text-lg mb-4">Working with Your Lines</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-genekey-300 mb-2">In Your Profile</h4>
            <p className="text-theme-text-secondary">
              Each sphere in your Hologenetic Profile has a Gene Key with a specific line. For example,
              if your Life's Work is Gene Key 42.3, the ".3" indicates Line 3 (the Martyr), adding its
              experiential learning quality to the Gift of Detachment.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-genekey-300 mb-2">Contemplation</h4>
            <p className="text-theme-text-secondary">
              When contemplating a Gene Key with its line, consider how the line's archetype colors
              the shadow, gift, and siddhi. A Line 1 expression will seek to understand deeply,
              while a Line 5 will feel called to share universally.
            </p>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="flex gap-4 flex-wrap">
        <Link
          to="/gene-keys"
          className="flex-1 min-w-[200px] p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
        >
          <span className="text-lg">✧</span>
          <h4 className="font-medium mt-2">Gene Keys</h4>
          <p className="text-sm text-theme-text-secondary mt-1">Explore all 64 Gene Keys</p>
        </Link>
        <Link
          to="/gene-keys/spheres"
          className="flex-1 min-w-[200px] p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
        >
          <span className="text-lg">◎</span>
          <h4 className="font-medium mt-2">Spheres</h4>
          <p className="text-sm text-theme-text-secondary mt-1">The 13 positions in your profile</p>
        </Link>
        <Link
          to="/human-design/lines"
          className="flex-1 min-w-[200px] p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
        >
          <span className="text-lg">▵</span>
          <h4 className="font-medium mt-2">HD Lines</h4>
          <p className="text-sm text-theme-text-secondary mt-1">Lines in Human Design</p>
        </Link>
      </section>
    </div>
  );
}

function LineCard({ line }: { line: GKLineEntity }) {
  const trigramColor = line.trigram === 'Lower' ? 'amber' : 'purple';

  return (
    <div className={`bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle hover:border-${trigramColor}-500/30 transition-colors`}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-lg bg-${trigramColor}-500/10 flex items-center justify-center`}>
          <span className={`text-2xl font-mono text-${trigramColor}-400`}>{line.lineNumber}</span>
        </div>
        <div>
          <h3 className="font-serif text-lg font-medium">{line.name}</h3>
          <p className="text-theme-text-secondary text-sm">{line.archetype}</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <span className="text-theme-text-tertiary">Theme: </span>
          <span className="text-theme-text-secondary">{line.theme}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {line.keywords.slice(0, 4).map((keyword) => (
            <span key={keyword} className="px-2 py-1 bg-surface-raised rounded text-theme-text-secondary text-xs">
              {keyword}
            </span>
          ))}
        </div>
        <div className="pt-3 border-t border-theme-border-subtle">
          <p className="text-theme-text-secondary text-xs italic">"{line.contemplationTheme}"</p>
        </div>
      </div>
    </div>
  );
}
export default GKLines;
