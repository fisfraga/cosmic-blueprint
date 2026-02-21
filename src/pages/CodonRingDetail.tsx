import { useParams, Link } from 'react-router-dom';
import { codonRings, getGeneKeysByCodonRing, getAminoAcidByCodonRing, hdGates } from '../data';

export function CodonRingDetail() {
  const { id } = useParams<{ id: string }>();
  const ring = id ? codonRings.get(id) : undefined;

  if (!ring) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Codon Ring Not Found</h1>
        <Link to="/gene-keys/codon-rings" className="text-genekey-400 hover:underline">
          Back to Codon Rings
        </Link>
      </div>
    );
  }

  const memberKeys = getGeneKeysByCodonRing(ring.id);
  const aminoAcid = getAminoAcidByCodonRing(ring.id);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center py-8">
        <div className="text-5xl mb-4">&#9678;</div>
        <h1 className="font-serif text-4xl font-medium mb-2">{ring.name}</h1>
        <p className="text-xl text-genekey-400 mb-4">{ring.theme}</p>

        {/* Member Key Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {memberKeys.map(gk => (
            <span
              key={gk.id}
              className="w-10 h-10 flex items-center justify-center text-sm font-medium bg-genekey-500/20 text-genekey-400 rounded-full"
            >
              {gk.keyNumber}
            </span>
          ))}
        </div>
      </header>

      {/* Collective Purpose */}
      {ring.collectivePurpose && ring.collectivePurpose !== 'Unknown purpose' && (
        <section className="bg-gradient-to-br from-genekey-500/10 to-genekey-600/5 rounded-xl p-6 border border-genekey-500/20 text-center">
          <h2 className="font-serif text-lg mb-2 text-genekey-300">Collective Purpose</h2>
          <p className="text-theme-text-secondary text-lg leading-relaxed">{ring.collectivePurpose}</p>
        </section>
      )}

      {/* Description */}
      {ring.description && (
        <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <p className="text-theme-text-secondary leading-relaxed">{ring.description}</p>
        </section>
      )}

      {/* Member Gene Keys */}
      <section>
        <h2 className="font-serif text-2xl mb-4">Member Gene Keys</h2>
        <p className="text-theme-text-secondary mb-6">
          These {memberKeys.length} Gene Keys share a deep genetic resonance within this Codon Ring,
          working together toward the ring's collective theme of <span className="text-genekey-400">{ring.theme}</span>.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {memberKeys.map(gk => {
            const gate = gk.hdGateId ? hdGates.get(gk.hdGateId) : undefined;
            return (
              <Link
                key={gk.id}
                to={`/gene-keys/${gk.id}`}
                className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle hover:border-genekey-500/50 hover:bg-surface-base transition-all group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl font-serif text-genekey-400">{gk.keyNumber}</span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-serif text-lg text-theme-text-primary group-hover:text-genekey-300 transition-colors">
                        {gk.name}
                      </h3>
                      {gate && (
                        <span className="text-xs text-humandesign-400 bg-humandesign-500/10 px-2 py-0.5 rounded flex-shrink-0">
                          HD {gate.gateNumber}
                        </span>
                      )}
                    </div>

                    {/* Spectrum */}
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-14 text-theme-text-tertiary">Shadow:</span>
                        <span className="text-red-400/80">{gk.shadow.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-14 text-theme-text-tertiary">Gift:</span>
                        <span className="text-genekey-400">{gk.gift.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-14 text-theme-text-tertiary">Siddhi:</span>
                        <span className="text-yellow-400/80">{gk.siddhi.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Ring Relationships */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h2 className="font-serif text-xl mb-4">Within the Ring</h2>
        <p className="text-theme-text-secondary mb-4">
          Gene Keys within a Codon Ring influence each other at the genetic level. When contemplating
          one key in the ring, the energies of its ring-mates are also activated. This creates a
          holographic effect where understanding deepens across all related keys.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {memberKeys.map(gk => (
            <div key={gk.id} className="text-center p-3 bg-surface-overlay rounded-lg">
              <div className="text-2xl font-serif text-genekey-400 mb-1">{gk.keyNumber}</div>
              <div className="text-xs text-genekey-300">{gk.gift.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Amino Acid */}
      {aminoAcid && (
        <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl mb-2">Amino Acid</h2>
          <p className="text-theme-text-tertiary text-sm mb-4">
            Codon Rings encode a specific amino acid in the human genome — the biochemical bridge between DNA and consciousness.
          </p>
          <Link
            to={`/gene-keys/amino-acids/${aminoAcid.id}`}
            className="flex items-center gap-4 p-4 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors border border-theme-border-subtle"
          >
            <div className="w-12 h-12 rounded-full bg-genekey-500/20 flex-shrink-0 flex items-center justify-center">
              <span className="text-genekey-400 font-mono font-bold text-lg">{aminoAcid.symbol}</span>
            </div>
            <div>
              <p className="text-theme-text-primary font-medium">{aminoAcid.name}</p>
              <p className="text-theme-text-secondary text-sm capitalize">{aminoAcid.aminoAcidType}</p>
              <p className="text-theme-text-tertiary text-xs mt-1 line-clamp-2">{aminoAcid.consciousnessQuality}</p>
            </div>
          </Link>
        </section>
      )}

      {/* Back Link */}
      <div className="text-center pt-4">
        <Link to="/gene-keys/codon-rings" className="text-theme-text-secondary hover:text-theme-text-primary transition-colors">
          &#8592; Back to Codon Rings
        </Link>
      </div>
    </div>
  );
}
export default CodonRingDetail;
