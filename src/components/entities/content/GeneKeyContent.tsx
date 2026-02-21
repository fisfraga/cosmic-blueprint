import type { EntityInfo } from '../../../services/entities';
import type { AstroProfile, GeneKeySphere } from '../../../types';
import { getEntity } from '../../../services/entities';
import { signs } from '../../../data';
import { getNestedStringValue } from '../entityPanelUtils';
import { SPHERE_DISPLAY_NAMES } from '../entityPanelConstants';

interface GeneKeyContentProps {
  entity: EntityInfo;
  onEntityClick?: (entity: EntityInfo) => void;
  profile: AstroProfile | null;
  profileSpheres: { sphereName: string; planetarySource: string; signPlacement?: string }[];
}

export function GeneKeyContent({ entity, onEntityClick, profile, profileSpheres }: GeneKeyContentProps) {
  const data = entity.data as Record<string, unknown>;

  return (
    <>
      {/* Shadow/Gift/Siddhi */}
      {entity.type === 'gene-key' && (
        <div className="space-y-2">
          {getNestedStringValue(data, 'shadow', 'name') && (
            <div className="flex items-center gap-2">
              <span className="w-16 text-xs text-gray-500">Shadow</span>
              <span className="text-sm text-red-400">
                {getNestedStringValue(data, 'shadow', 'name')}
              </span>
            </div>
          )}
          {getNestedStringValue(data, 'gift', 'name') && (
            <div className="flex items-center gap-2">
              <span className="w-16 text-xs text-gray-500">Gift</span>
              <span className="text-sm text-emerald-400">
                {getNestedStringValue(data, 'gift', 'name')}
              </span>
            </div>
          )}
          {getNestedStringValue(data, 'siddhi', 'name') && (
            <div className="flex items-center gap-2">
              <span className="w-16 text-xs text-gray-500">Siddhi</span>
              <span className="text-sm text-purple-400">
                {getNestedStringValue(data, 'siddhi', 'name')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Profile Sphere Placements */}
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

      {/* Zodiac Position (shared with HD Gate) */}
      <ZodiacPosition entity={entity} onEntityClick={onEntityClick} />

      {/* Codon Ring */}
      {entity.type === 'codon-ring' && (
        <CodonRingContent entity={entity} onEntityClick={onEntityClick} profile={profile} />
      )}
    </>
  );
}

function ZodiacPosition({ entity, onEntityClick }: { entity: EntityInfo; onEntityClick?: (entity: EntityInfo) => void }) {
  if (entity.type !== 'gene-key' && entity.type !== 'hd-gate') return null;

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
}

function CodonRingContent({ entity, onEntityClick, profile }: { entity: EntityInfo; onEntityClick?: (entity: EntityInfo) => void; profile: AstroProfile | null }) {
  const ring = entity.data as Record<string, unknown>;
  const geneKeyIds = Array.isArray(ring.geneKeyIds) ? ring.geneKeyIds as string[] : [];

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
    <>
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
    </>
  );
}
