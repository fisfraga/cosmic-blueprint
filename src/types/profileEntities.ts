// ============================================
// Profile Entity Types
// ============================================
// Profile entities are relational nodes that connect
// universal entities (planets, signs, gates, gene keys)
// to a person's unique cosmic blueprint.

// ------------------------------------
// Profile Entity Type Union
// ------------------------------------

export type ProfileEntityType =
  | 'profile-placement'      // Astrology: planet-in-sign-in-house
  | 'profile-gk-placement'   // Gene Keys: sphere with gene key + line
  | 'profile-hd-placement'   // Human Design: gate activation with line
  | 'profile-aspect'         // Astrology: aspect between two placements
  | 'profile-channel'        // Human Design: defined channel (two connected gates)
  | 'profile-configuration'; // Astrology: aspect pattern (stellium, t-square)

// ------------------------------------
// Base Profile Entity
// ------------------------------------

export interface ProfileEntity {
  id: string;                    // Compound ID: "{profileId}:{type}:{key}"
  profileId: string;
  entityType: ProfileEntityType;
  displayName: string;           // "Sun in Scorpio in 12th House"
  shortName: string;             // "Sun in Scorpio"
  relatedEntityIds: string[];    // Links to universal entities
}

// ------------------------------------
// Astrology Placement Entity
// ------------------------------------
// Represents a natal planet placement connecting:
// Planet + Sign + House + Degree + Dignity

export interface AstrologyPlacementEntity extends ProfileEntity {
  entityType: 'profile-placement';
  planetId: string;              // e.g., "sun"
  signId: string;                // e.g., "scorpio"
  houseId: string;               // e.g., "house-12"
  degree: number;                // 0-29
  minute: number;                // 0-59
  retrograde: boolean;
  dignityId?: string;            // e.g., "fall" (Sun in fall in Libra)
  decanId?: string;              // e.g., "scorpio-decan-1"
  isChartRuler?: 'traditional' | 'modern';
  // Cross-system connections
  geneKeyNumber?: number;        // Which GK this degree activates
  hdGateNumber?: number;         // Which HD gate this degree activates
}

// ------------------------------------
// Gene Keys Placement Entity
// ------------------------------------
// Represents a Gene Key activation in a specific sphere:
// Sphere + Gene Key + Line + Shadow/Gift/Siddhi

export interface GeneKeysPlacementEntity extends ProfileEntity {
  entityType: 'profile-gk-placement';
  sphereId: string;              // e.g., "gk-sphere-lifes-work"
  sphereKey: string;             // e.g., "lifesWork" (for routing)
  sphereName: string;            // "Life's Work"
  sequenceId: string;            // "activation-sequence"
  geneKeyId: string;             // "gk-44"
  geneKeyNumber: number;
  lineNumber: number;
  lineId: string;                // "line-3"
  planetarySource: string;       // "Natal Sun", "Design Mars", etc.
  isPersonality: boolean;        // Natal (true) vs Design (false)
  // Shadow/Gift/Siddhi from Gene Key
  shadow: { name: string; description: string };
  gift: { name: string; description: string };
  siddhi: { name: string; description: string };
  // Cross-system connections
  sourcePlanetId?: string;       // Which planet sources this sphere
  sourceSignId?: string;         // What sign that planet is in
}

// ------------------------------------
// Human Design Placement Entity
// ------------------------------------
// Represents a gate activation in the bodygraph:
// Gate + Line + Center + Personality/Design

export interface HDPlacementEntity extends ProfileEntity {
  entityType: 'profile-hd-placement';
  gateId: string;                // "gate-44"
  gateNumber: number;
  lineNumber: number;
  lineId: string;                // "line-3"
  centerId: string;              // "spleen-center"
  planetId?: string;             // "sun" (which planet activated this gate)
  isPersonality: boolean;        // true = conscious/black, false = unconscious/red
  isChannelComplete: boolean;    // Has both gates for a channel
  channelId?: string;            // If channel complete: "channel-44-26"
  partnerGateId?: string;        // The other gate needed for channel
  // Cross-system connections
  geneKeyId?: string;            // Same number gene key
}

// ------------------------------------
// Profile Aspect Entity
// ------------------------------------
// Represents an aspect between two natal placements:
// Aspect Type + Planet 1 + Planet 2 + Orb

