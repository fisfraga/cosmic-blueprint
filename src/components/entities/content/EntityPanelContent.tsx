import type { EntityInfo } from '../../../services/entities';
import type {
  AstroProfile,
  AspectConfiguration,
  AstroPoint,
  Chakra,
  Decan,
  FixedStar,
  GalacticPoint,
  GKSphereEntity,
  GKSequenceEntity,
  HDAuthorityEntity,
  HDGate72,
  HDLineEntity,
  HDProfileEntity,
  HDStrategyEntity,
  HDVariableEntity,
  HermeticPrinciple,
  NumerologyNumber,
  AminoAcid,
  Trigram,
  Line,
  PersonalContextProject,
  PersonalContext,
} from '../../../types';
import type { DignityEntry } from '../../../data';
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
const HD_LINE_TYPES = new Set(['hd-line']);
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

// ─── Galactic Point content renderer ────────────────────────────────────────

function GalacticPointContent({ entity }: { entity: EntityInfo }) {
  const gp = entity.data as GalacticPoint;
  if (!gp) return null;

  const signLabel = gp.zodiacSign
    ? gp.zodiacSign.charAt(0).toUpperCase() + gp.zodiacSign.slice(1)
    : '';

  return (
    <div className="space-y-4">
      {/* Position + archetype badges */}
      <div className="flex flex-wrap items-center gap-2">
        {(gp.zodiacDegree != null || gp.zodiacMinute != null) && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary font-mono">
            {gp.zodiacDegree ?? 0}°{gp.zodiacMinute ?? 0}' {signLabel}
          </span>
        )}
        {gp.archetype && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary italic">
            {gp.archetype}
          </span>
        )}
      </div>

      {/* Description */}
      {gp.description && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">About</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{gp.description}</p>
        </div>
      )}

      {/* Cosmic Gift */}
      {gp.gift && (
        <div className="rounded-lg bg-surface-raised p-3">
          <div className="text-xs font-semibold mb-1 text-teal-300">Cosmic Gift</div>
          <p className="text-xs text-theme-text-secondary leading-relaxed">{gp.gift}</p>
        </div>
      )}

      {/* Integration Challenge */}
      {gp.challenge && (
        <div className="rounded-lg bg-surface-raised p-3">
          <div className="text-xs font-semibold mb-1 text-amber-300">Integration Challenge</div>
          <p className="text-xs text-theme-text-secondary leading-relaxed">{gp.challenge}</p>
        </div>
      )}

      {/* Contemplation Theme */}
      {gp.contemplationTheme && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Contemplation Theme</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{gp.contemplationTheme}</p>
        </div>
      )}
    </div>
  );
}

// ─── Decan content renderer ──────────────────────────────────────────────────

