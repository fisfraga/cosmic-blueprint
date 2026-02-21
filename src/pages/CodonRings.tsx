import { Link } from 'react-router-dom';
import { getCodonRingsInOrder, geneKeys } from '../data';

export function CodonRings() {
  const codonRings = getCodonRingsInOrder();

  // Filter out broken/duplicate entries (those with "Unknown" theme)
  const validRings = codonRings.filter(ring => ring.theme !== 'Unknown');

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl text-genekey-400">&#9678;</span>
          <h1 className="font-serif text-3xl font-medium">Codon Rings</h1>
        </div>
        <p className="text-theme-text-secondary max-w-3xl">
          The 21 Codon Rings are chemical families that group Gene Keys by their amino acid expression.
          Keys within the same ring share a deep genetic resonance and work together toward a collective purpose.
          Understanding your Codon Ring connections reveals the hidden bonds between different aspects of your design.
        </p>
      </section>

      {/* Stats */}
      <section className="flex gap-4 text-sm">
        <div className="bg-surface-base/50 rounded-lg px-4 py-2 border border-theme-border-subtle">
          <span className="text-genekey-400 font-medium">{validRings.length}</span>
          <span className="text-theme-text-tertiary ml-2">Codon Rings</span>
        </div>
        <div className="bg-surface-base/50 rounded-lg px-4 py-2 border border-theme-border-subtle">
          <span className="text-genekey-400 font-medium">64</span>
          <span className="text-theme-text-tertiary ml-2">Gene Keys</span>
        </div>
      </section>

      {/* Codon Rings Grid */}
      <section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {validRings.map(ring => {
            const memberKeys = ring.geneKeyIds
              .map(id => geneKeys.get(id))
              .filter(Boolean);
            const keyNumbers = memberKeys.map(gk => gk!.keyNumber).sort((a, b) => a - b);

            return (
              <Link
                key={ring.id}
                to={`/gene-keys/codon-rings/${ring.id}`}
                className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle hover:border-genekey-500/50 hover:bg-surface-base transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-serif text-lg text-theme-text-primary group-hover:text-genekey-300 transition-colors">
                    {ring.name}
                  </h3>
                  <span className="text-xs text-theme-text-tertiary bg-surface-raised px-2 py-1 rounded">
                    {memberKeys.length} keys
                  </span>
                </div>

                <p className="text-genekey-400 text-sm mb-3">{ring.theme}</p>

                {ring.collectivePurpose && ring.collectivePurpose !== 'Unknown purpose' && (
                  <p className="text-theme-text-secondary text-sm mb-4 line-clamp-2">
                    {ring.collectivePurpose}
                  </p>
                )}

                {/* Member Key Numbers */}
                <div className="flex flex-wrap gap-1.5">
                  {keyNumbers.map(num => (
                    <span
                      key={num}
                      className="w-7 h-7 flex items-center justify-center text-xs font-medium bg-surface-raised text-genekey-400 rounded"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Understanding Note */}
      <section className="bg-gradient-to-br from-genekey-500/10 to-genekey-600/5 rounded-xl p-6 border border-genekey-500/20">
        <h3 className="font-serif text-lg mb-2 text-genekey-300">Understanding Codon Rings</h3>
        <p className="text-theme-text-secondary text-sm mb-4">
          The Codon Rings represent the genetic underpinning of the Gene Keys system. Each ring is named
          after its core theme and contains Gene Keys that share a similar chemical coding in your DNA.
          The <strong className="text-genekey-300">amino acids</strong> that make up these rings are the
          building blocks of all proteins in your body.
        </p>
        <p className="text-theme-text-secondary text-sm">
          When you have multiple Gene Keys from the same Codon Ring activated in your Hologenetic Profile,
          it amplifies that ring's theme in your life. The rings create a web of interconnection that reveals
          how different aspects of consciousness relate at the deepest genetic level.
        </p>
      </section>
    </div>
  );
}
export default CodonRings;
