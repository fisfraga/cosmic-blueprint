import { useParams, Link } from 'react-router-dom';
import { fixedStars } from '../data';

export function FixedStarDetail() {
  const { id } = useParams<{ id: string }>();
  const star = id ? fixedStars.get(id) : undefined;

  if (!star) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Star Not Found</h1>
        <Link to="/fixed-stars" className="text-amber-400 hover:underline">
          ← Back to Fixed Stars
        </Link>
      </div>
    );
  }

  const signName = star.zodiacPosition.sign.charAt(0).toUpperCase() + star.zodiacPosition.sign.slice(1);
  const magnitudeLabel =
    star.magnitude < 0
      ? 'Exceptional brightness'
      : star.magnitude < 1
      ? '1st Magnitude'
      : star.magnitude < 2
      ? '2nd Magnitude'
      : '3rd Magnitude';

  const planetColors: Record<string, string> = {
    Mars: 'bg-red-500/10 text-red-400 border-red-500/20',
    Jupiter: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Venus: 'bg-green-500/10 text-green-400 border-green-500/20',
    Mercury: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    Saturn: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Moon: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    Sun: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <Link to="/fixed-stars" className="text-theme-text-secondary hover:text-theme-text-primary text-sm mb-4 inline-block">
          ← Fixed Stars
        </Link>
      </div>

      {/* Header */}
      <header className="text-center py-8 border-b border-theme-border-subtle">
        <div className="text-5xl mb-3 text-amber-400">★</div>
        <h1 className="font-serif text-4xl font-medium mb-2 text-theme-text-primary">{star.name}</h1>
        {star.alternateNames.length > 0 && (
          <p className="text-theme-text-tertiary text-sm mb-3">
            {star.alternateNames.join(' · ')}
          </p>
        )}
        <p className="text-xl text-amber-300 italic mb-6">{star.archetype}</p>

        {/* Badges row */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {star.isRoyalStar && (
            <span className="px-3 py-1 rounded-full text-sm bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ♛ {star.royalStarTitle ?? 'Royal Star'}
            </span>
          )}
          {star.isBehenian && (
            <span className="px-3 py-1 rounded-full text-sm bg-violet-500/15 text-violet-300 border border-violet-500/25">
              ◎ Behenian Star
            </span>
          )}
          {star.nature.map((n) => (
            <span
              key={n}
              className={`px-3 py-1 rounded-full text-sm border ${planetColors[n] ?? 'bg-surface-raised text-theme-text-secondary border-theme-border'}`}
            >
              {n}
            </span>
          ))}
        </div>
      </header>

      {/* Metadata */}
      <section className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-raised/40 rounded-xl p-4 text-center">
          <div className="text-theme-text-tertiary text-xs uppercase tracking-wider mb-1">Constellation</div>
          <div className="font-serif text-lg text-theme-text-primary">{star.constellation}</div>
        </div>
        <div className="bg-surface-raised/40 rounded-xl p-4 text-center">
          <div className="text-theme-text-tertiary text-xs uppercase tracking-wider mb-1">Zodiac Position</div>
          <div className="font-serif text-lg text-theme-text-primary">
            {signName} {star.zodiacPosition.degree}°{String(star.zodiacPosition.minute).padStart(2, '0')}'
          </div>
          {star.zodiacPosition.note && (
            <div className="text-xs text-theme-text-muted mt-1">{star.zodiacPosition.note}</div>
          )}
        </div>
        <div className="bg-surface-raised/40 rounded-xl p-4 text-center">
          <div className="text-theme-text-tertiary text-xs uppercase tracking-wider mb-1">Magnitude</div>
          <div className="font-serif text-lg text-theme-text-primary">{star.magnitude}</div>
          <div className="text-xs text-theme-text-muted mt-1">{magnitudeLabel}</div>
        </div>
        <div className="bg-surface-raised/40 rounded-xl p-4 text-center">
          <div className="text-theme-text-tertiary text-xs uppercase tracking-wider mb-1">Body</div>
          <div className="font-serif text-lg text-theme-text-primary">{star.bodyAssociation}</div>
        </div>
      </section>

      {/* Keywords */}
      <section>
        <h2 className="font-serif text-xl mb-3 text-theme-text-secondary">Keywords</h2>
        <div className="flex flex-wrap gap-2">
          {star.keywords.map((kw) => (
            <span key={kw} className="px-3 py-1.5 rounded-lg bg-surface-raised text-theme-text-secondary text-sm">
              {kw}
            </span>
          ))}
        </div>
      </section>

      {/* Gift Expression */}
      <section className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl p-6 border border-emerald-500/20">
        <h2 className="font-serif text-xl mb-3 text-emerald-300 flex items-center gap-2">
          <span>✦</span>
          Gift Expression
        </h2>
        <p className="text-theme-text-secondary leading-relaxed">{star.giftExpression}</p>
      </section>

      {/* Shadow Expression */}
      <section className="bg-gradient-to-br from-rose-500/10 to-rose-600/5 rounded-xl p-6 border border-rose-500/20">
        <h2 className="font-serif text-xl mb-3 text-rose-300 flex items-center gap-2">
          <span>☽</span>
          Shadow Expression
        </h2>
        <p className="text-theme-text-secondary leading-relaxed">{star.shadowExpression}</p>
      </section>

      {/* Traditional Meaning */}
      <section className="bg-surface-raised/30 rounded-xl p-6 border border-theme-border-subtle">
        <h2 className="font-serif text-xl mb-3 text-theme-text-secondary flex items-center gap-2">
          <span>📜</span>
          Traditional Meaning
        </h2>
        <p className="text-theme-text-secondary leading-relaxed">{star.traditionalMeaning}</p>
      </section>

      {/* Contemplation Questions */}
      <section>
        <h2 className="font-serif text-xl mb-4 text-theme-text-secondary">Contemplation Questions</h2>
        <div className="space-y-3">
          {star.contemplationQuestions.map((q, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 bg-surface-raised/30 rounded-xl border border-theme-border-subtle"
            >
              <span className="text-amber-400 text-lg mt-0.5">◇</span>
              <p className="text-theme-text-secondary italic">{q}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Calculation Details */}
      <section className="bg-surface-raised/20 rounded-xl p-5 border border-theme-border-subtle">
        <h2 className="font-serif text-lg mb-3 text-theme-text-tertiary">Calculation Reference</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-theme-text-tertiary text-xs uppercase tracking-wider mb-1">Ecliptic Longitude</div>
            <div className="text-theme-text-secondary font-mono">{star.eclipticLongitude.toFixed(2)}°</div>
          </div>
          <div>
            <div className="text-theme-text-tertiary text-xs uppercase tracking-wider mb-1">Conjunction Orb</div>
            <div className="text-theme-text-secondary font-mono">±{star.orb}°</div>
          </div>
          <div>
            <div className="text-theme-text-tertiary text-xs uppercase tracking-wider mb-1">External Reference</div>
            <a
              href={star.astrologyKingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline"
            >
              Astrology King ↗
            </a>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-theme-border-subtle">
        <Link to="/fixed-stars" className="text-theme-text-secondary hover:text-theme-text-primary text-sm transition-colors">
          ← All Fixed Stars
        </Link>
        <Link
          to="/profile/fixed-stars"
          className="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30 transition-colors text-sm border border-amber-500/30"
        >
          See in My Chart →
        </Link>
      </div>
    </div>
  );
}

export default FixedStarDetail;
