import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hdProfiles, getProfileLines } from '../data';
import { NotFoundState } from '../components';
import { EntityStack } from '../components/entities/EntityStack';
import type { EntityInfo } from '../services/entities/registry';

export function HumanDesignProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const profile = id ? hdProfiles.get(id) : undefined;

  const [selectedEntities, setSelectedEntities] = useState<EntityInfo[]>([]);
  const handleEntityClick = useCallback((entity: EntityInfo) => {
    setSelectedEntities(prev => {
      const already = prev.findIndex(e => e.id === entity.id);
      if (already !== -1) return prev;
      if (prev.length >= 2) return [prev[1], entity];
      return [...prev, entity];
    });
  }, []);
  const handleCloseEntity = useCallback((entityId: string) => {
    setSelectedEntities(prev => prev.filter(e => e.id !== entityId));
  }, []);

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
    <div className="flex h-full">
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center py-8">
            <div className="text-6xl mb-4 font-serif text-humandesign-400">{profile.symbol}</div>
            <h1 className="font-serif text-4xl font-medium mb-2">{profile.name}</h1>
            <p className="text-xl text-theme-text-secondary">{profile.lifeTheme}</p>
          </header>

          {/* Description */}
          <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
            <p className="text-theme-text-secondary leading-relaxed">{profile.description}</p>
          </section>

          {/* Line Breakdown */}
          <section className="grid md:grid-cols-2 gap-4">
            {lines.personality && (
              <div
                className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle hover:border-humandesign-500/50 transition-colors group cursor-pointer"
                onClick={() => lines.personality && handleEntityClick(lines.personality as unknown as EntityInfo)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-serif text-theme-text-primary">{profile.personalityLine}</span>
                  <div>
                    <p className="text-xs text-theme-text-tertiary uppercase tracking-wider">Personality (Conscious)</p>
                    <h2 className="font-serif text-lg text-humandesign-300 group-hover:text-humandesign-200 transition-colors">
                      {lines.personality.archetype}
                    </h2>
                  </div>
                </div>
                <p className="text-theme-text-secondary text-sm">{lines.personality.theme}</p>
                <Link
                  to={`/human-design/lines/${lines.personality.id}`}
                  className="text-humandesign-400 text-xs mt-2 inline-block hover:underline"
                  onClick={e => e.stopPropagation()}
                >
                  → Full profile
                </Link>
              </div>
            )}
            {lines.design && (
              <div
                className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-6 border border-red-500/20 hover:border-red-500/40 transition-colors group cursor-pointer"
                onClick={() => lines.design && handleEntityClick(lines.design as unknown as EntityInfo)}
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
                <p className="text-theme-text-secondary text-sm">{lines.design.theme}</p>
                <Link
                  to={`/human-design/lines/${lines.design.id}`}
                  className="text-red-400 text-xs mt-2 inline-block hover:underline"
                  onClick={e => e.stopPropagation()}
                >
                  → Full profile
                </Link>
              </div>
            )}
          </section>

          {/* Keywords */}
          <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
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
            <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-4 text-green-400">Gifts</h2>
              <ul className="space-y-2">
                {profile.gifts.map((gift, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">+</span>
                    <span className="text-theme-text-secondary">{gift}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-4 text-amber-400">Challenges</h2>
              <ul className="space-y-2">
                {profile.challenges.map((challenge, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-1">!</span>
                    <span className="text-theme-text-secondary">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Relationship Style */}
          <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
            <h2 className="font-serif text-xl mb-4">Relationship Style</h2>
            <p className="text-theme-text-secondary leading-relaxed">{profile.relationshipStyle}</p>
          </section>

          {/* Career Guidance */}
          <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
            <h2 className="font-serif text-xl mb-4">Career & Work</h2>
            <p className="text-theme-text-secondary leading-relaxed">{profile.careerGuidance}</p>
          </section>

          {/* Practical Guidance */}
          <section className="bg-gradient-to-br from-humandesign-500/10 to-humandesign-600/5 rounded-xl p-6 border border-humandesign-500/20">
            <h2 className="font-serif text-xl mb-4 text-humandesign-300">Practical Guidance</h2>
            <p className="text-theme-text-secondary leading-relaxed">{profile.practicalGuidance}</p>
          </section>

          {/* Related Links */}
          <section className="flex gap-4">
            <Link
              to="/human-design/lines"
              className="flex-1 p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
            >
              <span className="text-lg">▵</span>
              <h4 className="font-medium mt-2">Lines</h4>
              <p className="text-sm text-theme-text-secondary mt-1">Learn about individual lines</p>
            </Link>
            <Link
              to="/human-design/types"
              className="flex-1 p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
            >
              <span className="text-lg">◉</span>
              <h4 className="font-medium mt-2">Types</h4>
              <p className="text-sm text-theme-text-secondary mt-1">Your Type + Profile work together</p>
            </Link>
          </section>

          {/* Back Link */}
          <div className="text-center pt-4">
            <Link to="/human-design/profiles" className="text-theme-text-secondary hover:text-theme-text-primary transition-colors">
              &#8592; Back to Profiles
            </Link>
          </div>
        </div>
      </div>
      <EntityStack
        entities={selectedEntities}
        onCloseEntity={handleCloseEntity}
        onEntityClick={handleEntityClick}
      />
    </div>
  );
}
export default HumanDesignProfileDetail;
