import { useParams, Link } from 'react-router-dom';
import { hdProfiles, getProfileLines } from '../data';
import { NotFoundState } from '../components';

export function HumanDesignProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const profile = id ? hdProfiles.get(id) : undefined;

  if (!profile) {
    return (
      <NotFoundState
        title="Profile Not Found"
        description="The Human Design Profile you're looking for doesn't exist."
        backLink="/human-design/profiles"
        backLabel="Back to Profiles"
      />
    );
  }

  const lines = getProfileLines(profile.id);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center py-8">
        <div className="text-6xl mb-4 font-serif text-humandesign-400">{profile.symbol}</div>
        <h1 className="font-serif text-4xl font-medium mb-2">{profile.name}</h1>
        <p className="text-xl text-neutral-400">{profile.lifeTheme}</p>
      </header>

      {/* Description */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <p className="text-neutral-300 leading-relaxed">{profile.description}</p>
      </section>

      {/* Line Breakdown */}
      <section className="grid md:grid-cols-2 gap-4">
        {lines.personality && (
          <Link
            to={`/human-design/lines/${lines.personality.id}`}
            className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800 hover:border-humandesign-500/50 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl font-serif text-neutral-200">{profile.personalityLine}</span>
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider">Personality (Conscious)</p>
                <h2 className="font-serif text-lg text-humandesign-300 group-hover:text-humandesign-200 transition-colors">
                  {lines.personality.archetype}
                </h2>
              </div>
            </div>
            <p className="text-neutral-400 text-sm">{lines.personality.theme}</p>
            <p className="text-humandesign-400 text-xs mt-2">Click to learn more →</p>
          </Link>
        )}
        {lines.design && (
          <Link
            to={`/human-design/lines/${lines.design.id}`}
            className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-6 border border-red-500/20 hover:border-red-500/40 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl font-serif text-red-300">{profile.designLine}</span>
              <div>
                <p className="text-xs text-red-400/70 uppercase tracking-wider">Design (Unconscious)</p>
                <h2 className="font-serif text-lg text-red-300 group-hover:text-red-200 transition-colors">
                  {lines.design.archetype}
                </h2>
              </div>
            </div>
            <p className="text-neutral-400 text-sm">{lines.design.theme}</p>
            <p className="text-red-400 text-xs mt-2">Click to learn more →</p>
          </Link>
        )}
      </section>

      {/* Keywords */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl mb-4">Keywords</h2>
        <div className="flex flex-wrap gap-2">
          {profile.keywords.map((keyword, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-humandesign-500/10 text-humandesign-300 rounded-lg text-sm"
            >
              {keyword}
            </span>
          ))}
        </div>
      </section>

      {/* Gifts & Challenges */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl mb-4 text-green-400">Gifts</h2>
          <ul className="space-y-2">
            {profile.gifts.map((gift, i) => (
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
            {profile.challenges.map((challenge, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">!</span>
                <span className="text-neutral-300">{challenge}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Relationship Style */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl mb-4">Relationship Style</h2>
        <p className="text-neutral-300 leading-relaxed">{profile.relationshipStyle}</p>
      </section>

      {/* Career Guidance */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl mb-4">Career & Work</h2>
        <p className="text-neutral-300 leading-relaxed">{profile.careerGuidance}</p>
      </section>

      {/* Practical Guidance */}
      <section className="bg-gradient-to-br from-humandesign-500/10 to-humandesign-600/5 rounded-xl p-6 border border-humandesign-500/20">
        <h2 className="font-serif text-xl mb-4 text-humandesign-300">Practical Guidance</h2>
        <p className="text-neutral-300 leading-relaxed">{profile.practicalGuidance}</p>
      </section>

      {/* Related Links */}
      <section className="flex gap-4">
        <Link
          to="/human-design/lines"
          className="flex-1 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-lg">▵</span>
          <h4 className="font-medium mt-2">Lines</h4>
          <p className="text-sm text-neutral-400 mt-1">Learn about individual lines</p>
        </Link>
        <Link
          to="/human-design/types"
          className="flex-1 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-lg">◉</span>
          <h4 className="font-medium mt-2">Types</h4>
          <p className="text-sm text-neutral-400 mt-1">Your Type + Profile work together</p>
        </Link>
      </section>

      {/* Back Link */}
      <div className="text-center pt-4">
        <Link to="/human-design/profiles" className="text-neutral-400 hover:text-white transition-colors">
          &#8592; Back to Profiles
        </Link>
      </div>
    </div>
  );
}
export default HumanDesignProfileDetail;
