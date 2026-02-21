import { motion } from 'framer-motion';
import { useProfile } from '../context';
import { LoadingSkeleton } from '../components';
import { ProfileHeader, AstrologyTab, HumanDesignTab, GeneKeysTab } from '../components/profile';

export function Profile() {
  const { profile, isLoading, hasProfile } = useProfile();

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

      {/* Astrology: Elemental balance, Big Four cosmic identity, all placements, aspects, configurations */}
      <AstrologyTab profile={profile} />

      {/* Human Design: Type, strategy, authority, profile, gates, centers, channels, chakra resonance */}
      <HumanDesignTab profile={profile} />

      {/* Gene Keys: Golden Path sequences (Activation, Venus, Pearl), codon rings */}
      <GeneKeysTab profile={profile} />
    </motion.div>
  );
}
export default Profile;
