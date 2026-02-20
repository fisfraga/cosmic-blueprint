import { useParams, Link } from 'react-router-dom';
import { aspects } from '../data';

const natureColors = {
  Harmonious: {
    gradient: 'from-water-500/20 to-water-600/10',
    border: 'border-water-500/30',
    text: 'text-water-400',
    bg: 'bg-water-500/10',
  },
  Challenging: {
    gradient: 'from-fire-500/20 to-fire-600/10',
    border: 'border-fire-500/30',
    text: 'text-fire-400',
    bg: 'bg-fire-500/10',
  },
  Neutral: {
    gradient: 'from-air-500/20 to-air-600/10',
    border: 'border-air-500/30',
    text: 'text-air-400',
    bg: 'bg-air-500/10',
  },
};

export function AspectDetail() {
  const { id } = useParams<{ id: string }>();
  const aspect = id ? aspects.get(id) : undefined;

  if (!aspect) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Aspect Not Found</h1>
        <Link to="/aspects" className="text-air-400 hover:underline">
          Back to Aspects
        </Link>
      </div>
    );
  }

  const colors = natureColors[aspect.nature];

  // Get all aspects for navigation
  const allAspects = Array.from(aspects.values());
  const currentIndex = allAspects.findIndex((a) => a.id === aspect.id);
  const prevAspect = currentIndex > 0 ? allAspects[currentIndex - 1] : allAspects[allAspects.length - 1];
  const nextAspect = currentIndex < allAspects.length - 1 ? allAspects[currentIndex + 1] : allAspects[0];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className={`text-center py-10 rounded-2xl bg-gradient-to-br border ${colors.gradient} ${colors.border}`}>
        <div className="text-7xl mb-4">{aspect.symbol}</div>
        <h1 className="font-serif text-4xl font-medium mb-2">{aspect.name}</h1>
        <p className={`text-xl italic ${colors.text}`}>{aspect.keyword}</p>
        <div className="flex items-center justify-center gap-4 mt-4 text-sm text-neutral-400">
          <span className={`px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>
            {aspect.nature}
          </span>
          <span className="px-3 py-1 bg-neutral-800/50 rounded-full">
            {aspect.angle}°
          </span>
          <span className="px-3 py-1 bg-neutral-800/50 rounded-full">
            Orb: {aspect.orbRange}
          </span>
        </div>
      </header>

      {/* Visual Representation */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800 text-center">
        <h2 className="font-serif text-xl mb-4">Angular Relationship</h2>
        <div className="inline-flex items-center justify-center w-48 h-48 rounded-full border-2 border-neutral-700 relative">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full"></div>
          <div
            className={`absolute w-3 h-3 rounded-full ${colors.bg} border-2 ${colors.border}`}
            style={{
              top: `${50 - 45 * Math.cos((aspect.angle * Math.PI) / 180)}%`,
              left: `${50 + 45 * Math.sin((aspect.angle * Math.PI) / 180)}%`,
              transform: 'translate(-50%, -50%)',
            }}
          ></div>
          <div className="text-2xl font-serif text-neutral-400">{aspect.angle}°</div>
        </div>
        <p className="text-neutral-400 mt-4 text-sm">{aspect.elementalPattern}</p>
      </section>

      {/* Explanation */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl mb-4">Understanding the {aspect.name}</h2>
        <p className="text-neutral-300 leading-relaxed">{aspect.explanation}</p>
      </section>

      {/* Impact */}
      <section className={`rounded-xl p-6 border bg-gradient-to-br ${colors.gradient} ${colors.border}`}>
        <h2 className="font-serif text-xl mb-4">Impact & Expression</h2>
        <p className="text-neutral-300 leading-relaxed">{aspect.impact}</p>
      </section>

      {/* Integration Practice */}
      <section className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 rounded-xl p-6 border border-neutral-700">
        <h2 className="font-serif text-xl mb-4">Integration Practice</h2>
        <p className="text-neutral-300 leading-relaxed italic">{aspect.integrationPractice}</p>
      </section>

      {/* Nature Explanation */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl mb-4">About {aspect.nature} Aspects</h2>
        <p className="text-neutral-300 leading-relaxed">
          {aspect.nature === 'Harmonious' && (
            "Harmonious aspects (trines, sextiles) indicate natural flow and ease between planetary energies. These aspects often represent talents and gifts that come naturally, areas where energy flows with minimal friction."
          )}
          {aspect.nature === 'Challenging' && (
            "Challenging aspects (squares, oppositions) create tension that drives growth. While they can indicate areas of difficulty, they also provide the friction necessary for development. These aspects often represent our greatest opportunities for transformation."
          )}
          {aspect.nature === 'Neutral' && (
            "Neutral aspects (conjunctions, some minor aspects) depend heavily on the planets involved. They represent a blending or merging of energies that can manifest positively or negatively based on the specific combination."
          )}
        </p>
      </section>

      {/* Navigation */}
      <nav className="flex justify-between pt-6 border-t border-neutral-800">
        <Link to={`/aspects/${prevAspect.id}`} className="text-neutral-400 hover:text-white transition-colors">
          &larr; {prevAspect.name}
        </Link>
        <Link to="/aspects" className="text-neutral-400 hover:text-white transition-colors">
          All Aspects
        </Link>
        <Link to={`/aspects/${nextAspect.id}`} className="text-neutral-400 hover:text-white transition-colors">
          {nextAspect.name} &rarr;
        </Link>
      </nav>
    </div>
  );
}
export default AspectDetail;
