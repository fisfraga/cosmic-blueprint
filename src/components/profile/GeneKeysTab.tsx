import { Link } from 'react-router-dom';
import { geneKeys, codonRings, gkLines } from '../../data';
import { gkSphereKeyList, type ProfileTabProps } from './profileConstants';

export function GeneKeysTab({ profile }: ProfileTabProps) {
  if (!profile.geneKeysProfile) return null;

  const chartCodonRings = gkSphereKeyList
    .map(key => {
      const s = profile.geneKeysProfile?.[key as keyof typeof profile.geneKeysProfile];
      if (!s || typeof s !== 'object' || !('geneKeyId' in s)) return null;
      const gk = geneKeys.get((s as { geneKeyId: string }).geneKeyId);
      return gk?.codonRingId ? codonRings.get(gk.codonRingId) : null;
    })
    .filter((r): r is NonNullable<typeof r> => Boolean(r))
    .filter((r, i, arr) => arr.findIndex(x => x.id === r.id) === i);

  return (
    <div className="bg-gradient-to-br from-purple-500/5 to-purple-600/5 rounded-xl p-6 border border-purple-500/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-white flex items-center gap-2">
          <span>✧</span> Gene Keys Profile
        </h2>
        <Link
          to="/profile/gene-keys"
          className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
        >
          View Full Gene Keys Journey →
        </Link>
      </div>

      {/* The Golden Path intro */}
      <div className="mb-6 p-4 bg-neutral-900/30 rounded-lg">
        <p className="text-neutral-300 text-sm">
          Your <span className="text-purple-300">Golden Path</span> is a journey through three sequences that progressively
          unlock your purpose, open your heart, and release your prosperity. Each Gene Key has a Shadow, Gift, and Siddhi frequency.
        </p>
      </div>

      {/* Activation Sequence */}
      <div className="mb-6">
        <Link to="/gene-keys/sequences" className="group">
          <h3 className="text-emerald-300 text-sm font-medium mb-1 flex items-center gap-2 group-hover:text-emerald-200">
            <span>△</span> Activation Sequence
          </h3>
          <p className="text-neutral-500 text-xs mb-3">Your Purpose — How you express your gifts in the world</p>
        </Link>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['lifesWork', 'evolution', 'radiance', 'purpose'].map((sphere) => {
            const sphereData = profile.geneKeysProfile?.[sphere as keyof typeof profile.geneKeysProfile];
            if (!sphereData || typeof sphereData !== 'object' || !('geneKeyId' in sphereData)) return null;
            const gk = geneKeys.get(sphereData.geneKeyId);
            const line = gkLines.get(`gk-line-${sphereData.line}`);
            return (
              <Link
                key={sphere}
                to={`/profile/gene-keys/${sphere}`}
                className="bg-neutral-900/50 rounded-lg p-3 hover:bg-neutral-800/50 transition-colors group"
              >
                <p className="text-emerald-400/80 text-xs mb-1">{sphereData.sphereName}</p>
                <p className="text-genekey-300 font-medium group-hover:text-genekey-200">
                  Key {sphereData.geneKeyNumber}.{sphereData.line}
                </p>
                {gk && (
                  <p className="text-white text-sm mt-1">{gk.name}</p>
                )}
                {gk && (
                  <p className="text-neutral-400 text-xs mt-1">
                    {gk.shadow?.name} → {gk.gift?.name} → {gk.siddhi?.name}
                  </p>
                )}
                {line && (
                  <p className="text-neutral-500 text-xs mt-1">
                    Line {sphereData.line}: {line.archetype}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Venus Sequence */}
      <div className="mb-6">
        <Link to="/gene-keys/sequences" className="group">
          <h3 className="text-rose-300 text-sm font-medium mb-1 flex items-center gap-2 group-hover:text-rose-200">
            <span>♀</span> Venus Sequence
          </h3>
          <p className="text-neutral-500 text-xs mb-3">Your Relationships — Opening your heart through emotional healing</p>
        </Link>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['attraction', 'iq', 'eq', 'sq', 'core'].map((sphere) => {
            const sphereData = profile.geneKeysProfile?.[sphere as keyof typeof profile.geneKeysProfile];
            if (!sphereData || typeof sphereData !== 'object' || !('geneKeyId' in sphereData)) return null;
            const gk = geneKeys.get(sphereData.geneKeyId);
            const line = gkLines.get(`gk-line-${sphereData.line}`);
            return (
              <Link
                key={sphere}
                to={`/profile/gene-keys/${sphere}`}
                className="bg-neutral-900/50 rounded-lg p-3 hover:bg-neutral-800/50 transition-colors group"
              >
                <p className="text-rose-400/80 text-xs mb-1">{sphereData.sphereName}</p>
                <p className="text-genekey-300 font-medium group-hover:text-genekey-200">
                  Key {sphereData.geneKeyNumber}.{sphereData.line}
                </p>
                {gk && (
                  <p className="text-white text-sm mt-1">{gk.name}</p>
                )}
                {gk && (
                  <p className="text-neutral-400 text-xs mt-1">
                    {gk.shadow?.name} → {gk.gift?.name} → {gk.siddhi?.name}
                  </p>
                )}
                {line && (
                  <p className="text-neutral-500 text-xs mt-1">
                    Line {sphereData.line}: {line.archetype}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Pearl Sequence */}
      <div className="mb-6">
        <Link to="/gene-keys/sequences" className="group">
          <h3 className="text-blue-300 text-sm font-medium mb-1 flex items-center gap-2 group-hover:text-blue-200">
            <span>○</span> Pearl Sequence
          </h3>
          <p className="text-neutral-500 text-xs mb-3">Your Prosperity — Aligning your gifts with service to the whole</p>
        </Link>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['vocation', 'culture', 'brand', 'pearl'].map((sphere) => {
            const sphereData = profile.geneKeysProfile?.[sphere as keyof typeof profile.geneKeysProfile];
            if (!sphereData || typeof sphereData !== 'object' || !('geneKeyId' in sphereData)) return null;
            const gk = geneKeys.get(sphereData.geneKeyId);
            const line = gkLines.get(`gk-line-${sphereData.line}`);
            return (
              <Link
                key={sphere}
                to={`/profile/gene-keys/${sphere}`}
                className="bg-neutral-900/50 rounded-lg p-3 hover:bg-neutral-800/50 transition-colors group"
              >
                <p className="text-blue-400/80 text-xs mb-1">{sphereData.sphereName}</p>
                <p className="text-genekey-300 font-medium group-hover:text-genekey-200">
                  Key {sphereData.geneKeyNumber}.{sphereData.line}
                </p>
                {gk && (
                  <p className="text-white text-sm mt-1">{gk.name}</p>
                )}
                {gk && (
                  <p className="text-neutral-400 text-xs mt-1">
                    {gk.shadow?.name} → {gk.gift?.name} → {gk.siddhi?.name}
                  </p>
                )}
                {line && (
                  <p className="text-neutral-500 text-xs mt-1">
                    Line {sphereData.line}: {line.archetype}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Codon Rings Present in Chart */}
      {chartCodonRings.length > 0 && (
        <div className="mb-6">
          <h3 className="text-neutral-300 text-sm font-medium mb-2 flex items-center gap-2">
            <span className="text-genekey-500">⬡</span> Codon Rings in Your Chart
          </h3>
          <p className="text-neutral-500 text-xs mb-3">
            The biological codons activated by your Gene Keys profile
          </p>
          <div className="flex flex-wrap gap-2">
            {chartCodonRings.map(ring => (
              <Link
                key={ring.id}
                to={`/gene-keys/codon-rings/${ring.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-genekey-500/10 text-genekey-300 border border-genekey-500/20 rounded-lg text-sm hover:bg-genekey-500/20 transition-colors"
              >
                <span className="text-genekey-500 text-xs">⬡</span>
                {ring.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="mt-6 pt-4 border-t border-neutral-800/50 flex flex-wrap gap-3">
        <Link to="/gene-keys/sequences" className="text-purple-400 hover:text-purple-300 text-sm">Sequences →</Link>
        <Link to="/gene-keys/spheres" className="text-purple-400 hover:text-purple-300 text-sm">Spheres →</Link>
        <Link to="/gene-keys/lines" className="text-purple-400 hover:text-purple-300 text-sm">Lines →</Link>
        <Link to="/gene-keys/codon-rings" className="text-purple-400 hover:text-purple-300 text-sm">Codon Rings →</Link>
        <Link to="/gene-keys/amino-acids" className="text-purple-400 hover:text-purple-300 text-sm">Amino Acids →</Link>
      </div>
    </div>
  );
}
