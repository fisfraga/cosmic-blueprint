import type { EntityInfo } from '../../../services/entities';
import type {
  AstroProfile,
  AstroPoint,
  Chakra,
  HDAuthorityEntity,
  HDLineEntity,
  HDProfileEntity,
  NumerologyNumber,
  PersonalContextProject,
  PersonalContext,
} from '../../../types';
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
const HD_AUTHORITY_TYPES = new Set(['hd-authority']);
const HD_PROFILE_TYPES = new Set(['hd-profile']);
const HD_LINE_TYPES = new Set(['hd-line', 'hd-variable']);
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

// ─── Point content renderer ─────────────────────────────────────────────────

function PointContent({ entity }: { entity: EntityInfo }) {
  const point = entity.data as AstroPoint;
  if (!point) return null;

  return (
    <div className="space-y-4">
      {/* Archetype badge */}
      {point.archetype && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary">
            {point.archetype}
          </span>
        </div>
      )}

      {/* Function and Meaning */}
      {point.functionAndMeaning && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Meaning</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{point.functionAndMeaning}</p>
        </div>
      )}

      {/* Contemplation questions */}
      {point.contemplationQuestions && point.contemplationQuestions.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">Reflections</h4>
          <div className="space-y-2">
            {point.contemplationQuestions.slice(0, 3).map((q, i) => (
              <p key={i} className="text-sm text-theme-text-secondary italic leading-relaxed border-l-2 border-theme-border-subtle pl-3">
                {q}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HD Authority content renderer ─────────────────────────────────────────

function HDAuthorityContent({ entity }: { entity: EntityInfo }) {
  const auth = entity.data as HDAuthorityEntity;
  if (!auth) return null;

  return (
    <div className="space-y-4">
      {/* Center + percentage badges */}
      <div className="flex flex-wrap items-center gap-2">
        {auth.centerId && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary">
            Centered in: {auth.centerId.replace('hd-center-', '').replace(/-/g, ' ')}
          </span>
        )}
        {auth.percentage && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            {auth.percentage} of people
          </span>
        )}
      </div>

      {/* Decision process */}
      {auth.decisionProcess && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Decision Process</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{auth.decisionProcess}</p>
        </div>
      )}

      {/* Timeframe */}
      {auth.timeframe && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Timeframe</h4>
          <p className="text-sm text-theme-text-secondary">{auth.timeframe}</p>
        </div>
      )}

      {/* Signs of correct / incorrect */}
      {auth.signs && (
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary">Signs</h4>
          {auth.signs.correct && (
            <div className="rounded-lg bg-surface-raised p-3">
              <div className="text-xs font-semibold mb-1 text-emerald-300">Correct Decision</div>
              <p className="text-xs text-theme-text-secondary leading-relaxed">{auth.signs.correct}</p>
            </div>
          )}
          {auth.signs.incorrect && (
            <div className="rounded-lg bg-surface-raised p-3">
              <div className="text-xs font-semibold mb-1 text-rose-300">Incorrect Decision</div>
              <p className="text-xs text-theme-text-secondary leading-relaxed">{auth.signs.incorrect}</p>
            </div>
          )}
        </div>
      )}

      {/* Practical guidance */}
      {auth.practicalGuidance && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Guidance</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{auth.practicalGuidance}</p>
        </div>
      )}
    </div>
  );
}

// ─── HD Profile content renderer ────────────────────────────────────────────

