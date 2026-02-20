// ============================================
// Entity Detail Panel Component
// ============================================
// Slide-in panel showing entity details when clicked in chat
// Provides quick access to entity information without leaving the conversation

import React, { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EntityInfo, EntitySystem } from '../../services/entities';
import {
  getRelatedEntities,
  getPlacementsInSign,
  getPlacementsInHouse,
  getAspectsInvolving,
  getEntity,
} from '../../services/entities';
import { useProfile } from '../../context';
import type { AstroProfile, GeneKeySphere, NatalPlacement, NatalAspect, AstrologyPlacementEntity, GeneKeysPlacementEntity, HDPlacementEntity, ProfileAspectEntity, ProfileChannelEntity, ProfileConfigurationEntity } from '../../types';
import { signs, planets, aspects, getSignsByElement } from '../../data';

interface EntityDetailPanelProps {
  entity: EntityInfo | null;
  onClose: () => void;
  onEntityClick?: (entity: EntityInfo) => void;
  mode?: 'overlay' | 'sidebar'; // overlay = fixed modal, sidebar = inline panel
}

// Simple icon components
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// System colors for header styling
const SYSTEM_COLORS: Record<EntitySystem, {
  bg: string;
  border: string;
  accent: string;
  text: string;
}> = {
  astrology: {
    bg: 'bg-purple-900/50',
    border: 'border-purple-500/30',
    accent: 'bg-purple-500',
    text: 'text-purple-300',
  },
  humanDesign: {
    bg: 'bg-amber-900/50',
    border: 'border-amber-500/30',
    accent: 'bg-amber-500',
    text: 'text-amber-300',
  },
  geneKeys: {
    bg: 'bg-emerald-900/50',
    border: 'border-emerald-500/30',
    accent: 'bg-emerald-500',
    text: 'text-emerald-300',
  },
  shared: {
    bg: 'bg-blue-900/50',
    border: 'border-blue-500/30',
    accent: 'bg-blue-500',
    text: 'text-blue-300',
  },
};

// System labels
const SYSTEM_LABELS: Record<EntitySystem, string> = {
  astrology: 'Astrology',
  humanDesign: 'Human Design',
  geneKeys: 'Gene Keys',
  shared: 'Reference',
};

// Category labels
const CATEGORY_LABELS: Record<string, string> = {
  // Astrology
  planet: 'Planet',
  sign: 'Zodiac Sign',
  house: 'House',
  element: 'Element',
  aspect: 'Aspect',
  configuration: 'Configuration',
  point: 'Astro Point',
  decan: 'Decan',
  dignity: 'Dignity',
  // Human Design
  'hd-type': 'HD Type',
  'hd-strategy': 'Strategy',
  'hd-authority': 'Authority',
  'hd-center': 'Center',
  'hd-gate': 'Gate',
  'hd-channel': 'Channel',
  'hd-profile': 'Profile',
  'hd-line': 'Line',
  'hd-variable': 'Variable',
  // Gene Keys
  'gene-key': 'Gene Key',
  'gk-sphere': 'Sphere',
  'gk-line': 'Line',
  'gk-sequence': 'Sequence',
  'codon-ring': 'Codon Ring',
  'amino-acid': 'Amino Acid',
  trigram: 'Trigram',
  // Profile entities
  'natal-placement': 'Your Placement',
  'natal-aspect': 'Your Aspect',
  // New profile entity types
  'profile-placement': 'Your Placement',
  'profile-gk-placement': 'Your Gene Key',
  'profile-hd-placement': 'Your Gate',
  'profile-aspect': 'Your Aspect',
  'profile-channel': 'Your Channel',
  'profile-configuration': 'Your Pattern',
};

// Sphere display names
const SPHERE_DISPLAY_NAMES: Record<string, string> = {
  lifesWork: "Life's Work",
  evolution: 'Evolution',
  radiance: 'Radiance',
  purpose: 'Purpose',
  attraction: 'Attraction',
  iq: 'IQ',
  eq: 'EQ',
  sq: 'SQ',
  core: 'Core',
  vocation: 'Vocation',
  culture: 'Culture',
  pearl: 'Pearl',
  brand: 'Brand',
  creativity: 'Creativity',
  relating: 'Relating',
  stability: 'Stability',
};

