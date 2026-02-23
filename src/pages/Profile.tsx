import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '../context';
import { LoadingSkeleton } from '../components';
import { ProfileHeader, AstrologyTab, HumanDesignTab, GeneKeysTab, BlueprintReadingModal } from '../components/profile';

export function Profile() {
  const { profile, cosmicProfile, isLoading, hasProfile } = useProfile();
  const [showBlueprintModal, setShowBlueprintModal] = useState(false);

  if (isLoading) {
    return <LoadingSkeleton variant="profile" />;
  }

  if (!hasProfile || !profile) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header: Name, birth data, natal chart, today's activations, key signatures, quick links, data export */}
      <ProfileHeader profile={profile} />

      {/* Generate My Blueprint Reading — premium synthesis feature */}
      <div className="bg-gradient-to-r from-purple-500/10 via-genekey-500/5 to-blue-500/10 rounded-xl p-5 border border-purple-500/20 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-serif text-base font-medium text-purple-300 mb-1">Integrated Blueprint Reading</h3>
          <p className="text-theme-text-secondary text-sm">
            A complete AI-generated synthesis of your Astrology, Human Design, and Gene Keys — five chapters, one language.
          </p>
        </div>
        <button
          onClick={() => setShowBlueprintModal(true)}
          className="px-5 py-2.5 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-lg border border-purple-500/30 transition-colors text-sm whitespace-nowrap flex-shrink-0"
        >
          Generate My Reading →
        </button>
      </div>

      {/* Astrology: Elemental balance, Big Four cosmic identity, all placements, aspects, configurations */}
      <AstrologyTab profile={profile} />

      {/* Human Design: Type, strategy, authority, profile, gates, centers, channels, chakra resonance */}
      <HumanDesignTab profile={profile} />

      {/* Gene Keys: Golden Path sequences (Activation, Venus, Pearl), codon rings */}
      <GeneKeysTab profile={profile} />

      {/* Blueprint Reading Modal */}
      {showBlueprintModal && (
        <BlueprintReadingModal
          profile={profile}
          cosmicProfile={cosmicProfile}
          onClose={() => setShowBlueprintModal(false)}
        />
      )}
    </motion.div>
  );
}
export default Profile;
