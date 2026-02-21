import { getGKSpheresBySequence } from '../data';
import { EntityCard } from '../components';
import { Link } from 'react-router-dom';
import type { GKSequence } from '../types';

const sequences: { id: GKSequence; name: string; description: string; icon: string; color: string }[] = [
  {
    id: 'Activation',
    name: 'Activation Sequence',
    description: 'The Activation Sequence reveals your life purpose and the path of awakening. It includes your Life\'s Work, Evolution, Radiance, and Purpose spheres.',
    icon: '☉',
    color: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20',
  },
  {
    id: 'Venus',
    name: 'Venus Sequence',
    description: 'The Venus Sequence opens the pathway of the heart, revealing your relationship patterns and the journey to emotional and spiritual intelligence.',
    icon: '♀',
    color: 'from-rose-500/10 to-rose-600/5 border-rose-500/20',
  },
  {
    id: 'Pearl',
    name: 'Pearl Sequence',
    description: 'The Pearl Sequence concerns your prosperity and contribution to the world—your vocation, cultural role, authentic brand, and ultimate flowering.',
    icon: '◎',
    color: 'from-blue-500/10 to-blue-600/5 border-blue-500/20',
  },
];

export function GKSpheres() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">◎</span>
          <h1 className="font-serif text-3xl font-medium">Gene Keys Spheres</h1>
        </div>
        <p className="text-theme-text-secondary max-w-3xl">
          The Spheres are the 13 positions in your Hologenetic Profile where specific Gene Keys are placed.
          They form three sequences—Activation, Venus, and Pearl—each revealing different dimensions
          of your purpose, relationships, and prosperity.
        </p>
      </section>

      {/* Astrology & Gene Keys Connection */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h2 className="font-serif text-xl mb-4">The Astrological Foundation</h2>
        <p className="text-theme-text-secondary text-sm mb-6">
          Gene Keys are calculated from your astrological birth chart. Each sphere corresponds to a specific
          planetary position—either from your natal chart (birth moment) or your design chart (~88 days before birth).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <img
              src="/images/gene-keys/Astrology-Gene-Keys.png"
              alt="Astrology and Gene Keys connection"
              className="w-full rounded-lg border border-theme-border-subtle"
            />
            <p className="text-theme-text-tertiary text-xs text-center">The relationship between Astrology and Gene Keys</p>
          </div>
          <div className="space-y-3">
            <img
              src="/images/gene-keys/Astrology-planets-used-in-Gene-Keys.png"
              alt="Planets used in Gene Keys calculations"
              className="w-full rounded-lg border border-theme-border-subtle"
            />
            <p className="text-theme-text-tertiary text-xs text-center">Planetary sources for each sphere</p>
          </div>
        </div>
      </section>

      {/* Sequences */}
      {sequences.map((sequence) => {
        const spheres = getGKSpheresBySequence(sequence.id);
        return (
          <section key={sequence.id}>
            <div className={`bg-gradient-to-br ${sequence.color} rounded-xl p-6 border mb-4`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{sequence.icon}</span>
                <h2 className="font-serif text-xl">{sequence.name}</h2>
              </div>
              <p className="text-theme-text-secondary text-sm">{sequence.description}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {spheres.map((sphere) => (
                <EntityCard key={sphere.id} entity={sphere} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Overview Table */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h3 className="font-serif text-lg mb-4">All 13 Spheres at a Glance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme-border-subtle text-left">
                <th className="py-2 px-3 text-theme-text-secondary">Sphere</th>
                <th className="py-2 px-3 text-theme-text-secondary">Sequence</th>
                <th className="py-2 px-3 text-theme-text-secondary">Planetary Source</th>
                <th className="py-2 px-3 text-theme-text-secondary hidden md:table-cell">Theme</th>
              </tr>
            </thead>
            <tbody>
              {sequences.flatMap((seq) =>
                getGKSpheresBySequence(seq.id).map((sphere) => (
                  <tr key={sphere.id} className="border-b border-theme-border-subtle hover:bg-surface-overlay">
                    <td className="py-3 px-3">
                      <Link
                        to={`/gene-keys/spheres/${sphere.id}`}
                        className="flex items-center gap-2 text-genekey-400 hover:text-genekey-300"
                      >
                        <span>{sphere.symbol}</span>
                        <span>{sphere.name}</span>
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-theme-text-secondary">{sphere.sequence}</td>
                    <td className="py-3 px-3 text-theme-text-secondary text-xs">{sphere.planetarySource}</td>
                    <td className="py-3 px-3 text-theme-text-secondary hidden md:table-cell">{sphere.theme}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* How to Use */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h3 className="font-serif text-lg mb-4">Working with the Spheres</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-emerald-300 mb-2">Contemplation</h4>
            <p className="text-theme-text-secondary">
              Each sphere holds a Gene Key that you can contemplate. Work with the shadow, gift, and siddhi
              frequencies to unlock the wisdom of each position in your profile.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-rose-300 mb-2">Relationships</h4>
            <p className="text-theme-text-secondary">
              The Venus Sequence spheres reveal your relationship patterns. Understanding these keys
              can transform how you connect with others and yourself.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-blue-300 mb-2">Prosperity</h4>
            <p className="text-theme-text-secondary">
              The Pearl Sequence shows how your gifts can flow into the world as prosperity—not just
              financial, but the full flowering of your contribution.
            </p>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="flex gap-4">
        <Link
          to="/gene-keys"
          className="flex-1 p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
        >
          <span className="text-lg">✧</span>
          <h4 className="font-medium mt-2">Gene Keys</h4>
          <p className="text-sm text-theme-text-secondary mt-1">Explore all 64 Gene Keys</p>
        </Link>
        <Link
          to="/gene-keys/codon-rings"
          className="flex-1 p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
        >
          <span className="text-lg">⬡</span>
          <h4 className="font-medium mt-2">Codon Rings</h4>
          <p className="text-sm text-theme-text-secondary mt-1">The chemical families</p>
        </Link>
      </section>
    </div>
  );
}
export default GKSpheres;
