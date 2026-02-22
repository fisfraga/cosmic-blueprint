import type { EntityInfo } from '../../../services/entities';
import type { AstroProfile, Chakra, PersonalContextProject, PersonalContext } from '../../../types';
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

// ─── Chakra content renderer ───────────────────────────────────────────────

function ChakraContent({ entity }: { entity: EntityInfo }) {
  const chakra = entity.data as Chakra;
  if (!chakra) return null;

  const STATUS_COLORS = {
    constricted: 'text-rose-300',
    flowing: 'text-emerald-300',
    radiant: 'text-violet-300',
  };

  return (
    <div className="space-y-4">
      {/* Number + Sanskrit name */}
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary">
          Chakra {chakra.number}
        </span>
        {chakra.sanskritName && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary italic">
            {chakra.sanskritName}
          </span>
        )}
        {chakra.element && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            {chakra.element}
          </span>
        )}
      </div>

      {/* Archetype + Life theme */}
      {chakra.archetype && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Archetype</h4>
          <p className="text-sm text-theme-text-secondary">{chakra.archetype}</p>
        </div>
      )}
      {chakra.lifeTheme && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Life Theme</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{chakra.lifeTheme}</p>
        </div>
      )}

      {/* Three-frequency section */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary">Frequencies</h4>
        {chakra.constricted && (
          <div className="rounded-lg bg-surface-raised p-3">
            <div className={`text-xs font-semibold mb-1 ${STATUS_COLORS.constricted}`}>
              Constricted — {chakra.constricted.name}
            </div>
            <p className="text-xs text-theme-text-secondary leading-relaxed">{chakra.constricted.expression}</p>
          </div>
        )}
        {chakra.flowing && (
          <div className="rounded-lg bg-surface-raised p-3">
            <div className={`text-xs font-semibold mb-1 ${STATUS_COLORS.flowing}`}>
              Flowing — {chakra.flowing.name}
            </div>
            <p className="text-xs text-theme-text-secondary leading-relaxed">{chakra.flowing.expression}</p>
          </div>
        )}
        {chakra.radiant && (
          <div className="rounded-lg bg-surface-raised p-3">
            <div className={`text-xs font-semibold mb-1 ${STATUS_COLORS.radiant}`}>
              Radiant — {chakra.radiant.name}
            </div>
            <p className="text-xs text-theme-text-secondary leading-relaxed">{chakra.radiant.expression}</p>
          </div>
        )}
      </div>

      {/* Body correlates */}
      {chakra.bodyCorrelates && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Body</h4>
          <p className="text-sm text-theme-text-secondary">{chakra.bodyCorrelates}</p>
        </div>
      )}

      {/* Affirmation */}
      {chakra.affirmation && (
        <div className="rounded-lg border border-theme-border-subtle p-3 bg-surface-raised/50">
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Affirmation</h4>
          <p className="text-sm text-theme-text-secondary italic leading-relaxed">"{chakra.affirmation}"</p>
        </div>
      )}

      {/* Contemplative question */}
      {chakra.contemplativeQuestion && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Reflection</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{chakra.contemplativeQuestion}</p>
        </div>
      )}
    </div>
  );
}

// ─── Personal project content renderer ─────────────────────────────────────

function PersonalProjectContent({ entity }: { entity: EntityInfo }) {
  const project = entity.data as PersonalContextProject;
  if (!project) return null;

  const STATUS_LABELS: Record<string, string> = {
    planning: 'Planning',
    active: 'Active',
    review: 'Review',
    paused: 'Paused',
  };
  const STATUS_COLORS: Record<string, string> = {
    planning: 'text-sky-300',
    active: 'text-emerald-300',
    review: 'text-amber-300',
    paused: 'text-theme-text-tertiary',
  };

  return (
    <div className="space-y-3">
      {project.status && (
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${STATUS_COLORS[project.status] || ''}`}>
            ● {STATUS_LABELS[project.status] || project.status}
          </span>
        </div>
      )}
      {project.description && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">About</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{project.description}</p>
        </div>
      )}
      {project.linkedKeyArea && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Life Area</h4>
          <p className="text-sm text-theme-text-secondary">
            {project.linkedKeyArea.replace('house-', 'House ')}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Occupation content renderer ───────────────────────────────────────────

function OccupationContent({ entity }: { entity: EntityInfo }) {
  const ctx = entity.data as Partial<PersonalContext> | undefined;
  if (!ctx) return null;

  const occupations = (ctx as { occupations?: string[] }).occupations || [];

  return (
    <div className="space-y-3">
      {occupations.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">Roles</h4>
          <div className="flex flex-wrap gap-1.5">
            {occupations.map((occ, i) => (
              <span key={i} className="px-2 py-0.5 text-xs rounded bg-surface-raised text-theme-text-secondary">
                {occ}
              </span>
            ))}
          </div>
        </div>
      )}
      {ctx.workStyle && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Work Style</h4>
          <p className="text-sm text-theme-text-secondary capitalize">{ctx.workStyle}</p>
        </div>
      )}
      {ctx.professionalGoals && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Goals</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{ctx.professionalGoals}</p>
        </div>
      )}
    </div>
  );
}

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

      {/* Chakra */}
      {entity.type === 'chakra' && (
        <ChakraContent entity={entity} />
      )}

      {/* Personal project */}
      {entity.type === 'personal-project' && (
        <PersonalProjectContent entity={entity} />
      )}

      {/* Occupation */}
      {entity.type === 'occupation' && (
        <OccupationContent entity={entity} />
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
