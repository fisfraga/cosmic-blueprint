import { useState } from 'react';
import { getHDVariablesByCategory, getHDVariableCategories } from '../data';
import type { HDVariableCategory, HDVariableEntity } from '../types';

const categoryIcons: Record<HDVariableCategory, string> = {
  Determination: '⚙',
  Cognition: '👁',
  Environment: '🏠',
  Motivation: '🧠',
};

const categoryColors: Record<HDVariableCategory, string> = {
  Determination: 'from-amber-500/10 to-amber-600/5 border-amber-500/20 text-amber-300',
  Cognition: 'from-violet-500/10 to-violet-600/5 border-violet-500/20 text-violet-300',
  Environment: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-300',
  Motivation: 'from-pink-500/10 to-pink-600/5 border-pink-500/20 text-pink-300',
};

const arrowLabels: Record<string, { left: string; right: string }> = {
  Determination: { left: 'Strategic (Focused)', right: 'Receptive (Open)' },
  Cognition: { left: 'Strategic (Focused)', right: 'Receptive (Open)' },
  Environment: { left: 'Strategic (Focused)', right: 'Receptive (Open)' },
  Motivation: { left: 'Strategic (Focused)', right: 'Receptive (Open)' },
};

function VariableCard({ variable }: { variable: HDVariableEntity }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left hover:bg-neutral-800/30 transition-colors"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">{variable.symbol}</span>
            <div>
              <h3 className="font-medium text-white">{variable.name}</h3>
              <p className="text-sm text-neutral-400">
                Tone {variable.tone} • Color {variable.color} ({variable.colorName}) • {variable.arrow} Arrow
              </p>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-neutral-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-neutral-800 pt-4 space-y-4">
          <p className="text-neutral-300 text-sm leading-relaxed">{variable.description}</p>

          {/* Keywords */}
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Keywords</p>
            <div className="flex flex-wrap gap-2">
              {variable.keywords.map((keyword, i) => (
                <span key={i} className="px-2 py-1 bg-neutral-800 rounded text-xs text-neutral-300">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Application */}
          {variable.physicalApplication && (
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Physical Application</p>
              <p className="text-neutral-300 text-sm">{variable.physicalApplication}</p>
            </div>
          )}
          {variable.mentalApplication && (
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Mental Application</p>
              <p className="text-neutral-300 text-sm">{variable.mentalApplication}</p>
            </div>
          )}

          {/* Environmental Support */}
          {variable.environmentalSupport && (
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Environmental Support</p>
              <p className="text-neutral-300 text-sm">{variable.environmentalSupport}</p>
            </div>
          )}

          {/* Ideal Characteristics */}
          {variable.idealCharacteristics && variable.idealCharacteristics.length > 0 && (
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Ideal Characteristics</p>
              <ul className="text-neutral-300 text-sm list-disc list-inside space-y-1">
                {variable.idealCharacteristics.map((char, i) => (
                  <li key={i}>{char}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Perception Strength */}
          {variable.perceptionStrength && (
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Perception Strength</p>
              <p className="text-neutral-300 text-sm">{variable.perceptionStrength}</p>
            </div>
          )}

          {/* Expression (Motivation) */}
          {variable.healthyExpression && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-emerald-400 uppercase tracking-wider mb-2">Healthy Expression</p>
                <p className="text-neutral-300 text-sm">{variable.healthyExpression}</p>
              </div>
              {variable.unhealthyExpression && (
                <div>
                  <p className="text-xs text-rose-400 uppercase tracking-wider mb-2">Unhealthy Expression</p>
                  <p className="text-neutral-300 text-sm">{variable.unhealthyExpression}</p>
                </div>
              )}
            </div>
          )}

          {/* Challenges */}
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Challenges</p>
            <ul className="text-neutral-400 text-sm list-disc list-inside space-y-1">
              {variable.challenges.map((challenge, i) => (
                <li key={i}>{challenge}</li>
              ))}
            </ul>
          </div>

          {/* Practical Guidance */}
          <div className="bg-neutral-800/50 rounded-lg p-4">
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Practical Guidance</p>
            <p className="text-neutral-200 text-sm leading-relaxed">{variable.practicalGuidance}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function CategorySection({ category }: { category: HDVariableCategory }) {
  const variables = getHDVariablesByCategory(category);
  const leftArrowVars = variables.filter((v) => v.arrow === 'Left');
  const rightArrowVars = variables.filter((v) => v.arrow === 'Right');
  const categoryInfo = getHDVariableCategories().find((c) => c.id === category);

  return (
    <section className="space-y-4">
      <div className={`bg-gradient-to-br ${categoryColors[category]} rounded-xl p-6 border`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{categoryIcons[category]}</span>
          <h2 className="font-serif text-xl">{category}</h2>
        </div>
        <p className="text-neutral-300 text-sm">{categoryInfo?.description}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Arrow Column */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-neutral-400">←</span>
            <h3 className="text-sm font-medium text-neutral-300">{arrowLabels[category].left}</h3>
          </div>
          <div className="space-y-3">
            {leftArrowVars.map((variable) => (
              <VariableCard key={variable.id} variable={variable} />
            ))}
          </div>
        </div>

        {/* Right Arrow Column */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-neutral-400">→</span>
            <h3 className="text-sm font-medium text-neutral-300">{arrowLabels[category].right}</h3>
          </div>
          <div className="space-y-3">
            {rightArrowVars.map((variable) => (
              <VariableCard key={variable.id} variable={variable} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HumanDesignVariables() {
  const categories: HDVariableCategory[] = ['Determination', 'Cognition', 'Environment', 'Motivation'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">⚡</span>
          <h1 className="font-serif text-3xl font-medium">Human Design Variables</h1>
        </div>
        <p className="text-neutral-400 max-w-3xl">
          The Variables are the most advanced aspect of Human Design, representing the four arrows in your bodygraph.
          They describe how your brain and body are designed to operate at the deepest level—covering digestion,
          cognition, environment, and motivation.
        </p>
      </section>

      {/* Overview */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h3 className="font-serif text-lg mb-4">Understanding the Four Arrows</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div key={category} className={`bg-gradient-to-br ${categoryColors[category]} rounded-lg p-4 border`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{categoryIcons[category]}</span>
                <h4 className="font-medium">{category}</h4>
              </div>
              <p className="text-neutral-400 text-xs">
                {category === 'Determination' && 'How you should eat and digest food'}
                {category === 'Cognition' && 'How you perceive and process information'}
                {category === 'Environment' && 'What physical environment supports you'}
                {category === 'Motivation' && 'What naturally drives your mind'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Arrow Directions */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h3 className="font-serif text-lg mb-4">Arrow Directions</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-lg">←</div>
            <div>
              <h4 className="font-medium text-neutral-200 mb-1">Left Arrow (Strategic)</h4>
              <p className="text-neutral-400 text-sm">
                Left-facing arrows indicate a focused, strategic orientation. You have specific needs and preferences
                that should be honored. These are active, directed processes.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-lg">→</div>
            <div>
              <h4 className="font-medium text-neutral-200 mb-1">Right Arrow (Receptive)</h4>
              <p className="text-neutral-400 text-sm">
                Right-facing arrows indicate a receptive, open orientation. You're designed to adapt and respond
                to what life presents. These are passive, receiving processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Sections */}
      {categories.map((category) => (
        <CategorySection key={category} category={category} />
      ))}

      {/* How to Use */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h3 className="font-serif text-lg mb-4">Working with Your Variables</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-amber-300 mb-2">Finding Your Variables</h4>
            <p className="text-neutral-400 text-sm">
              Your Variables are determined by the positions of the four arrows at the corners of your bodygraph.
              You'll need an advanced Human Design chart or reading to know your specific Variables.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-violet-300 mb-2">Experimentation</h4>
            <p className="text-neutral-400 text-sm">
              Variables are meant to be experimented with, not believed. Try the recommendations for your
              specific Variables and notice what feels right in your body and mind.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-emerald-300 mb-2">Patience Required</h4>
            <p className="text-neutral-400 text-sm">
              Changes to diet, environment, and mental patterns take time to integrate. Give yourself space
              to experiment over weeks and months rather than expecting immediate results.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-pink-300 mb-2">Body Awareness</h4>
            <p className="text-neutral-400 text-sm">
              Your body is the ultimate authority on what works for you. The Variables provide guidance,
              but always trust your body's feedback over any system or theory.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
export default HumanDesignVariables;