// Helper to find which spheres use a given Gene Key number
function getProfileSpheresForGeneKey(
  geneKeyNumber: number,
  profile: AstroProfile | null
): { sphereName: string; planetarySource: string; signPlacement?: string }[] {
  if (!profile?.geneKeysProfile) return [];

  const spheres: { sphereName: string; planetarySource: string; signPlacement?: string }[] = [];
  const gkProfile = profile.geneKeysProfile;

  // Define all sphere keys to check
  const sphereKeys: (keyof typeof gkProfile)[] = [
    'lifesWork', 'evolution', 'radiance', 'purpose',
    'attraction', 'iq', 'eq', 'sq', 'core',
    'vocation', 'culture', 'pearl',
    'brand', 'creativity', 'relating', 'stability',
  ];

  for (const key of sphereKeys) {
    const sphere = gkProfile[key] as GeneKeySphere | undefined;
    if (sphere && sphere.geneKeyNumber === geneKeyNumber) {
      // Try to find zodiac sign for this placement
      let signPlacement: string | undefined;
      const planetarySource = sphere.planetarySource;

      // Parse planetary source (e.g., "Design Mars" or "Natal Sun")
      const planetName = planetarySource.replace(/^(Design|Natal)\s*/i, '').toLowerCase();

      // Find matching placement in profile
      const placement = profile.placements?.find(
        (p: NatalPlacement) => p.planetId.toLowerCase() === planetName
      );

      if (placement) {
        const sign = signs.get(placement.signId);
        if (sign) {
          // Format: "Leo 7°32'" with degree info if available
          const degreeStr = placement.degree !== undefined
            ? ` ${Math.floor(placement.degree)}°${Math.round((placement.degree % 1) * 60)}'`
            : '';
          signPlacement = `${sign.name}${degreeStr}`;
        }
      }

      spheres.push({
        sphereName: SPHERE_DISPLAY_NAMES[key] || key,
        planetarySource: sphere.planetarySource,
        signPlacement,
      });
    }
  }

  return spheres;
}

