import { getHDProfiles, getProfileLines } from '../data';
import { EntityCard } from '../components';
import { Link } from 'react-router-dom';

export function HumanDesignProfiles() {
  const profiles = getHDProfiles();

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">⟁</span>
          <h1 className="font-serif text-3xl font-medium">Human Design Profiles</h1>
        </div>
        <p className="text-theme-text-secondary max-w-3xl">
          Your Profile is one of the most important aspects of your Human Design. It's determined by the lines
          of your Personality Sun (conscious) and Design Sun (unconscious), creating a unique costume you wear
          in this life. There are 12 possible Profiles, each with its own life theme and journey.
        </p>
      </section>

      {/* Profiles Grid */}
      <section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((profile) => (
            <EntityCard key={profile.id} entity={profile} />
          ))}
        </div>
      </section>

      {/* Profiles Overview */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h3 className="font-serif text-lg mb-4">The 12 Profiles at a Glance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme-border-subtle text-left">
                <th className="py-2 px-3 text-theme-text-secondary">Profile</th>
                <th className="py-2 px-3 text-theme-text-secondary">Name</th>
                <th className="py-2 px-3 text-theme-text-secondary hidden md:table-cell">Life Theme</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => {
                const lines = getProfileLines(profile.id);
                return (
                  <tr key={profile.id} className="border-b border-theme-border-subtle hover:bg-surface-overlay">
                    <td className="py-3 px-3">
                      <Link
                        to={`/human-design/profiles/${profile.id}`}
                        className="text-humandesign-400 font-medium hover:text-humandesign-300"
                      >
                        {profile.symbol}
                      </Link>
                    </td>
                    <td className="py-3 px-3">
                      <div>
                        <Link
                          to={`/human-design/profiles/${profile.id}`}
                          className="text-theme-text-primary hover:text-theme-text-primary"
                        >
                          {lines.personality?.archetype}/{lines.design?.archetype}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-theme-text-secondary hidden md:table-cell">
                      {profile.lifeTheme}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Understanding Profiles */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h3 className="font-serif text-lg mb-3 text-theme-text-primary">Personality Line (Conscious)</h3>
          <p className="text-theme-text-secondary text-sm mb-3">
            The first number in your Profile comes from your Personality (conscious) Sun. This is the line
            you're aware of and consciously identify with. It's the "costume" you know you're wearing.
          </p>
          <p className="text-theme-text-tertiary text-xs italic">
            "This is who I think I am and how I consciously engage with life."
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-6 border border-red-500/20">
          <h3 className="font-serif text-lg mb-3 text-red-300">Design Line (Unconscious)</h3>
          <p className="text-theme-text-secondary text-sm mb-3">
            The second number comes from your Design (unconscious) Sun, calculated 88 days before birth.
            This operates beneath your awareness—others often see it more clearly than you do.
          </p>
          <p className="text-theme-text-tertiary text-xs italic">
            "This is what others see in me that I may not recognize in myself."
          </p>
        </div>
      </section>

      {/* Profile Categories */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h3 className="font-serif text-lg mb-4">Profile Categories</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-humandesign-300 mb-2">Right Angle Profiles (Personal Destiny)</h4>
            <p className="text-theme-text-secondary text-sm mb-3">
              1/3, 1/4, 2/4, 2/5, 3/5, 3/6, 4/6 — These profiles are primarily focused on their own journey
              and personal karma. They're self-absorbed in the healthiest sense.
            </p>
            <div className="flex flex-wrap gap-2">
              {['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6'].map((p) => (
                <span key={p} className="px-2 py-1 bg-humandesign-500/10 text-humandesign-300 rounded text-xs">
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-amber-300 mb-2">Juxtaposition & Left Angle (Transpersonal)</h4>
            <p className="text-theme-text-secondary text-sm mb-3">
              4/1 (Juxtaposition), 5/1, 5/2, 6/2, 6/3 — These profiles are here to interact with and
              influence others. Their karma is intertwined with other people's journeys.
            </p>
            <div className="flex flex-wrap gap-2">
              {['4/1', '5/1', '5/2', '6/2', '6/3'].map((p) => (
                <span key={p} className="px-2 py-1 bg-amber-500/10 text-amber-300 rounded text-xs">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="flex gap-4">
        <Link
          to="/human-design/lines"
          className="flex-1 p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
        >
          <span className="text-lg">▵</span>
          <h4 className="font-medium mt-2">Lines</h4>
          <p className="text-sm text-theme-text-secondary mt-1">Learn about the 6 individual lines</p>
        </Link>
        <Link
          to="/human-design/types"
          className="flex-1 p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
        >
          <span className="text-lg">◉</span>
          <h4 className="font-medium mt-2">Types</h4>
          <p className="text-sm text-theme-text-secondary mt-1">Explore the five HD types</p>
        </Link>
      </section>
    </div>
  );
}
export default HumanDesignProfiles;
