import { getAminoAcids, codonRings } from '../data';
import { Link } from 'react-router-dom';
import type { AminoAcid } from '../types';

export function AminoAcids() {
  const acids = getAminoAcids();

  // Group by type
  const essential = acids.filter(a => a.aminoAcidType === 'Essential');
  const nonEssential = acids.filter(a => a.aminoAcidType === 'Non-essential');
  const conditional = acids.filter(a => a.aminoAcidType === 'Conditional');
  const terminator = acids.filter(a => a.aminoAcidType === 'Terminator');

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🧬</span>
          <h1 className="font-serif text-3xl font-medium">Amino Acids</h1>
        </div>
        <p className="text-theme-text-secondary max-w-3xl">
          The 20 amino acids (plus the Stop Codon) are the building blocks of all proteins in the body.
          In the Gene Keys, each amino acid is associated with a Codon Ring—a chemical family of Gene Keys
          that share the same molecular signature. This bridges biochemistry with consciousness,
          showing how physical function mirrors spiritual archetype.
        </p>
      </section>

      {/* Overview Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <div className="text-2xl font-serif text-green-400">{essential.length}</div>
          <div className="text-sm text-theme-text-secondary">Essential</div>
          <div className="text-xs text-theme-text-tertiary mt-1">Must be obtained from diet</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="text-2xl font-serif text-blue-400">{nonEssential.length}</div>
          <div className="text-sm text-theme-text-secondary">Non-essential</div>
          <div className="text-xs text-theme-text-tertiary mt-1">Body can synthesize</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="text-2xl font-serif text-amber-400">{conditional.length}</div>
          <div className="text-sm text-theme-text-secondary">Conditional</div>
          <div className="text-xs text-theme-text-tertiary mt-1">Essential under stress</div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
          <div className="text-2xl font-serif text-purple-400">{terminator.length}</div>
          <div className="text-sm text-theme-text-secondary">Terminator</div>
          <div className="text-xs text-theme-text-tertiary mt-1">Stop signal for translation</div>
        </div>
      </section>

      {/* Essential Amino Acids */}
      <section>
        <h2 className="font-serif text-xl mb-4 flex items-center gap-2">
          <span className="text-green-400">Essential Amino Acids</span>
          <span className="text-sm text-theme-text-tertiary">({essential.length})</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {essential.map((acid) => (
            <AminoAcidCard key={acid.id} acid={acid} />
          ))}
        </div>
      </section>

      {/* Non-essential Amino Acids */}
      <section>
        <h2 className="font-serif text-xl mb-4 flex items-center gap-2">
          <span className="text-blue-400">Non-essential Amino Acids</span>
          <span className="text-sm text-theme-text-tertiary">({nonEssential.length})</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {nonEssential.map((acid) => (
            <AminoAcidCard key={acid.id} acid={acid} />
          ))}
        </div>
      </section>

      {/* Conditional Amino Acids */}
      <section>
        <h2 className="font-serif text-xl mb-4 flex items-center gap-2">
          <span className="text-amber-400">Conditional Amino Acids</span>
          <span className="text-sm text-theme-text-tertiary">({conditional.length})</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {conditional.map((acid) => (
            <AminoAcidCard key={acid.id} acid={acid} />
          ))}
        </div>
      </section>

      {/* Stop Codon */}
      <section>
        <h2 className="font-serif text-xl mb-4 flex items-center gap-2">
          <span className="text-purple-400">Stop Codon (Terminator)</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {terminator.map((acid) => (
            <AminoAcidCard key={acid.id} acid={acid} />
          ))}
        </div>
      </section>

      {/* The Bridge */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h3 className="font-serif text-lg mb-4">The Bridge Between Matter & Consciousness</h3>
        <div className="text-sm text-theme-text-secondary space-y-4">
          <p>
            Each amino acid's physiological function mirrors the consciousness pattern it governs through
            its associated Codon Ring. For example, Arginine—essential for heart function and immune
            response—is linked to the Ring of Humanity, which concerns the sacred wound at the heart
            of human experience.
          </p>
          <p>
            This isn't metaphor but an observation about how the same patterns manifest at different
            scales. The body and psyche are not separate domains but different languages describing
            the same unified reality encoded in our DNA.
          </p>
        </div>
      </section>

      {/* Related Links */}
      <section className="flex gap-4 flex-wrap">
        <Link
          to="/gene-keys/codon-rings"
          className="flex-1 min-w-[200px] p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
        >
          <span className="text-lg">⬡</span>
          <h4 className="font-medium mt-2">Codon Rings</h4>
          <p className="text-sm text-theme-text-secondary mt-1">The 21 chemical families</p>
        </Link>
        <Link
          to="/gene-keys"
          className="flex-1 min-w-[200px] p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
        >
          <span className="text-lg">✧</span>
          <h4 className="font-medium mt-2">Gene Keys</h4>
          <p className="text-sm text-theme-text-secondary mt-1">Explore all 64 Gene Keys</p>
        </Link>
      </section>
    </div>
  );
}

function AminoAcidCard({ acid }: { acid: AminoAcid }) {
  const ring = codonRings.get(acid.codonRingId);
  const geneKeyCount = acid.geneKeyIds.length;

  const typeColors: Record<string, string> = {
    'Essential': 'green',
    'Non-essential': 'blue',
    'Conditional': 'amber',
    'Terminator': 'purple',
  };
  const color = typeColors[acid.aminoAcidType] || 'neutral';

  return (
    <div className={`bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle hover:border-${color}-500/30 transition-colors`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-serif text-lg font-medium">{acid.name}</h3>
          <div className="flex items-center gap-2 text-sm text-theme-text-tertiary">
            <span className="font-mono">{acid.abbreviation}</span>
            <span>({acid.symbol})</span>
          </div>
        </div>
        <span className={`px-2 py-1 bg-${color}-500/10 text-${color}-400 text-xs rounded`}>
          {acid.aminoAcidType}
        </span>
      </div>

      <p className="text-theme-text-secondary text-sm mb-4 line-clamp-3">
        {acid.description}
      </p>

      <div className="space-y-2 text-sm">
        {ring && (
          <div className="flex items-center gap-2">
            <span className="text-theme-text-tertiary">Codon Ring:</span>
            <Link
              to={`/gene-keys/codon-rings/${ring.id}`}
              className="text-genekey-400 hover:text-genekey-300"
            >
              {ring.name}
            </Link>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-theme-text-tertiary">Gene Keys:</span>
          <span className="text-theme-text-secondary">{geneKeyCount} keys</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-theme-border-subtle">
        <p className="text-xs text-theme-text-tertiary italic line-clamp-2">
          {acid.consciousnessQuality.substring(0, 150)}...
        </p>
      </div>
    </div>
  );
}
export default AminoAcids;
