import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfile } from '../../context';
import { planets, points } from '../../data';
import { LoadingSkeleton, ProfileRequiredState } from '../../components';
import { getFixedStarConjunctions, groupConjunctionsByExactness } from '../../services/fixedStars';
import type { FixedStarConjunction } from '../../services/fixedStars';

// ─── Sub-components ────────────────────────────────────────────────────────────

function OrbBadge({ orb, isExact }: { orb: number; isExact: boolean }) {
  const color = isExact
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    : orb <= 1.0
    ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/25'
    : 'bg-surface-raised text-theme-text-tertiary border-theme-border';
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${color}`}>
      {orb.toFixed(2)}° orb
    </span>
  );
}

function ConjunctionCard({ conj }: { conj: FixedStarConjunction }) {
  const planet = planets.get(conj.planetId) ?? points.get(conj.planetId);
  const signName =
    conj.star.zodiacPosition.sign.charAt(0).toUpperCase() +
    conj.star.zodiacPosition.sign.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-raised/30 rounded-xl border border-theme-border-subtle p-5 space-y-4"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-amber-400 text-2xl mt-0.5">★</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to={`/fixed-stars/${conj.star.id}`}
                className="font-serif text-lg font-medium text-theme-text-primary hover:text-amber-300 transition-colors"
              >
                {conj.star.name}
              </Link>
              {conj.star.isRoyalStar && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Royal Star
                </span>
              )}
              {conj.star.isBehenian && !conj.star.isRoyalStar && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">
                  Behenian
                </span>
              )}
            </div>
            <p className="text-sm text-amber-300/80 italic">{conj.star.archetype}</p>
            <p className="text-xs text-theme-text-muted mt-0.5">
              {conj.star.constellation} · {signName} {conj.star.zodiacPosition.degree}°
              {String(conj.star.zodiacPosition.minute).padStart(2, '0')}'
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <OrbBadge orb={conj.orbDegree} isExact={conj.isExact} />
          {planet && (
            <div className="flex items-center gap-1.5 text-sm text-theme-text-secondary">
              <span className="text-lg">{planet.symbol}</span>
              <span>{planet.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Gift / Shadow */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-emerald-500/8 rounded-lg p-3 border border-emerald-500/15">
          <p className="text-xs uppercase tracking-wider text-emerald-400 mb-1.5 font-medium">Gift</p>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{conj.star.giftExpression}</p>
        </div>
        <div className="bg-rose-500/8 rounded-lg p-3 border border-rose-500/15">
          <p className="text-xs uppercase tracking-wider text-rose-400 mb-1.5 font-medium">Shadow</p>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{conj.star.shadowExpression}</p>
        </div>
      </div>

      {/* First contemplation question */}
      {conj.star.contemplationQuestions.length > 0 && (
        <div className="flex items-start gap-2 p-3 bg-surface-base/40 rounded-lg border border-theme-border-subtle/60">
          <span className="text-amber-400 text-sm mt-0.5 shrink-0">◇</span>
          <p className="text-sm text-theme-text-tertiary italic">{conj.star.contemplationQuestions[0]}</p>
        </div>
      )}

      <div className="flex items-center justify-end">
        <Link
          to={`/fixed-stars/${conj.star.id}`}
          className="text-xs text-theme-text-muted hover:text-amber-400 transition-colors"
        >
          Full star profile →
        </Link>
      </div>
    </motion.div>
  );
}

function TierSection({
  title,
  description,
  icon,
  conjunctions,
  accentClass,
}: {
  title: string;
  description: string;
  icon: string;
  conjunctions: FixedStarConjunction[];
  accentClass: string;
}) {
  if (conjunctions.length === 0) return null;
  return (
    <section>
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xl ${accentClass}`}>{icon}</span>
        <h2 className="font-serif text-xl text-theme-text-primary">{title}</h2>
        <span className="text-sm text-theme-text-tertiary">({conjunctions.length})</span>
      </div>
      <p className="text-sm text-theme-text-tertiary mb-4">{description}</p>
      <div className="space-y-4">
        {conjunctions.map((c) => (
          <ConjunctionCard key={`${c.star.id}-${c.planetId}`} conj={c} />
        ))}
      </div>
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function ProfileFixedStars() {
  const { profile, isLoading, hasProfile } = useProfile();

  if (isLoading) {
    return <LoadingSkeleton variant="profile" />;
  }

  if (!hasProfile || !profile) {
    return (
      <ProfileRequiredState
        title="Fixed Stars"
        description="Create your profile to discover which ancient fixed stars are woven into your natal chart."
      />
    );
  }

  const conjunctions = getFixedStarConjunctions(profile.placements);
  const { exact, close, wide } = groupConjunctionsByExactness(conjunctions);
  const totalCount = conjunctions.length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/profile"
            className="text-theme-text-secondary hover:text-theme-text-primary text-sm mb-2 inline-block"
          >
            ← Back to Overview
          </Link>
          <h1 className="font-serif text-3xl text-theme-text-primary flex items-center gap-3">
            <span className="text-amber-400">★</span>
            Fixed Stars in My Chart
          </h1>
          <p className="text-theme-text-secondary mt-1">{profile.name}'s natal star activations</p>
        </div>
        <Link
          to="/fixed-stars"
          className="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30 transition-colors text-sm border border-amber-500/30"
        >
          All Fixed Stars →
        </Link>
      </div>

      {/* Summary chips */}
      {totalCount > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 bg-surface-raised rounded-full text-sm text-theme-text-tertiary">
            {totalCount} conjunctions found
          </span>
          {exact.length > 0 && (
            <span className="px-3 py-1.5 rounded-full text-sm bg-amber-500/15 text-amber-300 border border-amber-500/25">
              {exact.length} exact (≤0.5°)
            </span>
          )}
          {close.length > 0 && (
            <span className="px-3 py-1.5 rounded-full text-sm bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">
              {close.length} close (≤1°)
            </span>
          )}
          {wide.length > 0 && (
            <span className="px-3 py-1.5 rounded-full text-sm bg-surface-raised text-theme-text-tertiary border border-theme-border">
              {wide.length} wide
            </span>
          )}
        </div>
      )}

      {/* Empty state */}
      {totalCount === 0 && (
        <div className="text-center py-16 border border-dashed border-theme-border rounded-xl">
          <div className="text-4xl mb-3 text-theme-text-muted">★</div>
          <h2 className="font-serif text-xl text-theme-text-secondary mb-2">
            No Fixed Star Conjunctions
          </h2>
          <p className="text-theme-text-tertiary text-sm max-w-md mx-auto mb-4">
            No natal planets fall within orb of a tracked fixed star. The stars are present —
            they simply speak through the broader sky of your chart.
          </p>
          <Link to="/fixed-stars" className="text-amber-400 hover:underline text-sm">
            Explore Fixed Stars →
          </Link>
        </div>
      )}

      {/* Exact conjunctions */}
      <TierSection
        title="Exact Conjunctions"
        description="Orb ≤ 0.5° — the star's archetype is deeply woven into the planet's expression."
        icon="✦"
        conjunctions={exact}
        accentClass="text-amber-400"
      />

      {/* Close conjunctions */}
      <TierSection
        title="Close Conjunctions"
        description="Orb ≤ 1° — a strong activation; the star's themes colour this planetary energy."
        icon="◈"
        conjunctions={close}
        accentClass="text-yellow-400"
      />

      {/* Wide conjunctions */}
      <TierSection
        title="Wide Conjunctions"
        description="Orb within the star's maximum — the star's influence is present though subtler."
        icon="◇"
        conjunctions={wide}
        accentClass="text-theme-text-tertiary"
      />

      {/* Footer note */}
      <section className="bg-surface-raised/20 rounded-xl p-5 border border-theme-border-subtle">
        <h3 className="font-serif text-base text-theme-text-tertiary mb-2">About These Calculations</h3>
        <p className="text-sm text-theme-text-muted">
          Conjunctions are detected by ecliptic longitude — when a natal planet falls within the
          star's orb at your birth longitude. Orbs are set by star brightness: Royal Stars (2°),
          bright stars (2°), Behenian stars (1–1.5°), dimmer stars (0.5–1°).
        </p>
      </section>
    </div>
  );
}

export default ProfileFixedStars;
