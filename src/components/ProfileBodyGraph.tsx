/**
 * Profile-aware Body Graph Component
 * Automatically extracts Human Design data from the user's profile
 * and renders the body graph with defined centers, channels, and gates.
 */

import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { BodyGraph, BodyGraphResponsive } from './BodyGraph';
import type { AstroProfile } from '../types';

interface ProfileBodyGraphProps {
  profile?: AstroProfile;
  showGates?: boolean;
  showChannels?: boolean;
  showLabels?: boolean;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'responsive';
}

/**
 * Extracts Human Design data from a profile for the body graph
 */
function extractHDData(profile: AstroProfile | null) {
  if (!profile?.humanDesignProfile) {
    return {
      definedCenters: [],
      definedChannels: [],
      personalityGates: [],
      designGates: [],
    };
  }

  const hdProfile = profile.humanDesignProfile;

  // Extract defined center IDs
  const definedCenters = hdProfile.definedCenterIds ?? [];

  // Extract defined channel IDs
  const definedChannels = hdProfile.definedChannelIds ?? [];

  // Extract personality (conscious) gate numbers
  const personalityGates = hdProfile.personalityGates?.map(g => g.gateNumber) ?? [];

  // Extract design (unconscious) gate numbers
  const designGates = hdProfile.designGates?.map(g => g.gateNumber) ?? [];

  return {
    definedCenters,
    definedChannels,
    personalityGates,
    designGates,
  };
}

/**
 * Profile Body Graph Component
 * Uses the current profile from context or accepts a profile prop
 */
export function ProfileBodyGraph({
  profile: profileProp,
  showGates = true,
  showChannels = true,
  showLabels = true,
  interactive = true,
  size = 'responsive',
}: ProfileBodyGraphProps) {
  const navigate = useNavigate();
  const { profile: contextProfile } = useProfile();

  // Use provided profile or fall back to context
  const profile = profileProp ?? contextProfile;

  const {
    definedCenters,
    definedChannels,
    personalityGates,
    designGates,
  } = extractHDData(profile);

  const handleCenterClick = (centerId: string) => {
    if (interactive) {
      navigate(`/human-design/centers/${centerId}`);
    }
  };

  const handleGateClick = (gateNumber: number) => {
    if (interactive) {
      navigate(`/human-design/${gateNumber}`);
    }
  };

  const handleChannelClick = (channelId: string) => {
    if (interactive) {
      navigate(`/human-design/channels/${channelId}`);
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: { width: 180, height: 270 },
    md: { width: 280, height: 420 },
    lg: { width: 400, height: 600 },
    responsive: null, // Use BodyGraphResponsive
  };

  if (size === 'responsive') {
    return (
      <BodyGraphResponsive
        definedCenters={definedCenters}
        definedChannels={definedChannels}
        personalityGates={personalityGates}
        designGates={designGates}
        showGates={showGates}
        interactive={interactive}
        onCenterClick={handleCenterClick}
        onGateClick={handleGateClick}
      />
    );
  }

  const { width, height } = sizeConfig[size];

  return (
    <BodyGraph
      width={width}
      height={height}
      definedCenters={definedCenters}
      definedChannels={definedChannels}
      personalityGates={personalityGates}
      designGates={designGates}
      showLabels={showLabels}
      showGates={showGates}
      showChannels={showChannels}
      interactive={interactive}
      onCenterClick={handleCenterClick}
      onGateClick={handleGateClick}
      onChannelClick={handleChannelClick}
    />
  );
}

/**
 * Body Graph Legend Component
 * Explains the color coding for personality vs design gates
 */
export function BodyGraphLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-4 text-xs text-theme-text-secondary mt-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#1F2937] border border-theme-border" />
        <span>Personality (Conscious)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#DC2626]" />
        <span>Design (Unconscious)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#9333EA]" />
        <span>Both</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
        <span>Defined Center/Channel</span>
      </div>
    </div>
  );
}

/**
 * Full Profile Body Graph Card
 * Includes the graph, legend, and optional title
 */
export function ProfileBodyGraphCard({
  title = 'Your Body Graph',
  showLegend = true,
}: {
  title?: string;
  showLegend?: boolean;
}) {
  return (
    <div className="bg-surface-base/50 rounded-xl p-4 sm:p-6 border border-theme-border-subtle">
      {title && (
        <h3 className="font-serif text-lg mb-4 text-center">{title}</h3>
      )}
      <ProfileBodyGraph size="responsive" showGates={true} />
      {showLegend && <BodyGraphLegend />}
      <p className="text-xs text-theme-text-tertiary text-center mt-4">
        Click on centers, channels, or gates to explore
      </p>
    </div>
  );
}

export default ProfileBodyGraph;
