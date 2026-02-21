import { Link } from 'react-router-dom';
import { getLines } from '../data';
import { motion } from 'framer-motion';

export function Lines() {
  const allLines = getLines();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center py-8">
        <h1 className="font-serif text-4xl font-medium mb-4">The Six Lines</h1>
        <p className="text-theme-text-secondary max-w-2xl mx-auto">
          The six lines are fundamental building blocks in both Human Design and Gene Keys,
          representing six archetypal ways of being in the world. Each line brings its own
          gifts, challenges, and path of growth.
        </p>
      </header>

      {/* Trigram Context */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h2 className="font-serif text-xl mb-4">Understanding the Lines</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-indigo-400 font-medium mb-2">Lower Trigram (Lines 1-3)</h3>
            <p className="text-theme-text-secondary text-sm">
              The lower trigram represents the personal, inward journey. These lines deal with
              building foundations, discovering natural talents, and learning through experience.
            </p>
          </div>
          <div>
            <h3 className="text-indigo-400 font-medium mb-2">Upper Trigram (Lines 4-6)</h3>
            <p className="text-theme-text-secondary text-sm">
              The upper trigram represents the transpersonal, outward journey. These lines deal with
              relationships, influence, and eventual mastery through integration.
            </p>
          </div>
        </div>
      </section>

      {/* Lines Grid */}
      <section className="space-y-4">
        {allLines.map((line, index) => (
          <motion.div
            key={line.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={`/lines/${line.id}`}
              className="block bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle hover:border-indigo-500/30 hover:bg-surface-base/80 transition-all"
            >
              <div className="flex items-start gap-6">
                {/* Line Number */}
                <div className="text-5xl font-serif text-indigo-400 w-16 text-center">
                  {line.lineNumber}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-serif text-xltext-theme-text-primary">{line.archetype}</h2>
                    <span className="text-xs px-2 py-0.5 bg-surface-raised text-theme-text-secondary rounded">
                      {line.trigram} Trigram
                    </span>
                  </div>
                  <p className="text-theme-text-secondary text-sm mb-3 line-clamp-2">
                    {line.summary}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {line.keywords.slice(0, 4).map((keyword, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-theme-text-muted self-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Harmony Pairs Info */}
      <section className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 rounded-xl p-6 border border-indigo-500/20">
        <h2 className="font-serif text-xl mb-4 text-indigo-300">Harmony Pairs</h2>
        <p className="text-theme-text-secondary text-sm mb-4">
          Lines form natural harmony pairs based on their position in the hexagram structure:
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-3 bg-surface-base/50 rounded-lg">
            <p className="text-indigo-400 font-medium">Line 1 & Line 4</p>
            <p className="text-theme-text-secondary text-xs mt-1">Foundation & Network</p>
          </div>
          <div className="p-3 bg-surface-base/50 rounded-lg">
            <p className="text-indigo-400 font-medium">Line 2 & Line 5</p>
            <p className="text-theme-text-secondary text-xs mt-1">Natural Gift & Universalization</p>
          </div>
          <div className="p-3 bg-surface-base/50 rounded-lg">
            <p className="text-indigo-400 font-medium">Line 3 & Line 6</p>
            <p className="text-theme-text-secondary text-xs mt-1">Experience & Integration</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Lines;