export interface ProfileAspectEntity extends ProfileEntity {
  entityType: 'profile-aspect';
  aspectId: string;              // "conjunction", "square", etc.
  placement1Id: string;          // Profile placement entity ID
  placement2Id: string;
  planet1Id: string;
  planet2Id: string;
  orbDegree: number;
  orbMinute: number;
  direction: 'Applying' | 'Separating';
  nature: 'harmonious' | 'challenging' | 'neutral';
}

// ------------------------------------
// Profile Channel Entity
// ------------------------------------
// Represents a defined channel in Human Design:
// Channel + Gate 1 + Gate 2 + Centers Connected

export interface ProfileChannelEntity extends ProfileEntity {
  entityType: 'profile-channel';
  channelId: string;             // Universal channel ID "channel-44-26"
  gate1Number: number;
  gate2Number: number;
  gate1PlacementId: string;      // Profile HD placement entity ID
  gate2PlacementId: string;
  center1Id: string;
  center2Id: string;
  circuitType: string;           // "Individual", "Tribal", "Collective"
  channelType: string;           // "Generated", "Projected", "Manifested"
  channelTheme?: string;         // The theme/name of this channel
}

// ------------------------------------
// Profile Configuration Entity
// ------------------------------------
// Represents an aspect pattern (stellium, t-square, etc.):
// Configuration Type + Involved Placements

export interface ProfileConfigurationEntity extends ProfileEntity {
  entityType: 'profile-configuration';
  configurationId: string;       // Universal configuration type ID
  configurationType: string;     // "stellium", "t-square", "grand-trine"
  configurationName: string;     // Full name e.g., "Stellium in Scorpio"
  placementIds: string[];        // Involved placement entity IDs
  planetIds: string[];           // Involved planet IDs
  signIds: string[];             // Signs involved
  apex?: string;                 // For T-Square, Yod: apex planet ID
}

// ------------------------------------
// Union of all Profile Entity Types
// ------------------------------------

export type AnyProfileEntity =
  | AstrologyPlacementEntity
  | GeneKeysPlacementEntity
  | HDPlacementEntity
  | ProfileAspectEntity
  | ProfileChannelEntity
  | ProfileConfigurationEntity;

// ------------------------------------
// Profile Entity ID Patterns
// ------------------------------------
// These patterns are used to construct entity IDs:
//
// Astrology Placement: {profileId}:placement:{planetId}
//   Example: "default-profile:placement:sun"
//
// Gene Keys Placement: {profileId}:gk:{sphereKey}
//   Example: "default-profile:gk:lifesWork"
//
// HD Placement: {profileId}:hd:{gateNumber}.{lineNumber}:{personality|design}
//   Example: "default-profile:hd:44.3:personality"
//
// Aspect: {profileId}:aspect:{planet1Id}-{aspectType}-{planet2Id}
//   Example: "default-profile:aspect:sun-conjunction-mercury"
//
// Channel: {profileId}:channel:{gate1Number}-{gate2Number}
//   Example: "default-profile:channel:44-26"
//
// Configuration: {profileId}:config:{configType}:{index}
//   Example: "default-profile:config:stellium:1"

// ------------------------------------
// Helper Types
// ------------------------------------

export interface ProfileEntityIdParts {
  profileId: string;
  entityType: ProfileEntityType;
  key: string;
}

/**
 * Parse a profile entity ID into its component parts
 */
export function parseProfileEntityId(id: string): ProfileEntityIdParts | null {
  const parts = id.split(':');
  if (parts.length < 3) return null;

  const profileId = parts[0];
  const typeKey = parts[1];

  // Map type keys to ProfileEntityType
  const typeMap: Record<string, ProfileEntityType> = {
    'placement': 'profile-placement',
    'gk': 'profile-gk-placement',
    'hd': 'profile-hd-placement',
    'aspect': 'profile-aspect',
    'channel': 'profile-channel',
    'config': 'profile-configuration',
  };

  const entityType = typeMap[typeKey];
  if (!entityType) return null;

  // The rest is the key
  const key = parts.slice(2).join(':');

  return { profileId, entityType, key };
}

/**
 * Check if an entity ID is a profile entity
 */
export function isProfileEntityId(id: string): boolean {
  return parseProfileEntityId(id) !== null;
}
