import type { EntityInfo } from '../../../services/entities';
import type { AstroProfile } from '../../../types';
import { getRelatedEntities } from '../../../services/entities';
import { ChevronRightIcon } from '../../icons';
import { GeneKeyContent } from './GeneKeyContent';
import { HumanDesignContent } from './HumanDesignContent';
import { AstrologyContent } from './AstrologyContent';
import { ProfileContent } from './ProfileContent';

interface EntityPanelContentProps {
  entity: EntityInfo;
  colors: { bg: string; text: string };
  onEntityClick?: (entity: EntityInfo) => void;
  profile: AstroProfile | null;
  profileSpheres: { sphereName: string; planetarySource: string; signPlacement?: string }[];
}

const GENE_KEY_TYPES = new Set(['gene-key', 'codon-ring']);
const HD_TYPES = new Set(['hd-gate', 'hd-channel', 'hd-center', 'hd-type']);
const ASTROLOGY_TYPES = new Set(['planet', 'sign', 'house', 'element', 'aspect']);
const PROFILE_TYPES = new Set([
  'profile-placement', 'profile-gk-placement', 'profile-hd-placement',
  'profile-aspect', 'profile-channel', 'profile-configuration',
]);

export function EntityPanelContent({
  entity,
  colors,
  onEntityClick,
  profile,
  profileSpheres,
}: EntityPanelContentProps) {
  const relatedEntities = getRelatedEntities(entity.id);

  return (
    <div className="space-y-4">
      {/* Description */}
      {entity.description && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">
            Description
          </h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">
            {entity.description.length > 300
              ? `${entity.description.slice(0, 300)}...`
              : entity.description}
          </p>
        </div>
      )}

      {/* Keywords */}
      {entity.keywords && entity.keywords.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">
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

      {/* Type-specific content */}
      {GENE_KEY_TYPES.has(entity.type) && (
        <GeneKeyContent
          entity={entity}
          onEntityClick={onEntityClick}
          profile={profile}
          profileSpheres={profileSpheres}
        />
      )}

      {/* HD Gate also gets zodiac position from GeneKeyContent */}
      {entity.type === 'hd-gate' && (
        <GeneKeyContent
          entity={entity}
          onEntityClick={onEntityClick}
          profile={profile}
          profileSpheres={[]}
        />
      )}

      {HD_TYPES.has(entity.type) && (
        <HumanDesignContent entity={entity} onEntityClick={onEntityClick} />
      )}

      {ASTROLOGY_TYPES.has(entity.type) && (
        <AstrologyContent entity={entity} profile={profile} />
      )}

      {PROFILE_TYPES.has(entity.type) && (
        <ProfileContent entity={entity} />
      )}

      {/* Related Entities */}
      {relatedEntities.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">
            Related
          </h4>
          <div className="space-y-1">
            {relatedEntities.slice(0, 5).map((related) => (
              <button
                key={related.id}
                onClick={() => onEntityClick?.(related)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded
                  bg-surface-raised hover:bg-surface-interactive transition-colors text-left"
              >
                {related.symbol && (
                  <span className="text-sm opacity-60">{related.symbol}</span>
                )}
                <span className="text-sm text-theme-text-secondary flex-1 truncate">
                  {related.name}
                </span>
                <ChevronRightIcon className="w-3 h-3 text-theme-text-tertiary" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
