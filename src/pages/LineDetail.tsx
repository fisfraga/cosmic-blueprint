import { useParams, Link } from 'react-router-dom';
import { lines, getHDProfilesForLine, getHarmonyPartnerLine } from '../data';
import { NotFoundState } from '../components';

export function LineDetail() {
  const { id } = useParams<{ id: string }>();
  const line = id ? lines.get(id) : undefined;

  if (!line) {
    return (
      <NotFoundState
        title="Line Not Found"
        description="The Line you're looking for doesn't exist."
        backLink="/lines"
        backLabel="Back to Lines"
      />
    );
  }

  const profilesWithLine = getHDProfilesForLine(line.lineNumber);
  const harmonyPartner = getHarmonyPartnerLine(line.id);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <header className="text-center py-8">
        <div className="text-7xl mb-4 font-serif text-indigo-400">{line.lineNumber}</div>
        <h1 className="font-serif text-4xl font-medium mb-2">{line.name}</h1>
        <p className="text-xl text-indigo-400 mb-2">{line.archetype}</p>
        <p className="text-neutral-400 max-w-2xl mx-auto">{line.summary}</p>
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-lg">
            {line.trigram} Trigram
          </span>
          <span className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-lg">
            {line.trigramPosition} Position
          </span>
        </div>
      </header>

      {/* Keywords */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl mb-4">Keywords</h2>
        <div className="flex flex-wrap gap-2">
          {line.keywords.map((keyword, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-lg text-sm"
            >
              {keyword}
            </span>
          ))}
        </div>
      </section>

      {/* Philosophy Tabs - Gene Keys & Human Design */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Gene Keys Perspective */}
        <section className="space-y-4">
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">64</span>
              <h2 className="font-serif text-xl text-purple-300">Gene Keys Perspective</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-purple-400 mb-1">Theme</h3>
                <p className="text-neutral-300">{line.geneKeys.theme}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-purple-400 mb-1">Description</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{line.geneKeys.description}</p>
              </div>

              {/* Gift & Shadow */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <h4 className="text-xs font-medium text-emerald-400 mb-1">Gift Expression</h4>
                  <p className="text-neutral-300 text-sm">{line.geneKeys.gift}</p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <h4 className="text-xs font-medium text-red-400 mb-1">Shadow Expression</h4>
                  <p className="text-neutral-300 text-sm">{line.geneKeys.shadow}</p>
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-medium text-purple-400 mb-1">Contemplation Theme</h3>
                <p className="text-neutral-300 italic">"{line.geneKeys.contemplationTheme}"</p>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-medium text-purple-400 mb-1">Practical Guidance</h3>
                <p className="text-neutral-400 text-sm">{line.geneKeys.practicalGuidance}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Human Design Perspective */}
        <section className="space-y-4">
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-xl p-6 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">HD</span>
              <h2 className="font-serif text-xl text-amber-300">Human Design Perspective</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-amber-400 mb-1">Theme</h3>
                <p className="text-neutral-300">{line.humanDesign.theme}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-amber-400 mb-1">Description</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{line.humanDesign.description}</p>
              </div>

              {/* Gifts & Challenges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <h4 className="text-xs font-medium text-emerald-400 mb-2">Gifts</h4>
                  <ul className="space-y-1">
                    {line.humanDesign.gifts.slice(0, 3).map((gift, i) => (
                      <li key={i} className="text-neutral-300 text-xs flex items-start gap-1">
                        <span className="text-emerald-400">+</span>
                        {gift}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <h4 className="text-xs font-medium text-amber-400 mb-2">Challenges</h4>
                  <ul className="space-y-1">
                    {line.humanDesign.challenges.slice(0, 3).map((challenge, i) => (
                      <li key={i} className="text-neutral-300 text-xs flex items-start gap-1">
                        <span className="text-amber-400">!</span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* In Personality vs Design (HD perspective) */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl mb-3 text-neutral-200">In Personality (Conscious)</h2>
          <p className="text-neutral-400">{line.humanDesign.inPersonality}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-6 border border-red-500/20">
          <h2 className="font-serif text-xl mb-3 text-red-300">In Design (Unconscious)</h2>
          <p className="text-neutral-300">{line.humanDesign.inDesign}</p>
        </div>
      </section>

      {/* Healthy vs Unhealthy Expression */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-6 border border-green-500/20">
          <h2 className="font-serif text-xl mb-3 text-green-300">Healthy Expression</h2>
          <p className="text-neutral-300">{line.humanDesign.healthyExpression}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-6 border border-red-500/20">
          <h2 className="font-serif text-xl mb-3 text-red-300">Unhealthy Expression</h2>
          <p className="text-neutral-300">{line.humanDesign.unhealthyExpression}</p>
        </div>
      </section>

      {/* Life Phases (for Line 6) */}
      {line.lifePhases && (
        <section className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 rounded-xl p-6 border border-indigo-500/20">
          <h2 className="font-serif text-xl mb-4 text-indigo-300">Three-Part Life Process</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-900/50 rounded-lg">
              <h3 className="font-medium text-white mb-1">{line.lifePhases.phase1.name}</h3>
              <p className="text-indigo-400 text-sm mb-2">{line.lifePhases.phase1.ageRange}</p>
              <p className="text-neutral-400 text-sm">{line.lifePhases.phase1.description}</p>
            </div>
            <div className="p-4 bg-neutral-900/50 rounded-lg">
              <h3 className="font-medium text-white mb-1">{line.lifePhases.phase2.name}</h3>
              <p className="text-indigo-400 text-sm mb-2">{line.lifePhases.phase2.ageRange}</p>
              <p className="text-neutral-400 text-sm">{line.lifePhases.phase2.description}</p>
            </div>
            <div className="p-4 bg-neutral-900/50 rounded-lg">
              <h3 className="font-medium text-white mb-1">{line.lifePhases.phase3.name}</h3>
              <p className="text-indigo-400 text-sm mb-2">{line.lifePhases.phase3.ageRange}</p>
              <p className="text-neutral-400 text-sm">{line.lifePhases.phase3.description}</p>
            </div>
          </div>
        </section>
      )}

      {/* Harmony Partner Line */}
      {harmonyPartner && (
        <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl mb-4">Harmony Partner</h2>
          <Link
            to={`/lines/${harmonyPartner.id}`}
            className="block p-4 bg-indigo-500/10 rounded-lg hover:bg-indigo-500/20 transition-colors border border-indigo-500/20"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl font-serif text-indigo-400">{harmonyPartner.lineNumber}</span>
              <div>
                <p className="text-white font-medium">{harmonyPartner.name}</p>
                <p className="text-indigo-400 text-sm">{harmonyPartner.archetype}</p>
              </div>
            </div>
            {line.harmonyDescription && (
              <p className="text-neutral-400 text-sm mt-3">{line.harmonyDescription}</p>
            )}
          </Link>
        </section>
      )}

      {/* Profiles with this Line */}
      {profilesWithLine.length > 0 && (
        <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl mb-4">Profiles with Line {line.lineNumber}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {profilesWithLine.map((profile) => (
              <Link
                key={profile.id}
                to={`/human-design/profiles/${profile.id}`}
                className="p-3 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors text-center"
              >
                <span className="text-amber-400 font-medium text-lg">{profile.symbol}</span>
                <p className="text-neutral-400 text-sm mt-1">
                  {profile.name.split(' - ')[1] || profile.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
        <Link to="/lines" className="text-neutral-400 hover:text-white transition-colors">
          &#8592; All Lines
        </Link>
        <div className="flex gap-4">
          {line.lineNumber > 1 && (
            <Link
              to={`/lines/line-${line.lineNumber - 1}`}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              &#8592; Line {line.lineNumber - 1}
            </Link>
          )}
          {line.lineNumber < 6 && (
            <Link
              to={`/lines/line-${line.lineNumber + 1}`}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Line {line.lineNumber + 1} &#8594;
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default LineDetail;