function HDProfileContent({ entity }: { entity: EntityInfo }) {
  const hdProfile = entity.data as HDProfileEntity;
  if (!hdProfile) return null;

  const profileLabel = `${hdProfile.personalityLine}/${hdProfile.designLine}`;

  return (
    <div className="space-y-4">
      {/* Profile number badge */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs px-3 py-0.5 rounded-full bg-surface-raised text-theme-text-secondary font-semibold">
          Profile {profileLabel}
        </span>
      </div>

      {/* Life Theme */}
      {hdProfile.lifeTheme && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Life Theme</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{hdProfile.lifeTheme}</p>
        </div>
      )}

      {/* Gifts and Challenges */}
      {hdProfile.gifts && hdProfile.gifts.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">Gifts</h4>
          <ul className="space-y-1">
            {hdProfile.gifts.map((g, i) => (
              <li key={i} className="text-sm text-theme-text-secondary flex gap-2">
                <span className="text-emerald-400 flex-shrink-0">+</span>
                <span className="leading-snug">{g}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {hdProfile.challenges && hdProfile.challenges.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">Challenges</h4>
          <ul className="space-y-1">
            {hdProfile.challenges.map((c, i) => (
              <li key={i} className="text-sm text-theme-text-secondary flex gap-2">
                <span className="text-amber-400 flex-shrink-0">~</span>
                <span className="leading-snug">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Relationship style */}
      {hdProfile.relationshipStyle && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Relationships</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{hdProfile.relationshipStyle}</p>
        </div>
      )}

      {/* Career guidance */}
      {hdProfile.careerGuidance && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Career</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{hdProfile.careerGuidance}</p>
        </div>
      )}

      {/* Practical guidance */}
      {hdProfile.practicalGuidance && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Guidance</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{hdProfile.practicalGuidance}</p>
        </div>
      )}
    </div>
  );
}

// ─── HD Line content renderer ────────────────────────────────────────────────

function HDLineContent({ entity }: { entity: EntityInfo }) {
  const line = entity.data as HDLineEntity;
  if (!line) return null;

  return (
    <div className="space-y-4">
      {/* Line number + archetype badges */}
      <div className="flex flex-wrap items-center gap-2">
        {line.lineNumber != null && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary font-semibold">
            Line {line.lineNumber}
          </span>
        )}
        {line.trigram && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            {line.trigram} Trigram
          </span>
        )}
      </div>

      {/* Archetype */}
      {line.archetype && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Archetype</h4>
          <p className="text-sm text-theme-text-secondary font-medium">{line.archetype}</p>
        </div>
      )}

      {/* Theme */}
      {line.theme && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Theme</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{line.theme}</p>
        </div>
      )}

      {/* Healthy / Unhealthy expressions */}
      {(line.healthyExpression || line.unhealthyExpression) && (
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary">Expressions</h4>
          {line.healthyExpression && (
            <div className="rounded-lg bg-surface-raised p-3">
              <div className="text-xs font-semibold mb-1 text-emerald-300">Healthy</div>
              <p className="text-xs text-theme-text-secondary leading-relaxed">{line.healthyExpression}</p>
            </div>
          )}
          {line.unhealthyExpression && (
            <div className="rounded-lg bg-surface-raised p-3">
              <div className="text-xs font-semibold mb-1 text-rose-300">Unhealthy</div>
              <p className="text-xs text-theme-text-secondary leading-relaxed">{line.unhealthyExpression}</p>
            </div>
          )}
        </div>
      )}

      {/* In Personality / In Design */}
      {(line.inPersonality || line.inDesign) && (
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary">Expressions by Position</h4>
          {line.inPersonality && (
            <div>
              <span className="text-xs font-medium text-theme-text-tertiary">In Personality (Conscious): </span>
              <span className="text-xs text-theme-text-secondary">{line.inPersonality}</span>
            </div>
          )}
          {line.inDesign && (
            <div>
              <span className="text-xs font-medium text-theme-text-tertiary">In Design (Unconscious): </span>
              <span className="text-xs text-theme-text-secondary">{line.inDesign}</span>
            </div>
          )}
        </div>
      )}

      {/* Gifts and Challenges */}
      {line.gifts && line.gifts.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">Gifts</h4>
          <ul className="space-y-1">
            {line.gifts.map((g, i) => (
              <li key={i} className="text-sm text-theme-text-secondary flex gap-2">
                <span className="text-emerald-400 flex-shrink-0">+</span>
                <span className="leading-snug">{g}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {line.challenges && line.challenges.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">Challenges</h4>
          <ul className="space-y-1">
            {line.challenges.map((c, i) => (
              <li key={i} className="text-sm text-theme-text-secondary flex gap-2">
                <span className="text-amber-400 flex-shrink-0">~</span>
                <span className="leading-snug">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Numerology content renderer ─────────────────────────────────────────────

function NumerologyContent({ entity }: { entity: EntityInfo }) {
  const num = entity.data as NumerologyNumber;
  if (!num) return null;

  const FREQ_COLORS = {
    lower: 'text-rose-300',
    aligned: 'text-sky-300',
    highest: 'text-violet-300',
  };

  return (
    <div className="space-y-4">
      {/* Number badge + master number indicator */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-lg font-bold px-3 py-0.5 rounded-full bg-surface-raised text-theme-text-secondary">
          {num.number}
        </span>
        {num.isMasterNumber && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-violet-300 font-semibold">
            Master Number
          </span>
        )}
      </div>

      {/* Archetype */}
      {num.archetype && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Archetype</h4>
          <p className="text-sm text-theme-text-secondary font-medium">{num.archetype}</p>
        </div>
      )}

      {/* Harmonic Tone — main description */}
      {num.harmonicTone && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Harmonic Tone</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{num.harmonicTone}</p>
        </div>
      )}

      {/* Correspondence badges */}
      <div className="flex flex-wrap gap-1.5">
        {num.planet && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            Planet: {num.planet}
          </span>
        )}
        {num.element && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            Element: {num.element}
          </span>
        )}
        {num.chakraId && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            Chakra: {num.chakraId.replace('chakra-', '').replace(/-/g, ' ')}
          </span>
        )}
      </div>

      {/* Three-frequency section */}
      <div className="space-y-2">
        <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary">Frequency Spectrum</h4>
        {num.lowerExpression && (
          <div className="rounded-lg bg-surface-raised p-3">
            <div className={`text-xs font-semibold mb-1 ${FREQ_COLORS.lower}`}>
              Lower — {num.lowerExpression.name}
            </div>
            <p className="text-xs text-theme-text-secondary leading-relaxed">{num.lowerExpression.expression}</p>
          </div>
        )}
        {num.alignedExpression && (
          <div className="rounded-lg bg-surface-raised p-3">
            <div className={`text-xs font-semibold mb-1 ${FREQ_COLORS.aligned}`}>
              Aligned — {num.alignedExpression.name}
            </div>
            <p className="text-xs text-theme-text-secondary leading-relaxed">{num.alignedExpression.expression}</p>
          </div>
        )}
        {num.highestExpression && (
          <div className="rounded-lg bg-surface-raised p-3">
            <div className={`text-xs font-semibold mb-1 ${FREQ_COLORS.highest}`}>
              Highest — {num.highestExpression.name}
            </div>
            <p className="text-xs text-theme-text-secondary leading-relaxed">{num.highestExpression.expression}</p>
          </div>
        )}
      </div>

      {/* Affirmation */}
      {num.affirmation && (
        <div className="rounded-lg border border-theme-border-subtle p-3 bg-surface-raised/50">
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Affirmation</h4>
          <p className="text-sm text-theme-text-secondary italic leading-relaxed">"{num.affirmation}"</p>
        </div>
      )}

      {/* Contemplative question */}
      {num.contemplativeQuestion && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Reflection</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{num.contemplativeQuestion}</p>
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

      {/* Point (North Node, South Node, Chiron, POF, Vertex, ASC, MC, etc.) */}
      {entity.type === 'point' && (
        <PointContent entity={entity} />
      )}

      {/* HD Authority */}
      {HD_AUTHORITY_TYPES.has(entity.type) && (
        <HDAuthorityContent entity={entity} />
      )}

      {/* HD Profile */}
      {HD_PROFILE_TYPES.has(entity.type) && (
        <HDProfileContent entity={entity} />
      )}

      {/* HD Line / HD Variable */}
      {HD_LINE_TYPES.has(entity.type) && (
        <HDLineContent entity={entity} />
      )}

      {/* Numerology number */}
      {entity.type === 'numerology-number' && (
        <NumerologyContent entity={entity} />
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