export function EntityDetailPanel({
  entity,
  onClose,
  onEntityClick,
  mode = 'overlay',
}: EntityDetailPanelProps): React.ReactElement | null {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const isSidebar = mode === 'sidebar';

  // Get Gene Key number from entity data for sphere lookup
  const geneKeyNumber = useMemo(() => {
    if (entity?.type === 'gene-key' && entity.data) {
      const data = entity.data as Record<string, unknown>;
      return typeof data.keyNumber === 'number' ? data.keyNumber : null;
    }
    return null;
  }, [entity]);

  // Find which spheres in the profile use this Gene Key
  const profileSpheres = useMemo(() => {
    if (geneKeyNumber === null) return [];
    return getProfileSpheresForGeneKey(geneKeyNumber, profile);
  }, [geneKeyNumber, profile]);

  // Handle escape key to close panel (only for overlay mode)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSidebar) {
        onClose();
      }
    },
    [onClose, isSidebar]
  );

  useEffect(() => {
    if (!isSidebar) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, isSidebar]);

  // Don't render if no entity
  if (!entity) {
    return null;
  }

  const colors = SYSTEM_COLORS[entity.system];
  const systemLabel = SYSTEM_LABELS[entity.system];
  const categoryLabel = CATEGORY_LABELS[entity.type] || entity.type;

  // Get related entities
  const relatedEntities = getRelatedEntities(entity.id);

  // Navigate to full entity page
  const handleViewFullPage = () => {
    if (entity.routePath) {
      navigate(entity.routePath);
      onClose();
    }
  };

  // Safely get string value from data
  const getStringValue = (key: string): string | null => {
    const data = entity.data as Record<string, unknown>;
    const value = data[key];
    return typeof value === 'string' ? value : null;
  };

  // Safely get nested string value
  const getNestedStringValue = (key: string, nestedKey: string): string | null => {
    const data = entity.data as Record<string, unknown>;
    const nested = data[key];
    if (nested && typeof nested === 'object' && nested !== null) {
      const value = (nested as Record<string, unknown>)[nestedKey];
      return typeof value === 'string' ? value : null;
    }
    return null;
  };

  // Render entity-specific content
  const renderEntityContent = () => {
    return (
      <div className="space-y-4">
        {/* Description */}
        {entity.description && (
          <div>
            <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">
              Description
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {entity.description.length > 300
                ? `${entity.description.slice(0, 300)}...`
                : entity.description}
            </p>
          </div>
        )}

        {/* Keywords */}
        {entity.keywords && entity.keywords.length > 0 && (
          <div>
            <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
              Keywords
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {entity.keywords.slice(0, 8).map((keyword, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 text-xs rounded ${colors.bg} ${colors.text}`}
                >
                  {String(keyword)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gene Key specific: Shadow/Gift/Siddhi */}
        {entity.type === 'gene-key' && (
          <div className="space-y-2">
            {getNestedStringValue('shadow', 'name') && (
              <div className="flex items-center gap-2">
                <span className="w-16 text-xs text-gray-500">Shadow</span>
                <span className="text-sm text-red-400">
                  {getNestedStringValue('shadow', 'name')}
                </span>
              </div>
            )}
            {getNestedStringValue('gift', 'name') && (
              <div className="flex items-center gap-2">
                <span className="w-16 text-xs text-gray-500">Gift</span>
                <span className="text-sm text-emerald-400">
                  {getNestedStringValue('gift', 'name')}
                </span>
              </div>
            )}
            {getNestedStringValue('siddhi', 'name') && (
              <div className="flex items-center gap-2">
                <span className="w-16 text-xs text-gray-500">Siddhi</span>
                <span className="text-sm text-purple-400">
                  {getNestedStringValue('siddhi', 'name')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Gene Key: Profile Sphere Placements */}
        {entity.type === 'gene-key' && profileSpheres.length > 0 && (
          <div className="bg-emerald-900/30 rounded-lg p-3 border border-emerald-500/20">
            <h4 className="text-xs uppercase tracking-wider text-emerald-400 mb-2">
              Your Profile
            </h4>
            <div className="space-y-1.5">
              {profileSpheres.map((sphere, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className="text-white font-medium">{sphere.sphereName}</span>
                  <span className="text-gray-500">—</span>
                  <span className="text-gray-400">
                    {sphere.planetarySource}
                    {sphere.signPlacement && (
                      <span className="text-emerald-400/80"> in {sphere.signPlacement}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gene Key & HD Gate: Zodiac Position */}
        {(entity.type === 'gene-key' || entity.type === 'hd-gate') && (() => {
          const data = entity.data as Record<string, unknown>;
          const signId = typeof data.tropicalSignId === 'string' ? data.tropicalSignId : null;
          const zodiacSign = signId ? signs.get(signId) : undefined;
          const degreeStart = typeof data.degreeStart === 'number' ? data.degreeStart.toFixed(1) : null;
          const degreeEnd = typeof data.degreeEnd === 'number' ? data.degreeEnd.toFixed(1) : null;

          if (!zodiacSign || !signId) return null;

          const signEntity = getEntity(signId);

          return (
            <button
              onClick={() => signEntity && onEntityClick?.(signEntity)}
              className="w-full bg-purple-900/30 rounded-lg p-3 border border-purple-500/20 text-left hover:bg-purple-900/40 transition-colors"
            >
              <h4 className="text-xs uppercase tracking-wider text-purple-400 mb-2">
                Zodiac Position
              </h4>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{zodiacSign.symbol}</span>
                <div>
                  <p className="text-sm text-white font-medium">{zodiacSign.name}</p>
                  {degreeStart && degreeEnd && (
                    <p className="text-xs text-gray-400">{degreeStart}° — {degreeEnd}°</p>
                  )}
                </div>
              </div>
            </button>
          );
        })()}

        {/* HD Gate specific: Gate number and expressions */}
        {entity.type === 'hd-gate' && (() => {
          const gate = entity.data as Record<string, unknown>;
          const gateNumber = typeof gate.gateNumber === 'number' ? gate.gateNumber : null;
          const iChingName = typeof gate.iChingHexagramName === 'string' ? gate.iChingHexagramName : null;
          const highExpr = typeof gate.highExpression === 'string' ? gate.highExpression : null;
          const lowExpr = typeof gate.lowExpression === 'string' ? gate.lowExpression : null;

          return (
            <div className="space-y-3">
              {/* Gate Number + I Ching */}
              {(gateNumber || iChingName) && (
                <div className="flex items-center gap-3">
                  {gateNumber && (
                    <span className="text-3xl font-bold text-amber-300">{gateNumber}</span>
                  )}
                  {iChingName && (
                    <div className="text-sm text-gray-400">{iChingName}</div>
                  )}
                </div>
              )}

              {/* High/Low Expression */}
              {highExpr && (
                <div>
                  <p className="text-xs text-emerald-400 mb-1">High Expression</p>
                  <p className="text-sm text-gray-300">{highExpr}</p>
                </div>
              )}
              {lowExpr && (
                <div>
                  <p className="text-xs text-red-400 mb-1">Low Expression</p>
                  <p className="text-sm text-gray-300">{lowExpr}</p>
                </div>
              )}
            </div>
          );
        })()}

        {/* HD Channel specific: Connecting gates */}
        {entity.type === 'hd-channel' && (() => {
          const channel = entity.data as Record<string, unknown>;
          const gate1Id = typeof channel.gate1Id === 'string' ? channel.gate1Id : null;
          const gate2Id = typeof channel.gate2Id === 'string' ? channel.gate2Id : null;
          const channelType = typeof channel.channelType === 'string' ? channel.channelType : null;

          const gate1Entity = gate1Id ? getEntity(gate1Id) : null;
          const gate2Entity = gate2Id ? getEntity(gate2Id) : null;

          return (
            <div className="space-y-3">
              {/* Channel Type */}
              {channelType && (
                <div className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded text-xs inline-block">
                  {channelType}
                </div>
              )}

              {/* Connecting Gates */}
              {(gate1Entity || gate2Entity) && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                    Connecting Gates
                  </h4>
                  <div className="flex items-center gap-2">
                    {gate1Entity && (
                      <button
                        onClick={() => onEntityClick?.(gate1Entity)}
                        className="px-3 py-2 bg-amber-900/30 rounded border border-amber-500/20 hover:bg-amber-900/50 text-sm text-amber-300 transition-colors"
                      >
                        Gate {gate1Id?.replace('gate-', '')}
                      </button>
                    )}
                    <span className="text-amber-400">—</span>
                    {gate2Entity && (
                      <button
                        onClick={() => onEntityClick?.(gate2Entity)}
                        className="px-3 py-2 bg-amber-900/30 rounded border border-amber-500/20 hover:bg-amber-900/50 text-sm text-amber-300 transition-colors"
                      >
                        Gate {gate2Id?.replace('gate-', '')}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* HD Center specific: Defined/Undefined meanings */}
        {entity.type === 'hd-center' && (() => {
          const center = entity.data as Record<string, unknown>;
          const centerType = typeof center.centerType === 'string' ? center.centerType : null;
          const definedMeaning = typeof center.definedMeaning === 'string' ? center.definedMeaning : null;
          const undefinedMeaning = typeof center.undefinedMeaning === 'string' ? center.undefinedMeaning : null;

          return (
            <div className="space-y-3">
              {/* Center Type */}
              {centerType && (
                <div className="text-xs text-amber-400 uppercase tracking-wider">
                  {centerType} Center
                </div>
              )}

              {/* Defined/Undefined meanings */}
              {definedMeaning && (
                <div>
                  <p className="text-xs text-emerald-400 mb-1">When Defined</p>
                  <p className="text-sm text-gray-300">{definedMeaning}</p>
                </div>
              )}
              {undefinedMeaning && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">When Undefined</p>
                  <p className="text-sm text-gray-300">{undefinedMeaning}</p>
                </div>
              )}
            </div>
          );
        })()}

        {/* Element specific: Your placements in signs of this element */}
        {entity.type === 'element' && (() => {
          const elementSigns = getSignsByElement(entity.id);
          const placementsInElement: EntityInfo[] = [];

          elementSigns.forEach(sign => {
            placementsInElement.push(...getPlacementsInSign(sign.id));
          });

          if (placementsInElement.length === 0) return null;

          return (
            <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
              <h4 className="text-xs uppercase tracking-wider text-purple-400 mb-2">
                Your {entity.name} Placements
              </h4>
              <div className="space-y-1.5">
                {placementsInElement.map((pe) => {
                  const placement = pe.data as NatalPlacement;
                  const planet = planets.get(placement.planetId);
                  const sign = signs.get(placement.signId);
                  return (
                    <div key={pe.id} className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{planet?.symbol || ''}</span>
                      <span className="text-white font-medium">{planet?.name || placement.planetId}</span>
                      <span className="text-gray-500">in</span>
                      <span className="text-gray-300">{sign?.name || placement.signId}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Aspect specific: Your aspects of this type */}
        {entity.type === 'aspect' && (() => {
          const aspectsOfType = profile?.aspects?.planetary.filter(
            (a: NatalAspect) => a.aspectId === entity.id
          ) || [];

          if (aspectsOfType.length === 0) return null;

          return (
            <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
              <h4 className="text-xs uppercase tracking-wider text-purple-400 mb-2">
                Your {entity.name}s
              </h4>
              <div className="space-y-1.5">
                {aspectsOfType.slice(0, 6).map((aspect: NatalAspect, i: number) => {
                  const planet1 = planets.get(aspect.planet1Id);
                  const planet2 = planets.get(aspect.planet2Id);
                  return (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{planet1?.symbol || ''}</span>
                      <span className="text-gray-500">{entity.symbol || '—'}</span>
                      <span className="text-lg">{planet2?.symbol || ''}</span>
                      <span className="text-gray-400 text-xs ml-2">
                        {aspect.orbDegree?.toFixed(1) || '0'}° orb
                      </span>
                    </div>
                  );
                })}
                {aspectsOfType.length > 6 && (
                  <p className="text-xs text-gray-500 mt-1">
                    +{aspectsOfType.length - 6} more
                  </p>
                )}
              </div>
            </div>
          );
        })()}

        {/* Codon Ring specific: Gene Keys in ring + profile display */}
        {entity.type === 'codon-ring' && (() => {
          const ring = entity.data as Record<string, unknown>;
          const geneKeyIds = Array.isArray(ring.geneKeyIds) ? ring.geneKeyIds as string[] : [];

          // Check which Gene Keys from this ring are in user's profile
          const profileGKs = profile?.geneKeysProfile;
          const activeInProfile: { sphereName: string; geneKeyNumber: number }[] = [];

          if (profileGKs) {
            const sphereKeys = [
              'lifesWork', 'evolution', 'radiance', 'purpose',
              'attraction', 'iq', 'eq', 'sq', 'core',
              'vocation', 'culture', 'pearl',
              'brand', 'creativity', 'relating', 'stability',
            ] as const;

            for (const key of sphereKeys) {
              const sphere = profileGKs[key] as GeneKeySphere | undefined;
              if (sphere && geneKeyIds.includes(`gk-${sphere.geneKeyNumber}`)) {
                activeInProfile.push({
                  sphereName: SPHERE_DISPLAY_NAMES[key] || key,
                  geneKeyNumber: sphere.geneKeyNumber,
                });
              }
            }
          }

          return (
            <div className="space-y-3">
              {/* Gene Keys in this ring */}
              {geneKeyIds.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-emerald-400 mb-2">
                    Gene Keys in Ring
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {geneKeyIds.map((gkId) => {
                      const gkEntity = getEntity(gkId);
                      return (
                        <button
                          key={gkId}
                          onClick={() => gkEntity && onEntityClick?.(gkEntity)}
                          className="px-2 py-1 bg-emerald-900/30 rounded border border-emerald-500/20 text-sm text-emerald-300 hover:bg-emerald-900/50 transition-colors"
                        >
                          GK {gkId.replace('gk-', '')}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Profile spheres using keys from this ring */}
              {activeInProfile.length > 0 && (
                <div className="bg-emerald-900/30 rounded-lg p-3 border border-emerald-500/20">
                  <h4 className="text-xs uppercase tracking-wider text-emerald-400 mb-2">
                    In Your Profile
                  </h4>
                  <div className="space-y-1">
                    {activeInProfile.map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-300">
                        GK {item.geneKeyNumber} as <span className="text-emerald-400">{item.sphereName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Planet specific: Archetype */}
        {entity.type === 'planet' && getStringValue('archetype') && (
          <div>
            <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">
              Archetype
            </h4>
            <p className="text-sm text-gray-300">{getStringValue('archetype')}</p>
          </div>
        )}

        {/* HD Type specific: Strategy & Signature */}
        {entity.type === 'hd-type' && (
          <div className="space-y-2">
            {getStringValue('signatureEmotion') && (
              <div className="flex items-center gap-2">
                <span className="w-20 text-xs text-gray-500">Signature</span>
                <span className="text-sm text-emerald-400">
                  {getStringValue('signatureEmotion')}
                </span>
              </div>
            )}
            {getStringValue('notSelfEmotion') && (
              <div className="flex items-center gap-2">
                <span className="w-20 text-xs text-gray-500">Not-Self</span>
                <span className="text-sm text-red-400">
                  {getStringValue('notSelfEmotion')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Sign: Your Placements in this Sign */}
        {entity.type === 'sign' && (() => {
          const placementsInSign = getPlacementsInSign(entity.id);
          if (placementsInSign.length === 0) return null;
          return (
            <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
              <h4 className="text-xs uppercase tracking-wider text-purple-400 mb-2">
                Your Placements in {entity.name}
              </h4>
              <div className="space-y-1.5">
                {placementsInSign.map((placementEntity: EntityInfo) => {
                  const placement = placementEntity.data as NatalPlacement;
                  const planet = planets.get(placement.planetId);
                  return (
                    <div key={placementEntity.id} className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{planet?.symbol || ''}</span>
                      <span className="text-white font-medium">{planet?.name || placement.planetId}</span>
                      <span className="text-gray-400">
                        {placement.degree}°{placement.minute}'
                        {placement.retrograde && <span className="text-amber-400 ml-1">℞</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* House: Your Placements in this House */}
        {entity.type === 'house' && (() => {
          const placementsInHouse = getPlacementsInHouse(entity.id);
          if (placementsInHouse.length === 0) return null;
          return (
            <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
              <h4 className="text-xs uppercase tracking-wider text-purple-400 mb-2">
                Your Placements in {entity.name}
              </h4>
              <div className="space-y-1.5">
                {placementsInHouse.map((placementEntity: EntityInfo) => {
                  const placement = placementEntity.data as NatalPlacement;
                  const planet = planets.get(placement.planetId);
                  const sign = signs.get(placement.signId);
                  return (
                    <div key={placementEntity.id} className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{planet?.symbol || ''}</span>
                      <span className="text-white font-medium">{planet?.name || placement.planetId}</span>
                      <span className="text-gray-400">
                        in {sign?.name || placement.signId}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Planet: Your Aspects with this Planet */}
        {entity.type === 'planet' && (() => {
          const aspectsWithPlanet = getAspectsInvolving(entity.id);
          if (aspectsWithPlanet.length === 0) return null;
          return (
            <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
              <h4 className="text-xs uppercase tracking-wider text-purple-400 mb-2">
                Your Aspects with {entity.name}
              </h4>
              <div className="space-y-1.5">
                {aspectsWithPlanet.slice(0, 6).map((aspectEntity: EntityInfo) => {
                  const aspect = aspectEntity.data as NatalAspect;
                  const aspectType = aspects.get(aspect.aspectId);
                  const otherPlanetId = aspect.planet1Id === entity.id ? aspect.planet2Id : aspect.planet1Id;
                  const otherPlanet = planets.get(otherPlanetId);
                  return (
                    <div key={aspectEntity.id} className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{aspectType?.symbol || ''}</span>
                      <span className="text-white font-medium">{aspectType?.name || aspect.aspectId}</span>
                      <span className="text-gray-400">{otherPlanet?.name || otherPlanetId}</span>
                      <span className="text-gray-500 text-xs">
                        {aspect.orbDegree}°{aspect.orbMinute}'
                      </span>
                    </div>
                  );
                })}
                {aspectsWithPlanet.length > 6 && (
                  <p className="text-xs text-gray-500 mt-1">
                    +{aspectsWithPlanet.length - 6} more aspects
                  </p>
                )}
              </div>
            </div>
          );
        })()}

        {/* Profile Placement Entity */}
        {entity.type === 'profile-placement' && (() => {
          const placement = entity.data as AstrologyPlacementEntity;
          const planet = planets.get(placement.planetId);
          const sign = signs.get(placement.signId);
          const house = getEntity(placement.houseId);

          return (
            <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
              <h4 className="text-xs uppercase tracking-wider text-purple-400 mb-2">
                Your Placement
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{planet?.symbol}</span>
                  <span className="text-white font-medium">{planet?.name}</span>
                  <span className="text-gray-400">in</span>
                  <span className="text-purple-300">{sign?.name}</span>
                </div>
                <div className="text-sm text-gray-400">
                  {placement.degree}°{placement.minute}' • {house?.name}
                  {placement.retrograde && <span className="text-amber-400 ml-2">℞ Retrograde</span>}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Profile GK Placement Entity */}
        {entity.type === 'profile-gk-placement' && (() => {
          const gkPlacement = entity.data as GeneKeysPlacementEntity;

          return (
            <div className="bg-emerald-900/30 rounded-lg p-3 border border-emerald-500/20">
              <h4 className="text-xs uppercase tracking-wider text-emerald-400 mb-2">
                {gkPlacement.sphereName}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-emerald-300">{gkPlacement.geneKeyNumber}</span>
                  <span className="text-gray-400">Line {gkPlacement.lineNumber}</span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-14 text-red-400">Shadow</span>
                    <span className="text-gray-300">{gkPlacement.shadow?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-14 text-emerald-400">Gift</span>
                    <span className="text-gray-300">{gkPlacement.gift?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-14 text-purple-400">Siddhi</span>
                    <span className="text-gray-300">{gkPlacement.siddhi?.name}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{gkPlacement.planetarySource}</p>
              </div>
            </div>
          );
        })()}

        {/* Profile HD Placement Entity */}
        {entity.type === 'profile-hd-placement' && (() => {
          const hdPlacement = entity.data as HDPlacementEntity;
          const center = getEntity(hdPlacement.centerId);

          return (
            <div className="bg-amber-900/30 rounded-lg p-3 border border-amber-500/20">
              <h4 className="text-xs uppercase tracking-wider text-amber-400 mb-2">
                Gate {hdPlacement.gateNumber}.{hdPlacement.lineNumber}
              </h4>
              <div className="space-y-2">
                <div className={`inline-flex px-2 py-0.5 rounded text-xs ${
                  hdPlacement.isPersonality
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {hdPlacement.isPersonality ? 'Personality (Conscious)' : 'Design (Unconscious)'}
                </div>
                <p className="text-sm text-gray-400">{center?.name}</p>
                {hdPlacement.isChannelComplete && (
                  <p className="text-sm text-emerald-400">Channel Complete</p>
                )}
              </div>
            </div>
          );
        })()}

        {/* Profile Aspect Entity */}
        {entity.type === 'profile-aspect' && (() => {
          const aspect = entity.data as ProfileAspectEntity;
          const planet1 = planets.get(aspect.planet1Id);
          const planet2 = planets.get(aspect.planet2Id);
          const aspectType = aspects.get(aspect.aspectId);

          return (
            <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
              <h4 className="text-xs uppercase tracking-wider text-purple-400 mb-2">
                Your Aspect
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{planet1?.symbol}</span>
                <span className="text-lg text-purple-300">{aspectType?.symbol}</span>
                <span className="text-2xl">{planet2?.symbol}</span>
              </div>
              <p className="text-sm text-gray-300">
                {planet1?.name} {aspectType?.name?.toLowerCase()} {planet2?.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Orb: {aspect.orbDegree}°{aspect.orbMinute}' • {aspect.direction}
              </p>
            </div>
          );
        })()}

        {/* Profile Channel Entity */}
        {entity.type === 'profile-channel' && (() => {
          const channel = entity.data as ProfileChannelEntity;

          return (
            <div className="bg-amber-900/30 rounded-lg p-3 border border-amber-500/20">
              <h4 className="text-xs uppercase tracking-wider text-amber-400 mb-2">
                Your Channel
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl text-amber-300">{channel.gate1Number}</span>
                <span className="text-gray-500">—</span>
                <span className="text-2xl text-amber-300">{channel.gate2Number}</span>
              </div>
              <p className="text-sm text-white">{channel.channelTheme}</p>
              <p className="text-xs text-gray-500 mt-1">{channel.circuitType} Circuit</p>
            </div>
          );
        })()}

        {/* Profile Configuration Entity */}
        {entity.type === 'profile-configuration' && (() => {
          const config = entity.data as ProfileConfigurationEntity;

          return (
            <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
              <h4 className="text-xs uppercase tracking-wider text-purple-400 mb-2">
                {config.configurationType}
              </h4>
              <div className="flex flex-wrap gap-1 mb-2">
                {config.planetIds.map((planetId) => {
                  const planet = planets.get(planetId);
                  return (
                    <span key={planetId} className="text-xl" title={planet?.name}>
                      {planet?.symbol}
                    </span>
                  );
                })}
              </div>
              <p className="text-sm text-white">{config.configurationName}</p>
            </div>
          );
        })()}

        {/* Related Entities */}
        {relatedEntities.length > 0 && (
          <div>
            <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
              Related
            </h4>
            <div className="space-y-1">
              {relatedEntities.slice(0, 5).map((related) => (
                <button
                  key={related.id}
                  onClick={() => onEntityClick?.(related)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded
                    bg-cosmic-800 hover:bg-cosmic-700 transition-colors text-left"
                >
                  {related.symbol && (
                    <span className="text-sm opacity-60">{related.symbol}</span>
                  )}
                  <span className="text-sm text-gray-300 flex-1 truncate">
                    {related.name}
                  </span>
                  <ChevronRightIcon className="w-3 h-3 text-gray-500" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Sidebar mode - integrated panel within the layout
  if (isSidebar) {
    return (
      <div
        className="bg-cosmic-900 border border-cosmic-700 rounded-xl shadow-lg
          flex flex-col h-[600px] sticky top-4 animate-fade-in"
        role="region"
        aria-labelledby="entity-panel-title"
      >
        {/* Header */}
        <div className={`${colors.bg} border-b ${colors.border} p-4 rounded-t-xl`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Symbol and Name */}
              <div className="flex items-center gap-2">
                {entity.symbol && (
                  <span className="text-xl">{entity.symbol}</span>
                )}
                <h2
                  id="entity-panel-title"
                  className="text-base font-semibold text-white truncate"
                >
                  {entity.name}
                </h2>
              </div>

              {/* Type badges */}
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-2 py-0.5 text-xs rounded ${colors.accent} text-white`}
                >
                  {systemLabel}
                </span>
                <span className="px-2 py-0.5 text-xs rounded bg-cosmic-700 text-gray-300">
                  {categoryLabel}
                </span>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 -mr-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close panel"
            >
              <CloseIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 overscroll-contain">
          {/* Image if available */}
          {entity.image && (
            <div className="mb-4 rounded-lg overflow-hidden bg-cosmic-800">
              <img
                src={entity.image}
                alt={entity.name}
                className="w-full h-28 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Entity-specific content */}
          {renderEntityContent()}
        </div>

        {/* Footer with full page link */}
        {entity.routePath && (
          <div className="border-t border-cosmic-700 p-3">
            <button
              onClick={handleViewFullPage}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2
                ${colors.accent} hover:opacity-90 rounded-lg text-white font-medium text-sm
                transition-opacity`}
            >
              <span>View Full Details</span>
              <ExternalLinkIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Overlay mode - fixed position modal
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel - full width on mobile, max-w-sm on larger screens */}
      <div
        className="fixed right-0 top-0 h-full w-full sm:max-w-sm bg-cosmic-900
          border-l border-cosmic-700 shadow-2xl z-50
          flex flex-col animate-slide-in-right
          safe-area-inset-top safe-area-inset-bottom"
        role="dialog"
        aria-modal="true"
        aria-labelledby="entity-panel-title"
      >
        {/* Header - responsive padding */}
        <div className={`${colors.bg} border-b ${colors.border} p-4 sm:p-4`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Symbol and Name */}
              <div className="flex items-center gap-2">
                {entity.symbol && (
                  <span className="text-2xl sm:text-2xl">{entity.symbol}</span>
                )}
                <h2
                  id="entity-panel-title"
                  className="text-lg sm:text-lg font-semibold text-white truncate"
                >
                  {entity.name}
                </h2>
              </div>

              {/* Type badges */}
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-2 py-1 sm:py-0.5 text-xs rounded ${colors.accent} text-white`}
                >
                  {systemLabel}
                </span>
                <span className="px-2 py-1 sm:py-0.5 text-xs rounded bg-cosmic-700 text-gray-300">
                  {categoryLabel}
                </span>
              </div>
            </div>

            {/* Close button - larger touch target on mobile */}
            <button
              onClick={onClose}
              className="p-3 sm:p-2 -mr-1 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation"
              aria-label="Close panel"
            >
              <CloseIcon className="w-6 h-6 sm:w-5 sm:h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content - responsive padding and touch-friendly spacing */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-4 overscroll-contain">
          {/* Image if available */}
          {entity.image && (
            <div className="mb-4 rounded-lg overflow-hidden bg-cosmic-800">
              <img
                src={entity.image}
                alt={entity.name}
                className="w-full h-32 sm:h-32 object-contain"
                onError={(e) => {
                  // Hide broken images
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Entity-specific content */}
          {renderEntityContent()}
        </div>

        {/* Footer with full page link - larger button on mobile */}
        {entity.routePath && (
          <div className="border-t border-cosmic-700 p-4 pb-safe">
            <button
              onClick={handleViewFullPage}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 sm:py-2.5
                ${colors.accent} hover:opacity-90 active:opacity-80 rounded-lg text-white font-medium
                transition-opacity touch-manipulation`}
            >
              <span>View Full Details</span>
              <ExternalLinkIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default EntityDetailPanel;
