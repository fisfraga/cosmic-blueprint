import { useParams, Link } from 'react-router-dom';
import { hdLines, getProfilesByLine, gkLines } from '../data';
import { NotFoundState } from '../components';

export function HumanDesignLineDetail() {
  const { id } = useParams<{ id: string }>();
  const line = id ? hdLines.get(id) : undefined;

  if (!line) {
    return (
      <NotFoundState
        title="Line Not Found"
        description="The Human Design Line you're looking for doesn't exist."
        backLink="/human-design/lines"
        backLabel="Back to Lines"
      />
    );
  }

  const profilesWithLine = getProfilesByLine(line.lineNumber);
  const gkLine = gkLines.get(`gk-line-${line.lineNumber}`);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center py-8">
        <div className="text-6xl mb-4 font-serif text-humandesign-400">{line.lineNumber}</div>
        <h1 className="font-serif text-4xl font-medium mb-2">{line.name}</h1>
        <p className="text-xl text-humandesign-400 mb-2">{line.archetype}</p>
        <p className="text-neutral-400">{line.theme}</p>
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <span className="px-3 py-1 bg-humandesign-500/10 text-humandesign-300 rounded-lg">
            {line.trigram} Trigram
          </span>
          <span className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-lg">
            {line.trigramPosition} Position
          </span>
        </div>
      </header>

      {/* Description */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <p className="text-neutral-300 leading-relaxed">{line.description}</p>
      </section>

      {/* Keywords */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl mb-4">Keywords</h2>
        <div className="flex flex-wrap gap-2">
          {line.keywords.map((keyword, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-humandesign-500/10 text-humandesign-300 rounded-lg text-sm"
            >
              {keyword}
            </span>
          ))}
        </div>
      </section>

      {/* In Personality vs Design */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl mb-3 text-neutral-200">In Personality (Conscious)</h2>
          <p className="text-neutral-400">{line.inPersonality}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-6 border border-red-500/20">
          <h2 className="font-serif text-xl mb-3 text-red-300">In Design (Unconscious)</h2>
          <p className="text-neutral-300">{line.inDesign}</p>
        </div>
      </section>

      {/* Gifts & Challenges */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl mb-4 text-green-400">Gifts</h2>
          <ul className="space-y-2">
            {line.gifts.map((gift, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-400 mt-1">+</span>
                <span className="text-neutral-300">{gift}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl mb-4 text-amber-400">Challenges</h2>
          <ul className="space-y-2">
            {line.challenges.map((challenge, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">!</span>
                <span className="text-neutral-300">{challenge}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Healthy vs Unhealthy Expression */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-6 border border-green-500/20">
          <h2 className="font-serif text-xl mb-3 text-green-300">Healthy Expression</h2>
          <p className="text-neutral-300">{line.healthyExpression}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-6 border border-red-500/20">
          <h2 className="font-serif text-xl mb-3 text-red-300">Unhealthy Expression</h2>
          <p className="text-neutral-300">{line.unhealthyExpression}</p>
        </div>
      </section>

      {/* Life Phases (for Line 6) */}
      {line.lifePhases && (
        <section className="bg-gradient-to-br from-humandesign-500/10 to-humandesign-600/5 rounded-xl p-6 border border-humandesign-500/20">
          <h2 className="font-serif text-xl mb-4 text-humandesign-300">Three-Part Life Process</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-900/50 rounded-lg">
              <h3 className="font-medium text-white mb-1">{line.lifePhases.phase1.name}</h3>
              <p className="text-humandesign-400 text-sm mb-2">{line.lifePhases.phase1.ageRange}</p>
              <p className="text-neutral-400 text-sm">{line.lifePhases.phase1.description}</p>
            </div>
            <div className="p-4 bg-neutral-900/50 rounded-lg">
              <h3 className="font-medium text-white mb-1">{line.lifePhases.phase2.name}</h3>
              <p className="text-humandesign-400 text-sm mb-2">{line.lifePhases.phase2.ageRange}</p>
              <p className="text-neutral-400 text-sm">{line.lifePhases.phase2.description}</p>
            </div>
            <div className="p-4 bg-neutral-900/50 rounded-lg">
              <h3 className="font-medium text-white mb-1">{line.lifePhases.phase3.name}</h3>
              <p className="text-humandesign-400 text-sm mb-2">{line.lifePhases.phase3.ageRange}</p>
              <p className="text-neutral-400 text-sm">{line.lifePhases.phase3.description}</p>
            </div>
          </div>
        </section>
      )}

      {/* Practical Guidance */}
      <section className="bg-gradient-to-br from-humandesign-500/10 to-humandesign-600/5 rounded-xl p-6 border border-humandesign-500/20">
        <h2 className="font-serif text-xl mb-4 text-humandesign-300">Practical Guidance</h2>
        <p className="text-neutral-300 leading-relaxed">{line.practicalGuidance}</p>
      </section>

      {/* Gene Keys Perspective */}
      {gkLine && (
        <section className="bg-gradient-to-br from-genekey-500/10 to-genekey-600/5 rounded-xl p-6 border border-genekey-500/20">
          <h2 className="font-serif text-xl mb-2 text-genekey-300">Gene Keys Perspective</h2>
          <p className="text-neutral-500 text-sm mb-4">
            In the Gene Keys system, the same six I Ching line positions hold a corresponding wisdom.
          </p>
          <div className="flex items-start gap-4 p-4 bg-neutral-900/50 rounded-lg border border-neutral-700">
            <div className="w-10 h-10 rounded-full bg-genekey-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-genekey-400 font-serif font-bold">{line.lineNumber}</span>
            </div>
            <div>
              <p className="text-white font-medium">{gkLine.archetype}</p>
              {gkLine.theme && (
                <p className="text-neutral-400 text-sm mt-1 italic">{gkLine.theme}</p>
              )}
              <div className="flex gap-3 mt-2 text-xs">
                {gkLine.shadow && (
                  <span className="text-red-400/80">Shadow: {gkLine.shadow}</span>
                )}
                {gkLine.gift && (
                  <span className="text-emerald-400/80">Gift: {gkLine.gift}</span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Profiles with this Line */}
      {profilesWithLine.length > 0 && (
        <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl mb-4">Profiles with Line {line.lineNumber}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {profilesWithLine.map((profile) => (
              <Link
                key={profile.id}
                to={`/human-design/profiles/${profile.id}`}
                className="p-3 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <span className="text-humandesign-400 font-medium">{profile.symbol}</span>
                <span className="text-neutral-400 ml-2 text-sm">
                  {profile.name.split(' ').slice(1).join(' ')}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back Link */}
      <div className="text-center pt-4">
        <Link to="/human-design/lines" className="text-neutral-400 hover:text-white transition-colors">
          &#8592; Back to Lines
        </Link>
      </div>
    </div>
  );
}
export default HumanDesignLineDetail;