function DecanContent({ entity }: { entity: EntityInfo }) {
  const decan = entity.data as Decan;
  if (!decan) return null;

  const capitalizeId = (id: string) =>
    id ? id.charAt(0).toUpperCase() + id.slice(1) : '';

  const isDifferentModern =
    decan.modernRulingPlanetId &&
    decan.modernRulingPlanetId !== decan.rulingPlanetId;

  return (
    <div className="space-y-4">
      {/* Decan number + sign badges */}
      <div className="flex flex-wrap items-center gap-2">
        {decan.decanNumber != null && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary font-semibold">
            Decan {decan.decanNumber}
          </span>
        )}
        {decan.zodiacSignId && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary">
            {capitalizeId(decan.zodiacSignId)}
          </span>
        )}
        {decan.elementId && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            {capitalizeId(decan.elementId)}
          </span>
        )}
      </div>

      {/* Active Period */}
      {decan.dateRange && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Active Period</h4>
          <p className="text-sm text-theme-text-secondary">{decan.dateRange}</p>
        </div>
      )}

      {/* Archetype */}
      {decan.archetype && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Archetype</h4>
          <p className="text-sm text-theme-text-secondary font-medium">{decan.archetype}</p>
        </div>
      )}

      {/* Ruling planets */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">Ruling Planets</h4>
        <div className="flex flex-wrap gap-1.5">
          {decan.rulingPlanetId && (
            <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary">
              {capitalizeId(decan.rulingPlanetId)} (traditional)
            </span>
          )}
          {isDifferentModern && (
            <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary">
              {capitalizeId(decan.modernRulingPlanetId)} (modern)
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {decan.description && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">About</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{decan.description}</p>
        </div>
      )}

      {/* Complementary decan reference */}
      {decan.complementaryDecanId && (
        <div>
          <span className="text-xs text-theme-text-tertiary">
            Complementary: <span className="text-theme-text-secondary">{decan.complementaryDecanId}</span>
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Hermetic Principle content renderer ─────────────────────────────────────

function HermeticContent({ entity }: { entity: EntityInfo }) {
  const hp = entity.data as HermeticPrinciple;
  if (!hp) return null;

  const FREQ_COLORS = {
    shadow: 'text-rose-300',
    gift: 'text-emerald-300',
    siddhi: 'text-violet-300',
  };

  return (
    <div className="space-y-4">
      {/* Number + latin name */}
      <div className="flex flex-wrap items-center gap-2">
        {hp.number != null && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary font-semibold">
            Principle {hp.number}
          </span>
        )}
        {hp.latinName && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary italic">
            {hp.latinName}
          </span>
        )}
      </div>

      {/* Statement — prominent */}
      {hp.statement && (
        <div className="rounded-lg border border-theme-border-subtle p-3 bg-surface-raised/50">
          <p className="text-sm text-theme-text-secondary italic leading-relaxed font-medium">
            "{hp.statement}"
          </p>
        </div>
      )}

      {/* Essence */}
      {hp.essence && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Essence</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{hp.essence}</p>
        </div>
      )}

      {/* Three-frequency section */}
      <div className="space-y-2">
        <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary">Frequency Spectrum</h4>
        {hp.shadow?.expression && (
          <div className="rounded-lg bg-surface-raised p-3">
            <div className={`text-xs font-semibold mb-1 ${FREQ_COLORS.shadow}`}>Shadow</div>
            <p className="text-xs text-theme-text-secondary leading-relaxed">{hp.shadow.expression}</p>
          </div>
        )}
        {hp.gift?.expression && (
          <div className="rounded-lg bg-surface-raised p-3">
            <div className={`text-xs font-semibold mb-1 ${FREQ_COLORS.gift}`}>Gift</div>
            <p className="text-xs text-theme-text-secondary leading-relaxed">{hp.gift.expression}</p>
          </div>
        )}
        {hp.siddhi?.expression && (
          <div className="rounded-lg bg-surface-raised p-3">
            <div className={`text-xs font-semibold mb-1 ${FREQ_COLORS.siddhi}`}>Siddhi</div>
            <p className="text-xs text-theme-text-secondary leading-relaxed">{hp.siddhi.expression}</p>
          </div>
        )}
      </div>

      {/* Practice */}
      {hp.practice && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Practice</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{hp.practice}</p>
        </div>
      )}

      {/* Correspondence badges */}
      <div className="flex flex-wrap gap-1.5">
        {hp.element && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            Element: {hp.element}
          </span>
        )}
        {hp.planet && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            Planet: {hp.planet}
          </span>
        )}
      </div>

      {/* Astrology Application */}
      {hp.astrologyApplication && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Astrology Application</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{hp.astrologyApplication}</p>
        </div>
      )}

      {/* Gene Keys Application */}
      {hp.geneKeysApplication && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Gene Keys Application</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{hp.geneKeysApplication}</p>
        </div>
      )}

      {/* Contemplative Question */}
      {hp.contemplativeQuestion && (
        <div className="rounded-lg border border-theme-border-subtle p-3 bg-surface-raised/50">
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Reflection</h4>
          <p className="text-sm text-theme-text-secondary italic leading-relaxed">{hp.contemplativeQuestion}</p>
        </div>
      )}
    </div>
  );
}

// ─── GK Sphere content renderer ──────────────────────────────────────────────

