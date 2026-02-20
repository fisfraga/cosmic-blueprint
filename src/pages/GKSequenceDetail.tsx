import { useParams, Link } from 'react-router-dom';
import { gkSequences, gkSpheres, geneKeys, aminoAcids } from '../data';
import { useProfile } from '../context';
import type { GKSequenceEntity } from '../types';

// Sequence colors
const SEQUENCE_COLORS: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  'activation-sequence': {
    bg: 'from-amber-500/20 to-amber-600/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    accent: 'bg-amber-500',
  },
  'venus-sequence': {
    bg: 'from-rose-500/20 to-rose-600/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    accent: 'bg-rose-500',
  },
  'pearl-sequence': {
    bg: 'from-blue-500/20 to-blue-600/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    accent: 'bg-blue-500',
  },
};

export function GKSequenceDetail() {
  const { id } = useParams<{ id: string }>();
  const { profile } = useProfile();
  const sequence = id ? gkSequences.get(id) : undefined;

  // Not found state
  if (!sequence) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Sequence Not Found</h1>
        <p className="text-neutral-400 mb-4">
          The Gene Keys sequence you're looking for doesn't exist.
        </p>
        <Link to="/gene-keys/sequences" className="text-emerald-400 hover:underline">
          ← Back to Sequences
        </Link>
      </div>
    );
  }

  const colors = SEQUENCE_COLORS[sequence.id] || SEQUENCE_COLORS['activation-sequence'];

  // Map sequence ID to GKSequence type value
  const sequenceIdToName: Record<string, string> = {
    'activation-sequence': 'Activation',
    'venus-sequence': 'Venus',
    'pearl-sequence': 'Pearl',
  };
  const sequenceName = sequenceIdToName[sequence.id];

  // Get spheres in this sequence
  const sequenceSpheres = Array.from(gkSpheres.values()).filter(
    sphere => sphere.sequence === sequenceName
  );

  // Get user's Gene Keys for spheres in this sequence (if profile exists)
  const getProfileGeneKey = (sphereId: string): number | null => {
    if (!profile?.geneKeysProfile) return null;

    // Map sphere IDs to profile keys
    const sphereToProfileKey: Record<string, string> = {
      'life-work': 'lifesWork',
      'evolution': 'evolution',
      'radiance': 'radiance',
      'purpose': 'purpose',
      'attraction': 'attraction',
      'iq': 'iq',
      'eq': 'eq',
      'sq': 'sq',
      'core': 'core',
      'core-stability': 'core',
      'vocation': 'vocation',
      'culture': 'culture',
      'brand': 'brand',
      'pearl': 'pearl',
    };

    const profileKey = sphereToProfileKey[sphereId];
    if (!profileKey) return null;

    const profileSphere = profile.geneKeysProfile[profileKey as keyof typeof profile.geneKeysProfile];
    if (profileSphere && typeof profileSphere === 'object' && 'geneKeyNumber' in profileSphere) {
      return profileSphere.geneKeyNumber;
    }
    return null;
  };

  // Get prime gifts or core spheres based on sequence type
  const sphereDetails = (sequence as GKSequenceEntity).primeGifts || (sequence as GKSequenceEntity).coreSpheres || [];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className={`text-center py-8 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border}`}>
        <div className="text-5xl mb-4">{sequence.symbol}</div>
        <h1 className="font-serif text-4xl font-medium mb-2">{sequence.name}</h1>
        <p className="text-xl text-neutral-300 italic">{sequence.theme}</p>

        {/* Meta Pills */}
        <div className="flex items-center justify-center gap-3 text-sm flex-wrap mt-4">
          <span className={`px-3 py-1.5 ${colors.accent} text-white rounded-full`}>
            Sequence {sequence.sequenceOrder}
          </span>
          <span className="px-3 py-1.5 bg-neutral-900/50 text-neutral-300 rounded-full">
            {sequence.spheres?.length || 0} Spheres
          </span>
        </div>
      </header>

      {/* Primary Question */}
      {sequence.primaryQuestion && (
        <section className={`bg-gradient-to-br ${colors.bg} rounded-xl p-6 border ${colors.border}`}>
          <h2 className={`font-serif text-lg mb-2 ${colors.text}`}>Primary Question</h2>
          <p className="text-xl text-white font-medium italic">"{sequence.primaryQuestion}"</p>
        </section>
      )}

      {/* Description */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl mb-4">Overview</h2>
        <p className="text-neutral-300 leading-relaxed">{sequence.description}</p>
      </section>

      {/* Transformation & Focus */}
      <div className="grid md:grid-cols-2 gap-6">
        {sequence.transformation && (
          <section className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl p-6 border border-emerald-500/20">
            <h2 className="font-serif text-lg mb-3 text-emerald-400">Transformation</h2>
            <p className="text-neutral-300 leading-relaxed text-sm">{sequence.transformation}</p>
          </section>
        )}
        {sequence.contemplationFocus && (
          <section className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-6 border border-purple-500/20">
            <h2 className="font-serif text-lg mb-3 text-purple-400">Contemplation Focus</h2>
            <p className="text-neutral-300 leading-relaxed text-sm">{sequence.contemplationFocus}</p>
          </section>
        )}
      </div>

      {/* Spheres in this Sequence */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl mb-4">Spheres in This Sequence</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {sphereDetails.map((detail, idx) => {
            const sphereId = sequence.spheres?.[idx];
            const profileGK = sphereId ? getProfileGeneKey(sphereId) : null;

            return (
              <div
                key={idx}
                className={`p-4 rounded-lg bg-neutral-800/50 border ${colors.border}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className={`font-medium ${colors.text}`}>{detail.sphere}</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">{detail.planet}</p>
                  </div>
                  {profileGK && (() => {
                    const gk = geneKeys.get(`gk-${profileGK}`);
                    const amino = gk?.aminoAcidId ? aminoAcids.get(gk.aminoAcidId) : undefined;
                    return (
                      <Link
                        to={`/gene-keys/gk-${profileGK}`}
                        className="flex items-center gap-1.5 px-2 py-1 bg-emerald-900/30 rounded text-emerald-400 text-sm hover:bg-emerald-900/50 transition-colors"
                      >
                        <span>GK {profileGK}</span>
                        {amino && (
                          <span className="text-genekey-500 font-mono text-xs" title={amino.name}>
                            {amino.symbol}
                          </span>
                        )}
                      </Link>
                    );
                  })()}
                </div>
                <p className="text-sm text-neutral-400 mt-2">{detail.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Your Profile Section */}
      {profile?.geneKeysProfile && sequenceSpheres.length > 0 && (
        <section className="bg-emerald-900/20 rounded-xl p-6 border border-emerald-500/20">
          <h2 className="font-serif text-xl mb-4 text-emerald-400">Your {sequence.name}</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {sequence.spheres?.map(sphereId => {
              const gkNumber = getProfileGeneKey(sphereId);
              if (!gkNumber) return null;

              // Find sphere name from sphereDetails
              const sphereDetail = sphereDetails.find(d =>
                d.sphere.toLowerCase().replace(/['\s]/g, '-').includes(sphereId.replace('-', ''))
              ) || sphereDetails[sequence.spheres?.indexOf(sphereId) || 0];

              return (
                <Link
                  key={sphereId}
                  to={`/gene-keys/gk-${gkNumber}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
                >
                  <span className="text-neutral-300">{sphereDetail?.sphere || sphereId}</span>
                  <span className="text-emerald-400 font-medium">Gene Key {gkNumber}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Practical Guidance */}
      {sequence.practicalGuidance && (
        <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl mb-4">Practical Guidance</h2>
          <p className="text-neutral-300 leading-relaxed">{sequence.practicalGuidance}</p>
        </section>
      )}

      {/* Keywords */}
      {sequence.keywords && sequence.keywords.length > 0 && (
        <section className="flex flex-wrap gap-2 justify-center">
          {sequence.keywords.map((keyword, i) => (
            <span
              key={i}
              className={`px-3 py-1.5 bg-neutral-800 ${colors.text} rounded-full text-sm`}
            >
              {keyword}
            </span>
          ))}
        </section>
      )}

      {/* Pathways */}
      {sequence.pathways && sequence.pathways.length > 0 && (
        <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl mb-4">Pathways</h2>
          <div className="flex flex-wrap gap-3">
            {sequence.pathways.map((pathway, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-neutral-800/50 border border-neutral-700 rounded-lg text-neutral-300 capitalize"
              >
                {pathway.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Navigation */}
      <nav className="flex justify-between pt-6 border-t border-neutral-800">
        <Link
          to="/gene-keys/sequences"
          className="text-neutral-400 hover:text-white transition-colors"
        >
          ← All Sequences
        </Link>
        <Link
          to="/gene-keys/spheres"
          className="text-neutral-400 hover:text-white transition-colors"
        >
          All Spheres →
        </Link>
      </nav>
    </div>
  );
}

export default GKSequenceDetail;
