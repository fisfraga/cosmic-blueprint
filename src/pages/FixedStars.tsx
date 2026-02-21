import { Link } from 'react-router-dom';
import { getRoyalStars, getBehenianStars, getFixedStarsInOrder } from '../data';
import type { FixedStar } from '../types';

function MagnitudeBadge({ magnitude }: { magnitude: number }) {
  const label =
    magnitude < 0
      ? 'Exceptional'
      : magnitude < 1
      ? '1st Magnitude'
      : magnitude < 2
      ? '2nd Magnitude'
      : '3rd Magnitude';
  const colors =
    magnitude < 0
      ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
      : magnitude < 1
      ? 'bg-yellow-400/15 text-yellow-300 border-yellow-400/25'
      : magnitude < 2
      ? 'bg-theme-text-tertiary/15 text-theme-text-tertiary border-theme-border'
      : 'bg-surface-raised/50 text-theme-text-muted border-theme-border/50';
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${colors}`}>
      {label}
    </span>
  );
}

function NatureBadges({ nature }: { nature: string[] }) {
  const planetColors: Record<string, string> = {
    Mars: 'text-red-400 bg-red-500/10',
    Jupiter: 'text-blue-400 bg-blue-500/10',
    Venus: 'text-green-400 bg-green-500/10',
    Mercury: 'text-cyan-400 bg-cyan-500/10',
    Saturn: 'text-purple-400 bg-purple-500/10',
    Moon: 'text-sky-400 bg-sky-500/10',
    Sun: 'text-amber-400 bg-amber-500/10',
  };
  return (
    <div className="flex flex-wrap gap-1">
      {nature.map((n) => (
        <span
          key={n}
          className={`text-xs px-1.5 py-0.5 rounded ${planetColors[n] ?? 'text-theme-text-tertiary bg-surface-raised'}`}
        >
          {n}
        </span>
      ))}
    </div>
  );
}

function StarCard({ star }: { star: FixedStar }) {
  const signName = star.zodiacPosition.sign.charAt(0).toUpperCase() + star.zodiacPosition.sign.slice(1);
  return (
    <Link
      to={`/fixed-stars/${star.id}`}
      className="block p-5 rounded-xl border border-theme-border-subtle hover:border-theme-border bg-surface-base/50 hover:bg-surface-raised/30 transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-amber-400 text-lg">★</span>
            <h3 className="font-serif text-lg font-medium text-theme-text-primary group-hover:text-amber-300 transition-colors">
              {star.name}
            </h3>
            {star.isRoyalStar && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Royal Star
              </span>
            )}
          </div>
          <p className="text-sm text-theme-text-secondary italic">{star.archetype}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-theme-text-tertiary">{star.constellation}</div>
          <div className="text-xs text-theme-text-muted mt-0.5">
            {signName} {star.zodiacPosition.degree}°{String(star.zodiacPosition.minute).padStart(2, '0')}'
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-3">
        <MagnitudeBadge magnitude={star.magnitude} />
        <NatureBadges nature={star.nature} />
        {star.isBehenian && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">
            Behenian
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {star.keywords.slice(0, 4).map((kw) => (
          <span key={kw} className="text-xs px-2 py-0.5 rounded bg-surface-raised text-theme-text-tertiary">
            {kw}
          </span>
        ))}
      </div>
    </Link>
  );
}

export function FixedStars() {
  const royalStars = getRoyalStars();
  const behenianStars = getBehenianStars().filter((s) => !s.isRoyalStar);
  const allStars = getFixedStarsInOrder();
  const otherStars = allStars.filter((s) => !s.isBehenian && !s.isRoyalStar);

  return (
    <div className="space-y-10">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">★</span>
          <h1 className="font-serif text-3xl font-medium">Fixed Stars</h1>
        </div>
        <p className="text-theme-text-secondary max-w-3xl">
          Fixed stars are the ancient gatekeepers of fate — celestial points whose conjunction
          with natal planets confers specific archetypal themes, gifts, and challenges. When a
          planet conjuncts a fixed star within orb at birth, that star's wisdom becomes woven
          into your cosmic blueprint.
        </p>
        <div className="flex flex-wrap gap-3 mt-4 text-sm text-theme-text-tertiary">
          <span className="px-3 py-1.5 bg-surface-raised rounded-full">
            {allStars.length + otherStars.length} Stars total
          </span>
          <span className="px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
            4 Royal Stars
          </span>
          <span className="px-3 py-1.5 bg-violet-500/10 text-violet-400 rounded-full border border-violet-500/20">
            {getBehenianStars().length} Behenian Stars
          </span>
        </div>
      </section>

      {/* Royal Stars */}
      <section>
        <h2 className="font-serif text-2xl mb-1 text-theme-text-primary flex items-center gap-2">
          <span className="text-amber-400">♛</span>
          Royal Stars
        </h2>
        <p className="text-theme-text-secondary text-sm mb-5 max-w-2xl">
          The four watchers of the heavens — Aldebaran, Regulus, Antares, and Fomalhaut —
          guard the cardinal directions of the ancient sky. Their gifts are immense; their
          conditions are clear.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {royalStars.map((star) => (
            <StarCard key={star.id} star={star} />
          ))}
        </div>
      </section>

      {/* Behenian Stars */}
      <section>
        <h2 className="font-serif text-2xl mb-1 text-theme-text-primary flex items-center gap-2">
          <span className="text-violet-400">◎</span>
          Behenian Stars
        </h2>
        <p className="text-theme-text-secondary text-sm mb-5 max-w-2xl">
          The 15 Behenian stars of medieval magic, each linked to a planet and used in
          talismanic practice. These stars carry potent archetypal signatures and respond
          strongly to conjunction with natal planets.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {behenianStars.map((star) => (
            <StarCard key={star.id} star={star} />
          ))}
        </div>
      </section>

      {/* Other Notable Stars */}
      {otherStars.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl mb-1 text-theme-text-primary flex items-center gap-2">
            <span className="text-theme-text-tertiary">✦</span>
            Notable Stars
          </h2>
          <p className="text-theme-text-secondary text-sm mb-5 max-w-2xl">
            Other significant fixed stars with strong astrological traditions.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherStars.map((star) => (
              <StarCard key={star.id} star={star} />
            ))}
          </div>
        </section>
      )}

      {/* Calculation note */}
      <section className="bg-surface-raised/30 rounded-xl p-5 border border-theme-border-subtle">
        <h3 className="font-serif text-lg mb-2 text-theme-text-secondary">About Fixed Star Conjunctions</h3>
        <p className="text-sm text-theme-text-tertiary max-w-2xl">
          Fixed stars activate through ecliptic conjunction — when a natal planet or angle
          falls within orb of a star's zodiac degree. Orbs vary by star brightness: Royal
          and bright stars (2°), Behenian stars (1–1.5°), dimmer stars (0.5–1°). Visit your{' '}
          <Link to="/profile/fixed-stars" className="text-amber-400 hover:underline">
            Fixed Stars Profile
          </Link>{' '}
          to see which stars are active in your chart.
        </p>
      </section>
    </div>
  );
}

export default FixedStars;