function GKSphereContent({ entity }: { entity: EntityInfo }) {
  const sphere = entity.data as GKSphereEntity;
  if (!sphere) return null;

  const formatSequence = (seq: string) => {
    if (!seq) return '';
    // "Activation" → "Activation Sequence", "Venus" → "Venus Sequence", etc.
    if (seq === 'Activation' || seq === 'Venus' || seq === 'Pearl') {
      return `${seq} Sequence`;
    }
    return seq;
  };

  return (
    <div className="space-y-4">
      {/* Sequence badge */}
      {sphere.sequence && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary">
            {formatSequence(sphere.sequence)}
          </span>
          {sphere.planetarySource && (
            <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
              {sphere.planetarySource}
            </span>
          )}
        </div>
      )}

      {/* Theme */}
      {sphere.theme && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Theme</h4>
          <p className="text-sm text-theme-text-secondary font-medium">{sphere.theme}</p>
        </div>
      )}

      {/* Question */}
      {sphere.question && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Core Question</h4>
          <p className="text-sm text-theme-text-secondary italic leading-relaxed border-l-2 border-theme-border-subtle pl-3">
            {sphere.question}
          </p>
        </div>
      )}

      {/* Practical Guidance */}
      {sphere.practicalGuidance && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Practical Guidance</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{sphere.practicalGuidance}</p>
        </div>
      )}

      {/* Relationship (to partner sphere) */}
      {sphere.relationship && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Sphere Relationship</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{sphere.relationship}</p>
        </div>
      )}

      {/* Partner sphere reference */}
      {sphere.partnerSphere && (
        <div>
          <span className="text-xs text-theme-text-tertiary">
            Partner Sphere: <span className="text-theme-text-secondary">{sphere.partnerSphere}</span>
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Fixed Star content renderer ─────────────────────────────────────────────

function FixedStarContent({ entity }: { entity: EntityInfo }) {
  const star = entity.data as FixedStar;
  if (!star) return null;

  const zp = star.zodiacPosition;
  const signLabel = zp?.sign
    ? zp.sign.charAt(0).toUpperCase() + zp.sign.slice(1)
    : '';

  return (
    <div className="space-y-4">
      {/* Position row */}
      <div className="flex flex-wrap items-center gap-2">
        {zp && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary font-mono">
            {zp.degree}°{zp.minute}' {signLabel}
          </span>
        )}
        {star.constellation && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            {star.constellation}
          </span>
        )}
        {star.magnitude != null && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            {star.magnitude} mag
          </span>
        )}
      </div>

      {/* Royal Star / Behenian badges */}
      {(star.isRoyalStar || star.isBehenian) && (
        <div className="flex flex-wrap items-center gap-2">
          {star.isRoyalStar && (
            <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-amber-300 font-semibold">
              Royal Star{star.royalStarTitle ? ` — ${star.royalStarTitle}` : ''}
            </span>
          )}
          {star.isBehenian && (
            <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-indigo-300 font-semibold">
              Behenian Star
            </span>
          )}
        </div>
      )}

      {/* Planetary nature */}
      {star.nature && star.nature.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">Planetary Nature</h4>
          <div className="flex flex-wrap gap-1.5">
            {star.nature.map((planet, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary">
                {planet}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Alternate names */}
      {star.alternateNames && star.alternateNames.length > 0 && (
        <p className="text-xs text-theme-text-tertiary italic">
          Also known as: {star.alternateNames.join(', ')}
        </p>
      )}

      {/* Archetype */}
      {star.archetype && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Archetype</h4>
          <p className="text-sm text-theme-text-secondary font-medium">{star.archetype}</p>
        </div>
      )}

      {/* Gift / Shadow */}
      {(star.giftExpression || star.shadowExpression) && (
        <div className="space-y-2">
          {star.giftExpression && (
            <div className="rounded-lg bg-surface-raised p-3">
              <div className="text-xs font-semibold mb-1 text-emerald-300">Gift Expression</div>
              <p className="text-xs text-theme-text-secondary leading-relaxed">{star.giftExpression}</p>
            </div>
          )}
          {star.shadowExpression && (
            <div className="rounded-lg bg-surface-raised p-3">
              <div className="text-xs font-semibold mb-1 text-rose-300">Shadow Expression</div>
              <p className="text-xs text-theme-text-secondary leading-relaxed">{star.shadowExpression}</p>
            </div>
          )}
        </div>
      )}

      {/* Traditional Meaning */}
      {star.traditionalMeaning && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Traditional Meaning</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{star.traditionalMeaning}</p>
        </div>
      )}

      {/* Body Association */}
      {star.bodyAssociation && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-theme-text-tertiary">Body:</span>
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary">
            {star.bodyAssociation}
          </span>
        </div>
      )}

      {/* Contemplation Questions */}
      {star.contemplationQuestions && star.contemplationQuestions.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">Reflections</h4>
          <div className="space-y-2">
            {star.contemplationQuestions.slice(0, 3).map((q, i) => (
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

// ─── Configuration content renderer ──────────────────────────────────────────

function ConfigurationContent({ entity }: { entity: EntityInfo }) {
  const config = entity.data as AspectConfiguration;
  if (!config) return null;

  const NATURE_COLORS: Record<string, string> = {
    Harmonious: 'text-emerald-300',
    Challenging: 'text-amber-400',
    Neutral: 'text-sky-300',
  };
  const NATURE_BG: Record<string, string> = {
    Harmonious: 'bg-emerald-950/40',
    Challenging: 'bg-amber-950/40',
    Neutral: 'bg-sky-950/40',
  };

  const natureColor = NATURE_COLORS[config.nature] || 'text-theme-text-secondary';
  const natureBg = NATURE_BG[config.nature] || 'bg-surface-raised';

  return (
    <div className="space-y-4">
      {/* Keyword + nature + shape badges */}
      <div className="flex flex-wrap items-center gap-2">
        {config.keyword && (
          <span className={`text-xs px-3 py-0.5 rounded-full font-semibold ${natureBg} ${natureColor}`}>
            {config.keyword}
          </span>
        )}
        {config.nature && (
          <span className={`text-xs px-2 py-0.5 rounded bg-surface-raised ${natureColor}`}>
            {config.nature}
          </span>
        )}
        {config.shape && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            {config.shape}
          </span>
        )}
      </div>

      {/* Orb range + aspect count */}
      <div className="flex flex-wrap items-center gap-2">
        {config.orbRange && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            Orb: {config.orbRange}
          </span>
        )}
        {config.requiredAspectCount != null && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            {config.requiredAspectCount} aspects
          </span>
        )}
      </div>

      {/* Elemental pattern callout */}
      {config.elementalPattern && (
        <div className="rounded-lg border border-theme-border-subtle px-3 py-2 bg-surface-raised/40">
          <p className="text-xs text-theme-text-tertiary italic">{config.elementalPattern}</p>
        </div>
      )}

      {/* Explanation */}
      {config.explanation && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Sacred Geometry</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{config.explanation}</p>
        </div>
      )}

      {/* Impact */}
      {config.impact && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">How It Manifests</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{config.impact}</p>
        </div>
      )}

      {/* Integration Practice */}
      {config.integrationPractice && (
        <div className="rounded-lg border border-theme-border-subtle p-3 bg-surface-raised/50">
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Practice</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{config.integrationPractice}</p>
        </div>
      )}
    </div>
  );
}

