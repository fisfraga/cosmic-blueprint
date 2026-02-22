import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { aminoAcids, codonRings, geneKeys, hdGates } from '../data';
import { useProfile } from '../context';
import { EntityStack } from '../components/entities/EntityStack';
import type { EntityInfo } from '../services/entities/registry';

// Amino acid type colors
const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Essential: {
    bg: 'from-amber-500/20 to-amber-600/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  'Non-essential': {
    bg: 'from-emerald-500/20 to-emerald-600/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  Conditional: {
    bg: 'from-purple-500/20 to-purple-600/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
};

export function AminoAcidDetail() {
  const { id } = useParams<{ id: string }>();
  const { profile } = useProfile();
  const aminoAcid = id ? aminoAcids.get(id) : undefined;

  const [selectedEntities, setSelectedEntities] = useState<EntityInfo[]>([]);
  const handleEntityClick = useCallback((entity: EntityInfo) => {
    setSelectedEntities(prev => {
      const already = prev.findIndex(e => e.id === entity.id);
      if (already !== -1) return prev;
      if (prev.length >= 2) return [prev[1], entity];
      return [...prev, entity];
    });
  }, []);
  const handleCloseEntity = useCallback((entityId: string) => {
    setSelectedEntities(prev => prev.filter(e => e.id !== entityId));
  }, []);

  // Not found state
  if (!aminoAcid) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Amino Acid Not Found</h1>
        <p className="text-theme-text-secondary mb-4">
          The amino acid you're looking for doesn't exist.
        </p>
        <Link to="/gene-keys/amino-acids" className="text-emerald-400 hover:underline">
          ← Back to Amino Acids
        </Link>
      </div>
    );
  }

  const colors = TYPE_COLORS[aminoAcid.aminoAcidType] || TYPE_COLORS['Non-essential'];

  // Get linked codon ring
  const linkedCodonRing = aminoAcid.codonRingId ? codonRings.get(aminoAcid.codonRingId) : undefined;

  // Get linked Gene Keys
  const linkedGeneKeys = aminoAcid.geneKeyIds?.map(gkId => geneKeys.get(gkId)).filter(Boolean) || [];

  // Derive corresponding HD Gates (same 1-64 numbering as Gene Keys)
  const linkedHDGates = linkedGeneKeys
    .map(gk => gk?.hdGateId ? hdGates.get(gk.hdGateId) : undefined)
    .filter(Boolean)
    .sort((a, b) => (a?.gateNumber || 0) - (b?.gateNumber || 0));

  // Check which Gene Keys from this amino acid are in user's profile
  const getProfileGeneKeys = () => {
    if (!profile?.geneKeysProfile) return [];

    const profileSpheres = [
      'lifesWork', 'evolution', 'radiance', 'purpose',
      'attraction', 'iq', 'eq', 'sq', 'core',
      'vocation', 'culture', 'pearl',
      'brand', 'creativity', 'relating', 'stability',
    ];

    const activeGKs: { sphereName: string; geneKeyNumber: number }[] = [];

    for (const key of profileSpheres) {
      const sphere = profile.geneKeysProfile[key as keyof typeof profile.geneKeysProfile];
      if (sphere && typeof sphere === 'object' && 'geneKeyNumber' in sphere) {
        const gkNumber = sphere.geneKeyNumber;
        if (aminoAcid.geneKeyIds?.includes(`gk-${gkNumber}`)) {
          activeGKs.push({
            sphereName: key.replace(/([A-Z])/g, ' $1').trim(),
            geneKeyNumber: gkNumber,
          });
        }
      }
    }

    return activeGKs;
  };

  const profileGeneKeys = getProfileGeneKeys();

  return (
    <div className="flex h-full">
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Header */}
          <header className={`text-center py-8 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border}`}>
            <div className="text-5xl mb-4 font-mono font-boldtext-theme-text-primary">{aminoAcid.symbol}</div>
            <h1 className="font-serif text-4xl font-medium mb-2">{aminoAcid.name}</h1>
            <p className="text-xl text-theme-text-secondary font-mono">{aminoAcid.abbreviation}</p>

            {/* Meta Pills */}
            <div className="flex items-center justify-center gap-3 text-sm flex-wrap mt-4">
              <span className={`px-3 py-1.5 ${colors.text} bg-surface-base/50 rounded-full`}>
                {aminoAcid.aminoAcidType}
              </span>
              {linkedCodonRing && (
                <span
                  className="px-3 py-1.5 text-emerald-300 bg-surface-base/50 rounded-full hover:bg-surface-base/70 transition-colors cursor-pointer"
                  onClick={() => handleEntityClick(linkedCodonRing as unknown as EntityInfo)}
                >
                  {linkedCodonRing.name}
                </span>
              )}
            </div>
          </header>

          {/* Description */}
          <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
            <h2 className="font-serif text-xl mb-4">Overview</h2>
            <p className="text-theme-text-secondary leading-relaxed">{aminoAcid.description}</p>
          </section>

          {/* Chemical Nature & Physiological Role */}
          <div className="grid md:grid-cols-2 gap-6">
            {aminoAcid.chemicalNature && (
              <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
                <h2 className="font-serif text-lg mb-3 text-theme-text-primary">Chemical Nature</h2>
                <p className="text-theme-text-secondary leading-relaxed text-sm">{aminoAcid.chemicalNature}</p>
              </section>
            )}
            {aminoAcid.physiologicalRole && (
              <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
                <h2 className="font-serif text-lg mb-3 text-theme-text-primary">Physiological Role</h2>
                <p className="text-theme-text-secondary leading-relaxed text-sm">{aminoAcid.physiologicalRole}</p>
              </section>
            )}
          </div>

          {/* Consciousness Quality */}
          {aminoAcid.consciousnessQuality && (
            <section className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-6 border border-purple-500/20">
              <h2 className="font-serif text-xl mb-4 text-purple-400">Consciousness Quality</h2>
              <p className="text-theme-text-secondary leading-relaxed">{aminoAcid.consciousnessQuality}</p>
            </section>
          )}

          {/* Linked Gene Keys */}
          {linkedGeneKeys.length > 0 && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-4">Connected Gene Keys</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {linkedGeneKeys.map(gk => {
                  if (!gk) return null;
                  return (
                    <div
                      key={gk.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors border border-theme-border-subtle cursor-pointer"
                      onClick={() => handleEntityClick(gk as unknown as EntityInfo)}
                    >
                      <span className="text-2xl font-bold text-emerald-400">{gk.keyNumber}</span>
                      <div className="overflow-hidden flex-1">
                        <p className="text-theme-text-primary text-sm font-medium truncate">
                          {gk.name.replace(`Gene Key ${gk.keyNumber}: `, '')}
                        </p>
                        <p className="text-xs text-theme-text-tertiary truncate">
                          {gk.shadow?.name} → {gk.gift?.name} → {gk.siddhi?.name}
                        </p>
                      </div>
                      <Link
                        to={`/gene-keys/${gk.id}`}
                        className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary flex-shrink-0"
                        onClick={e => e.stopPropagation()}
                      >
                        →
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Human Design Gates */}
          {linkedHDGates.length > 0 && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-2">Human Design Gates</h2>
              <p className="text-theme-text-tertiary text-sm mb-4">
                Each Gene Key corresponds to an HD Gate sharing the same archetypal energy in the body graph.
              </p>
              <div className="flex flex-wrap gap-2">
                {linkedHDGates.map(gate => gate && (
                  <div
                    key={gate.id}
                    className="flex items-center gap-2 px-3 py-2 bg-humandesign-500/10 rounded-lg hover:bg-humandesign-500/20 transition-colors border border-humandesign-500/20 cursor-pointer"
                    onClick={() => handleEntityClick(gate as unknown as EntityInfo)}
                  >
                    <span className="text-humandesign-400 font-serif font-medium">{gate.gateNumber}</span>
                    <span className="text-theme-text-secondary text-sm">{gate.name}</span>
                    <Link
                      to={`/human-design/${gate.id}`}
                      className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary ml-1"
                      onClick={e => e.stopPropagation()}
                    >
                      →
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Your Profile Connection */}
          {profileGeneKeys.length > 0 && (
            <section className="bg-emerald-900/20 rounded-xl p-6 border border-emerald-500/20">
              <h2 className="font-serif text-xl mb-4 text-emerald-400">In Your Profile</h2>
              <p className="text-theme-text-secondary text-sm mb-4">
                Gene Keys from this amino acid's codon ring appear in your Hologenetic Profile:
              </p>
              <div className="space-y-2">
                {profileGeneKeys.map((item, idx) => (
                  <Link
                    key={idx}
                    to={`/gene-keys/gk-${item.geneKeyNumber}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors"
                  >
                    <span className="text-theme-text-secondary capitalize">{item.sphereName}</span>
                    <span className="text-emerald-400 font-medium">Gene Key {item.geneKeyNumber}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Codon Ring Connection */}
          {linkedCodonRing && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-4">Codon Ring</h2>
              <div
                className="flex items-center gap-4 p-4 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors border border-theme-border-subtle cursor-pointer"
                onClick={() => handleEntityClick(linkedCodonRing as unknown as EntityInfo)}
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <span className="text-emerald-400 text-xl">◯</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-theme-text-primary font-medium">{linkedCodonRing.name}</h4>
                  <p className="text-theme-text-tertiary text-sm">
                    {linkedCodonRing.geneKeyIds?.length || 0} Gene Keys in this ring
                  </p>
                </div>
                <Link
                  to={`/gene-keys/codon-rings/${linkedCodonRing.id}`}
                  className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary"
                  onClick={e => e.stopPropagation()}
                >
                  → Full profile
                </Link>
              </div>
            </section>
          )}

          {/* Navigation */}
          <nav className="flex justify-between pt-6 border-t border-theme-border-subtle">
            <Link
              to="/gene-keys/amino-acids"
              className="text-theme-text-secondary hover:text-theme-text-primary transition-colors"
            >
              ← All Amino Acids
            </Link>
            <Link
              to="/gene-keys/codon-rings"
              className="text-theme-text-secondary hover:text-theme-text-primary transition-colors"
            >
              Codon Rings →
            </Link>
          </nav>
        </div>
      </div>
      <EntityStack
        entities={selectedEntities}
        onCloseEntity={handleCloseEntity}
        onEntityClick={handleEntityClick}
      />
    </div>
  );
}

export default AminoAcidDetail;
