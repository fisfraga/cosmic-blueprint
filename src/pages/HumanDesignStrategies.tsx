import { Link } from 'react-router-dom';
import { hdStrategies, hdTypes } from '../data';
import type { HDStrategyEntity } from '../types';

// Strategy colors based on type
const STRATEGY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'hd-strategy-wait-to-respond': {
    bg: 'from-amber-500/20 to-amber-600/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  'hd-strategy-inform': {
    bg: 'from-rose-500/20 to-rose-600/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
  'hd-strategy-wait-for-invitation': {
    bg: 'from-blue-500/20 to-blue-600/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  'hd-strategy-lunar-cycle': {
    bg: 'from-purple-500/20 to-purple-600/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
};

export function HumanDesignStrategies() {
  const allStrategies = Array.from(hdStrategies.values());

  // Get HD types for a strategy
  const getTypesForStrategy = (strategy: HDStrategyEntity) => {
    return strategy.hdTypeIds
      .map(typeId => hdTypes.get(typeId))
      .filter(Boolean);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">⟳</span>
          <h1 className="font-serif text-3xl font-medium">Human Design Strategies</h1>
        </div>
        <p className="text-neutral-400 max-w-3xl">
          Your Strategy is the mechanical way you're designed to navigate life correctly. It's not a
          philosophy or belief system—it's your aura's natural operating mechanism. Following your
          Strategy reduces resistance and leads to your signature experience of life.
        </p>
      </section>

      {/* Strategies Grid */}
      <section className="space-y-6">
        {allStrategies.map((strategy) => {
          const colors = STRATEGY_COLORS[strategy.id] || STRATEGY_COLORS['hd-strategy-wait-to-respond'];
          const types = getTypesForStrategy(strategy);

          return (
            <div
              key={strategy.id}
              className={`rounded-xl p-6 border ${colors.border} bg-gradient-to-br ${colors.bg}`}
            >
              {/* Header Row */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{strategy.symbol}</span>
                  <div>
                    <h2 className="font-serif text-2xl font-medium">{strategy.name}</h2>
                    <div className="flex gap-2 mt-1">
                      {types.map(type => (
                        <Link
                          key={type?.id}
                          to={`/human-design/types/${type?.id}`}
                          className={`text-xs px-2 py-0.5 ${colors.text} bg-neutral-900/50 rounded-full hover:bg-neutral-900/70 transition-colors`}
                        >
                          {type?.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-neutral-300 leading-relaxed mb-4">{strategy.description}</p>

              {/* Practical Guidance */}
              <div className="bg-neutral-900/50 rounded-lg p-4 mb-4">
                <h3 className={`text-sm font-medium ${colors.text} mb-2`}>Practical Guidance</h3>
                <p className="text-sm text-neutral-400">{strategy.practicalGuidance}</p>
              </div>

              {/* Signs of Correctness/Incorrectness */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-500/20">
                  <h3 className="text-sm font-medium text-emerald-400 mb-2">Sign of Correctness</h3>
                  <p className="text-sm text-neutral-400">{strategy.signOfCorrectness}</p>
                </div>
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/20">
                  <h3 className="text-sm font-medium text-red-400 mb-2">Sign of Incorrectness</h3>
                  <p className="text-sm text-neutral-400">{strategy.signOfIncorrectness}</p>
                </div>
              </div>

              {/* Examples */}
              {strategy.examples && strategy.examples.length > 0 && (
                <div className="mb-4">
                  <h3 className={`text-sm font-medium ${colors.text} mb-2`}>Examples</h3>
                  <ul className="space-y-1.5">
                    {strategy.examples.map((example, idx) => (
                      <li key={idx} className="text-sm text-neutral-400 flex items-start gap-2">
                        <span className={`${colors.text}`}>•</span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Common Misunderstandings */}
              {strategy.commonMisunderstandings && strategy.commonMisunderstandings.length > 0 && (
                <div className="bg-neutral-800/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-neutral-300 mb-2">Common Misunderstandings</h3>
                  <ul className="space-y-1.5">
                    {strategy.commonMisunderstandings.map((misunderstanding, idx) => (
                      <li key={idx} className="text-sm text-neutral-500 flex items-start gap-2">
                        <span className="text-neutral-600">—</span>
                        {misunderstanding}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Keywords */}
              {strategy.keywords && strategy.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {strategy.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2 py-1 ${colors.text} bg-neutral-900/50 rounded-full`}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Understanding Note */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h3 className="font-serif text-lg mb-3">Strategy vs. Authority</h3>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Your <strong className="text-amber-300">Strategy</strong> is how you engage with life—it's your
          aura's natural way of navigating. Your <strong className="text-amber-300">Authority</strong> is
          how you make decisions once you've followed your Strategy. For example, a Generator waits to
          respond (Strategy), then uses their Sacral response or Emotional wave (Authority) to make the
          actual decision. Following your Strategy first ensures you're engaging with the right opportunities;
          your Authority then guides the final decision.
        </p>
      </section>

      {/* Related Links */}
      <section className="flex gap-4">
        <Link
          to="/human-design/types"
          className="flex-1 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-lg">◉</span>
          <h4 className="font-medium mt-2">Types</h4>
          <p className="text-sm text-neutral-400 mt-1">Learn about the five Human Design Types</p>
        </Link>
        <Link
          to="/human-design/authorities"
          className="flex-1 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-lg">⌖</span>
          <h4 className="font-medium mt-2">Authorities</h4>
          <p className="text-sm text-neutral-400 mt-1">Explore decision-making authorities</p>
        </Link>
      </section>
    </div>
  );
}

export default HumanDesignStrategies;