// ─── HD Strategy content renderer ─────────────────────────────────────────────

function HDStrategyContent({ entity }: { entity: EntityInfo }) {
  const strategy = entity.data as HDStrategyEntity;
  if (!strategy) return null;

  const formatTypeLabel = (typeId: string) =>
    typeId
      .replace('hd-type-', '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-4">
      {/* HD Type association badges */}
      {strategy.hdTypeIds && strategy.hdTypeIds.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">For HD Types</h4>
          <div className="flex flex-wrap gap-1.5">
            {strategy.hdTypeIds.map((typeId, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded bg-surface-raised text-amber-300 font-semibold">
                {formatTypeLabel(typeId)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Practical Guidance */}
      {strategy.practicalGuidance && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Practical Guidance</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{strategy.practicalGuidance}</p>
        </div>
      )}

      {/* Sign of Correctness / Incorrectness */}
      {(strategy.signOfCorrectness || strategy.signOfIncorrectness) && (
        <div className="space-y-2">
          {strategy.signOfCorrectness && (
            <div className="rounded-lg bg-surface-raised p-3">
              <div className="text-xs font-semibold mb-1 text-emerald-300">Sign of Correctness</div>
              <p className="text-xs text-theme-text-secondary leading-relaxed">{strategy.signOfCorrectness}</p>
            </div>
          )}
          {strategy.signOfIncorrectness && (
            <div className="rounded-lg bg-surface-raised p-3">
              <div className="text-xs font-semibold mb-1 text-rose-300">Sign of Incorrectness</div>
              <p className="text-xs text-theme-text-secondary leading-relaxed">{strategy.signOfIncorrectness}</p>
            </div>
          )}
        </div>
      )}

      {/* Keywords */}
      {strategy.keywords && strategy.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {strategy.keywords.map((kw, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Examples */}
      {strategy.examples && strategy.examples.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">Examples</h4>
          <ul className="space-y-1.5">
            {strategy.examples.map((ex, i) => (
              <li key={i} className="text-sm text-theme-text-secondary flex gap-2">
                <span className="text-sky-400 flex-shrink-0 mt-0.5">›</span>
                <span className="leading-snug">{ex}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Common Misunderstandings */}
      {strategy.commonMisunderstandings && strategy.commonMisunderstandings.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">Common Misunderstandings</h4>
          <ul className="space-y-1.5">
            {strategy.commonMisunderstandings.map((m, i) => (
              <li key={i} className="text-sm text-theme-text-secondary flex gap-2">
                <span className="text-amber-400 flex-shrink-0 mt-0.5">~</span>
                <span className="leading-snug">{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── GK Sequence content renderer ─────────────────────────────────────────────

function GKSequenceContent({ entity }: { entity: EntityInfo }) {
  const seq = entity.data as GKSequenceEntity;
  if (!seq) return null;

  return (
    <div className="space-y-4">
      {/* Sequence order badge */}
      <div className="flex flex-wrap items-center gap-2">
        {seq.sequenceOrder != null && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary font-semibold">
            Sequence {seq.sequenceOrder}
          </span>
        )}
        {entity.symbol && (
          <span className="text-base opacity-70">{entity.symbol}</span>
        )}
      </div>

      {/* Theme */}
      {seq.theme && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Theme</h4>
          <p className="text-sm text-theme-text-secondary font-medium">{seq.theme}</p>
        </div>
      )}

      {/* Primary Question — prominent italic bordered card */}
      {seq.primaryQuestion && (
        <div className="rounded-lg border border-theme-border-subtle p-3 bg-surface-raised/50">
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Primary Question</h4>
          <p className="text-sm text-theme-text-secondary italic leading-relaxed">
            {seq.primaryQuestion}
          </p>
        </div>
      )}

      {/* Description */}
      {seq.description && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">About</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{seq.description}</p>
        </div>
      )}

      {/* Spheres in this sequence */}
      {seq.spheres && seq.spheres.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">Spheres</h4>
          <div className="flex flex-wrap gap-1.5">
            {seq.spheres.map((sphere, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary capitalize">
                {sphere.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contemplation Focus */}
      {seq.contemplationFocus && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Contemplation Focus</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed italic">{seq.contemplationFocus}</p>
        </div>
      )}

      {/* Key Integration Insight */}
      {seq.transformation && (
        <div className="rounded-lg bg-surface-raised p-3">
          <div className="text-xs font-semibold mb-1 text-violet-300">Key Integration</div>
          <p className="text-xs text-theme-text-secondary leading-relaxed">{seq.transformation}</p>
        </div>
      )}

      {/* Practical Guidance */}
      {seq.practicalGuidance && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Guidance</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{seq.practicalGuidance}</p>
        </div>
      )}
    </div>
  );
}

// ─── HD Variable content renderer ─────────────────────────────────────────────

function HDVariableContent({ entity }: { entity: EntityInfo }) {
  const variable = entity.data as HDVariableEntity;
  if (!variable) return null;

  return (
    <div className="space-y-4">
      {/* Category + Arrow badges */}
      <div className="flex flex-wrap items-center gap-2">
        {variable.category && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-amber-300 font-semibold">
            {variable.category}
          </span>
        )}
        {variable.arrow && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary">
            {variable.arrow} Arrow
          </span>
        )}
        {variable.arrowPosition && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            {variable.arrowPosition}
          </span>
        )}
      </div>

      {/* Color / Tone badge */}
      {(variable.color != null || variable.colorName) && (
        <div className="flex flex-wrap items-center gap-2">
          {variable.color != null && variable.colorName && (
            <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-sky-300">
              Color {variable.color}: {variable.colorName}
            </span>
          )}
          {variable.tone != null && (
            <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
              Tone {variable.tone}
            </span>
          )}
        </div>
      )}

      {/* Category description */}
      {variable.categoryDescription && (
        <p className="text-xs text-theme-text-tertiary italic leading-relaxed">{variable.categoryDescription}</p>
      )}

      {/* Description */}
      {variable.description && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">About</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{variable.description}</p>
        </div>
      )}

      {/* Physical Application */}
      {variable.physicalApplication && (
        <div className="rounded-lg bg-surface-raised p-3">
          <div className="text-xs font-semibold mb-1 text-emerald-300">Physical Application</div>
          <p className="text-xs text-theme-text-secondary leading-relaxed">{variable.physicalApplication}</p>
        </div>
      )}

      {/* Mental / Psychological Application */}
      {variable.mentalApplication && (
        <div className="rounded-lg bg-surface-raised p-3">
          <div className="text-xs font-semibold mb-1 text-sky-300">Mental Application</div>
          <p className="text-xs text-theme-text-secondary leading-relaxed">{variable.mentalApplication}</p>
        </div>
      )}

      {/* Healthy / Unhealthy Expressions (Motivation category) */}
      {(variable.healthyExpression || variable.unhealthyExpression) && (
        <div className="space-y-2">
          {variable.healthyExpression && (
            <div className="rounded-lg bg-surface-raised p-3">
              <div className="text-xs font-semibold mb-1 text-emerald-300">Healthy</div>
              <p className="text-xs text-theme-text-secondary leading-relaxed">{variable.healthyExpression}</p>
            </div>
          )}
          {variable.unhealthyExpression && (
            <div className="rounded-lg bg-surface-raised p-3">
              <div className="text-xs font-semibold mb-1 text-rose-300">Unhealthy</div>
              <p className="text-xs text-theme-text-secondary leading-relaxed">{variable.unhealthyExpression}</p>
            </div>
          )}
        </div>
      )}

      {/* Practical Guidance */}
      {variable.practicalGuidance && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Practical Guidance</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{variable.practicalGuidance}</p>
        </div>
      )}
    </div>
  );
}

// ─── Amino Acid content renderer ───────────────────────────────────────────────

function AminoAcidContent({ entity }: { entity: EntityInfo }) {
  const acid = entity.data as AminoAcid;
  if (!acid) return null;

  const formatGeneKeyId = (id: string) => {
    // "gk-10" → "Gene Key 10"
    return id.replace('gk-', 'Gene Key ');
  };

  const formatRingId = (id: string) => {
    // "ring-of-humanity" → "Ring of Humanity"
    return id
      .replace('ring-of-', 'Ring of ')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="space-y-4">
      {/* Abbreviation + symbol + type badges */}
      <div className="flex flex-wrap items-center gap-2">
        {acid.abbreviation && (
          <span className="text-xs px-3 py-0.5 rounded-full bg-surface-raised text-theme-text-secondary font-mono font-bold">
            {acid.abbreviation}
          </span>
        )}
        {entity.symbol && acid.symbol && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary">
            {acid.symbol}
          </span>
        )}
        {acid.aminoAcidType && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-amber-300 font-semibold">
            {acid.aminoAcidType}
          </span>
        )}
      </div>

      {/* Chemical Nature — brief italic callout */}
      {acid.chemicalNature && (
        <p className="text-xs text-theme-text-tertiary italic leading-relaxed border-l-2 border-theme-border-subtle pl-3">
          {acid.chemicalNature}
        </p>
      )}

      {/* Physiological Role */}
      {acid.physiologicalRole && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Physical Function</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{acid.physiologicalRole}</p>
        </div>
      )}

      {/* Consciousness Quality — the key Gene Keys insight */}
      {acid.consciousnessQuality && (
        <div className="rounded-lg bg-surface-raised p-3">
          <div className="text-xs font-semibold mb-1 text-violet-300">Consciousness Quality</div>
          <p className="text-xs text-theme-text-secondary leading-relaxed">{acid.consciousnessQuality}</p>
        </div>
      )}

      {/* Codon Ring association */}
      {acid.codonRingId && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-theme-text-tertiary">Codon Ring:</span>
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary">
            {formatRingId(acid.codonRingId)}
          </span>
        </div>
      )}

      {/* Gene Key IDs as badges */}
      {acid.geneKeyIds && acid.geneKeyIds.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">Gene Keys</h4>
          <div className="flex flex-wrap gap-1.5">
            {acid.geneKeyIds.map((id, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary">
                {formatGeneKeyId(id)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Trigram content renderer ──────────────────────────────────────────────────

function TrigramContent({ entity }: { entity: EntityInfo }) {
  const trigram = entity.data as Trigram;
  if (!trigram) return null;

  // Render I Ching line visual (yang = solid bar, yin = broken bar)
  const renderLine = (lineType: 'yin' | 'yang', idx: number) => {
    if (lineType === 'yang') {
      return (
        <div key={idx} className="h-2 bg-theme-text-secondary rounded-sm opacity-80" />
      );
    }
    // yin: two short bars with gap in middle
    return (
      <div key={idx} className="flex gap-1">
        <div className="h-2 flex-1 bg-theme-text-secondary rounded-sm opacity-80" />
        <div className="h-2 w-3" />
        <div className="h-2 flex-1 bg-theme-text-secondary rounded-sm opacity-80" />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Chinese name + symbol + number badges */}
      <div className="flex flex-wrap items-center gap-2">
        {trigram.chineseName && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary font-medium">
            {trigram.chineseName}
          </span>
        )}
        {entity.symbol && (
          <span className="text-base opacity-80">{entity.symbol}</span>
        )}
        {trigram.trigramNumber != null && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            #{trigram.trigramNumber}
          </span>
        )}
      </div>

      {/* Three-line visual representation */}
      {trigram.lines && trigram.lines.length === 3 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-2">Lines</h4>
          <div className="w-24 space-y-1.5">
            {/* Render top-to-bottom: lines[2] is top, lines[0] is bottom */}
            {[...trigram.lines].reverse().map((l, idx) => renderLine(l, idx))}
          </div>
        </div>
      )}

      {/* Nature + attribute + element badges */}
      <div className="flex flex-wrap gap-1.5">
        {trigram.nature && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary">
            {trigram.nature}
          </span>
        )}
        {trigram.attribute && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary">
            {trigram.attribute}
          </span>
        )}
        {trigram.element && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            {trigram.element}
          </span>
        )}
        {trigram.direction && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            {trigram.direction}
          </span>
        )}
        {trigram.season && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            {trigram.season}
          </span>
        )}
        {trigram.bodyPart && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            Body: {trigram.bodyPart}
          </span>
        )}
      </div>

      {/* Image and Meaning */}
      {trigram.image && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Image</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{trigram.image}</p>
        </div>
      )}

      {/* Description */}
      {trigram.description && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Meaning</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{trigram.description}</p>
        </div>
      )}

      {/* Gene Keys correlation */}
      {trigram.geneKeyCorrelation && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Gene Keys Correlation</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{trigram.geneKeyCorrelation}</p>
        </div>
      )}

      {/* Upper / Lower Trigram meaning */}
      {(trigram.upperTrigram || trigram.lowerTrigram) && (
        <div className="space-y-2">
          {trigram.upperTrigram && (
            <div className="rounded-lg bg-surface-raised p-3">
              <div className="text-xs font-semibold mb-1 text-sky-300">As Upper Trigram</div>
              <p className="text-xs text-theme-text-secondary leading-relaxed">{trigram.upperTrigram}</p>
            </div>
          )}
          {trigram.lowerTrigram && (
            <div className="rounded-lg bg-surface-raised p-3">
              <div className="text-xs font-semibold mb-1 text-amber-300">As Lower Trigram</div>
              <p className="text-xs text-theme-text-secondary leading-relaxed">{trigram.lowerTrigram}</p>
            </div>
          )}
        </div>
      )}

      {/* Keywords */}
      {trigram.keywords && trigram.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {trigram.keywords.map((kw, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Line (unified GK + HD) content renderer ──────────────────────────────────

function LineContent({ entity }: { entity: EntityInfo }) {
  const line = entity.data as Line;
  if (!line) return null;

  const gk = line.geneKeys;
  const hd = line.humanDesign;

  return (
    <div className="space-y-4">
      {/* Line number + archetype + trigram badges */}
      <div className="flex flex-wrap items-center gap-2">
        {line.lineNumber != null && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary font-semibold">
            Line {line.lineNumber}
          </span>
        )}
        {line.trigram && line.trigramPosition && (
          <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            {line.trigram} Trigram – {line.trigramPosition}
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

      {/* Summary */}
      {line.summary && (
        <div>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{line.summary}</p>
        </div>
      )}

      {/* Gene Keys: Gift / Shadow — two-card block */}
      {gk && (gk.gift || gk.shadow) && (
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary">Gene Keys Spectrum</h4>
          {gk.gift && (
            <div className="rounded-lg bg-surface-raised p-3">
              <div className="text-xs font-semibold mb-1 text-emerald-300">Gift</div>
              <p className="text-xs text-theme-text-secondary leading-relaxed">{gk.gift}</p>
            </div>
          )}
          {gk.shadow && (
            <div className="rounded-lg bg-surface-raised p-3">
              <div className="text-xs font-semibold mb-1 text-rose-300">Shadow</div>
              <p className="text-xs text-theme-text-secondary leading-relaxed">{gk.shadow}</p>
            </div>
          )}
        </div>
      )}

      {/* Human Design context */}
      {hd && (hd.healthyExpression || hd.unhealthyExpression) && (
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary">Human Design</h4>
          {hd.healthyExpression && (
            <div className="rounded-lg bg-surface-raised p-3">
              <div className="text-xs font-semibold mb-1 text-emerald-300">Healthy Expression</div>
              <p className="text-xs text-theme-text-secondary leading-relaxed">{hd.healthyExpression}</p>
            </div>
          )}
          {hd.unhealthyExpression && (
            <div className="rounded-lg bg-surface-raised p-3">
              <div className="text-xs font-semibold mb-1 text-rose-300">Unhealthy Expression</div>
              <p className="text-xs text-theme-text-secondary leading-relaxed">{hd.unhealthyExpression}</p>
            </div>
          )}
        </div>
      )}

      {/* HD: In Personality / In Design */}
      {hd && (hd.inPersonality || hd.inDesign) && (
        <div className="space-y-1">
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">HD Position Expressions</h4>
          {hd.inPersonality && (
            <div>
              <span className="text-xs font-medium text-theme-text-tertiary">Personality (Conscious): </span>
              <span className="text-xs text-theme-text-secondary">{hd.inPersonality}</span>
            </div>
          )}
          {hd.inDesign && (
            <div>
              <span className="text-xs font-medium text-theme-text-tertiary">Design (Unconscious): </span>
              <span className="text-xs text-theme-text-secondary">{hd.inDesign}</span>
            </div>
          )}
        </div>
      )}

      {/* Keywords */}
      {line.keywords && line.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {line.keywords.map((kw, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Lost Octave gate content renderer ────────────────────────────────────────

function LostOctaveGateContent({ entity }: { entity: EntityInfo }) {
  const gate = entity.data as HDGate72 & { isMasterGate?: boolean; decanNumber?: number };
  if (!gate) return null;

  const isMasterGate = gate.isMasterGate ?? false;
  const decanNumber = gate.decanNumber ?? Math.ceil(gate.segmentNumber / 2);

  return (
    <div className="space-y-4">
      {/* Segment + master badge */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-secondary font-semibold">
          Segment {gate.segmentNumber} of 72
        </span>
        {isMasterGate && (
          <span className="text-xs px-2 py-0.5 rounded bg-humandesign-500/30 text-humandesign-300 font-medium">
            Master Gate
          </span>
        )}
        <span className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
          Decan {decanNumber}
        </span>
      </div>

      {/* Zodiac span */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Zodiac Span</h4>
        <p className="text-sm text-theme-text-secondary capitalize">
          {gate.startDegree.toFixed(1)}° {gate.startSign} &ndash; 5° arc
        </p>
        <p className="text-xs text-theme-text-tertiary mt-0.5">
          {gate.degreeStart.toFixed(2)}° &ndash; {gate.degreeEnd.toFixed(2)}° (absolute)
        </p>
      </div>

      {/* HD Bridge */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">HD 64-Gate Overlap</h4>
        <p className="text-sm text-theme-text-secondary">
          Gate {gate.overlapping64GateSegment}
        </p>
      </div>

      {/* View full detail link */}
      <div className="pt-2">
        <a
          href={`/library/lost-octave/${gate.id}`}
          className="text-xs text-humandesign-400 hover:text-humandesign-300 transition-colors"
        >
          View full detail &#8250;
        </a>
      </div>
    </div>
  );
}

// ─── Dignity content renderer ──────────────────────────────────────────────────

function DignityContent({ entity }: { entity: EntityInfo }) {
  const dignity = entity.data as DignityEntry;
  if (!dignity) return null;

  const capitalizeId = (id: string) =>
    id ? id.charAt(0).toUpperCase() + id.slice(1) : '';

  const DIGNITY_COLORS: Record<string, string> = {
    Domicile: 'text-amber-300',
    Exaltation: 'text-sky-300',
    Detriment: 'text-rose-300',
    Fall: 'text-amber-500',
  };

  const dignityColor = DIGNITY_COLORS[dignity.dignityType] || 'text-theme-text-secondary';

  return (
    <div className="space-y-4">
      {/* Dignity type badge */}
      <div className="flex flex-wrap items-center gap-2">
        {dignity.dignityType && (
          <span className={`text-xs px-3 py-0.5 rounded-full bg-surface-raised font-semibold ${dignityColor}`}>
            {dignity.dignityType}
          </span>
        )}
      </div>

      {/* Planet + Sign heading */}
      <div>
        <p className="text-sm text-theme-text-secondary font-medium">
          {capitalizeId(dignity.planetId)} in {capitalizeId(dignity.signId)}
        </p>
      </div>

      {/* Description */}
      {dignity.description && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">Interpretation</h4>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{dignity.description}</p>
        </div>
      )}

      {/* Explanatory note */}
      <p className="text-xs text-theme-text-tertiary italic leading-relaxed">
        Planetary dignity describes the quality of a planet's expression based on its sign position.
      </p>
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

      {/* Galactic Point */}
      {entity.type === 'galactic-point' && (
        <GalacticPointContent entity={entity} />
      )}

      {/* Decan */}
      {entity.type === 'decan' && (
        <DecanContent entity={entity} />
      )}

      {/* Hermetic Principle */}
      {entity.type === 'hermetic-principle' && (
        <HermeticContent entity={entity} />
      )}

      {/* GK Sphere */}
      {entity.type === 'gk-sphere' && (
        <GKSphereContent entity={entity} />
      )}

      {/* Fixed Star */}
      {entity.type === 'fixed-star' && (
        <FixedStarContent entity={entity} />
      )}

      {/* Aspect Configuration */}
      {entity.type === 'configuration' && (
        <ConfigurationContent entity={entity} />
      )}

      {/* HD Strategy */}
      {entity.type === 'hd-strategy' && (
        <HDStrategyContent entity={entity} />
      )}

      {/* GK Sequence */}
      {entity.type === 'gk-sequence' && (
        <GKSequenceContent entity={entity} />
      )}

      {/* HD Variable */}
      {entity.type === 'hd-variable' && (
        <HDVariableContent entity={entity} />
      )}

      {/* Amino Acid */}
      {entity.type === 'amino-acid' && (
        <AminoAcidContent entity={entity} />
      )}

      {/* Trigram */}
      {entity.type === 'trigram' && (
        <TrigramContent entity={entity} />
      )}

      {/* Unified Line (GK + HD) */}
      {entity.type === 'line' && (
        <LineContent entity={entity} />
      )}

      {/* Dignity */}
      {entity.type === 'dignity' && (
        <DignityContent entity={entity} />
      )}

      {/* Lost Octave Gate */}
      {entity.type === 'lo-gate' && (
        <LostOctaveGateContent entity={entity} />
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
