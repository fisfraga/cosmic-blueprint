import { getGKSequencesInOrder, getGKSpheresBySequence } from '../data';
import { Link } from 'react-router-dom';
import type { GKSequenceEntity } from '../types';

export function GKSequences() {
  const sequences = getGKSequencesInOrder();

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">◇</span>
          <h1 className="font-serif text-3xl font-medium">The Golden Path</h1>
        </div>
        <p className="text-theme-text-secondary max-w-3xl">
          The Golden Path is a structured journey through the Gene Keys, comprising three sequences
          that progressively unlock your purpose, open your heart, and release your prosperity.
          Each sequence builds upon the previous, creating a transformational pathway of self-illumination.
        </p>
      </section>

      {/* Overview Cards */}
      <section className="grid md:grid-cols-3 gap-6">
        {sequences.map((seq) => (
          <SequenceOverviewCard key={seq.id} sequence={seq} />
        ))}
      </section>

      {/* Detailed Sequence Sections */}
      {sequences.map((sequence) => (
        <SequenceDetailSection key={sequence.id} sequence={sequence} />
      ))}

      {/* The Journey */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h3 className="font-serif text-lg mb-4">The Journey of Self-Illumination</h3>
        <div className="space-y-4 text-sm text-theme-text-secondary">
          <p>
            The Golden Path is designed to be contemplated over time. You don't rush through it—you allow
            each Gene Key to reveal its wisdom as you integrate the teachings into your daily life.
            This is contemplation as a way of being, not a technique to master.
          </p>
          <p>
            As you travel through the three sequences, you'll notice how they're interconnected.
            Your purpose influences your relationships, which in turn shapes your prosperity.
            The sequences are not separate but different facets of the same diamond of your being.
          </p>
          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-theme-border-subtle">
            <div>
              <h4 className="font-medium text-emerald-300 mb-2">Physical Grounding</h4>
              <p className="text-theme-text-tertiary">
                The Activation Sequence grounds you in your body and centers you in your unique purpose.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-rose-300 mb-2">Emotional Opening</h4>
              <p className="text-theme-text-tertiary">
                The Venus Sequence opens your heart by illuminating and transforming emotional patterns.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-300 mb-2">Mental Clarity</h4>
              <p className="text-theme-text-tertiary">
                The Pearl Sequence clarifies your vision and aligns your gifts with service to the whole.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Begin */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h3 className="font-serif text-lg mb-4">Beginning the Golden Path</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-genekey-300 mb-2">1. Know Your Profile</h4>
            <p className="text-theme-text-secondary">
              To walk the Golden Path, you need your Hologenetic Profile—calculated from your birth data.
              This reveals which Gene Keys appear in each sphere of your life.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-genekey-300 mb-2">2. Start with Activation</h4>
            <p className="text-theme-text-secondary">
              Begin with the Activation Sequence. Contemplate your four Prime Gifts: Life's Work,
              Evolution, Radiance, and Purpose. Let each Gene Key reveal its wisdom over time.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-genekey-300 mb-2">3. Practice Contemplation</h4>
            <p className="text-theme-text-secondary">
              Contemplation is gentle, sustained attention. You roll the Gene Key through your mind
              like a velvet case, waiting for the hidden catch to spring open and reveal its treasure.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-genekey-300 mb-2">4. Trust the Process</h4>
            <p className="text-theme-text-secondary">
              The Gene Keys work through you over time. There's no need to rush or force insights.
              The transformation happens naturally as you bring awareness to the shadows and gifts.
            </p>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="flex gap-4 flex-wrap">
        <Link
          to="/gene-keys/spheres"
          className="flex-1 min-w-[200px] p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
        >
          <span className="text-lg">◎</span>
          <h4 className="font-medium mt-2">Spheres</h4>
          <p className="text-sm text-theme-text-secondary mt-1">The 13 positions in your profile</p>
        </Link>
        <Link
          to="/gene-keys"
          className="flex-1 min-w-[200px] p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
        >
          <span className="text-lg">✧</span>
          <h4 className="font-medium mt-2">Gene Keys</h4>
          <p className="text-sm text-theme-text-secondary mt-1">Explore all 64 Gene Keys</p>
        </Link>
        <Link
          to="/profile"
          className="flex-1 min-w-[200px] p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
        >
          <span className="text-lg">✦</span>
          <h4 className="font-medium mt-2">My Chart</h4>
          <p className="text-sm text-theme-text-secondary mt-1">Your personal profile</p>
        </Link>
      </section>
    </div>
  );
}

function SequenceOverviewCard({ sequence }: { sequence: GKSequenceEntity }) {
  const colorMap: Record<string, { gradient: string; accent: string }> = {
    'activation-sequence': { gradient: 'from-emerald-500/10 to-emerald-600/5', accent: 'emerald' },
    'venus-sequence': { gradient: 'from-rose-500/10 to-rose-600/5', accent: 'rose' },
    'pearl-sequence': { gradient: 'from-blue-500/10 to-blue-600/5', accent: 'blue' },
  };

  const colors = colorMap[sequence.id] || { gradient: 'from-neutral-500/10 to-neutral-600/5', accent: 'neutral' };

  return (
    <div className={`bg-gradient-to-br ${colors.gradient} rounded-xl p-6 border border-${colors.accent}-500/20`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{sequence.symbol}</span>
        <div>
          <h3 className="font-serif text-lg font-medium">{sequence.name}</h3>
          <p className={`text-${colors.accent}-300 text-sm`}>Sequence {sequence.sequenceOrder}</p>
        </div>
      </div>
      <p className="text-theme-text-secondary text-sm mb-4">{sequence.theme}</p>
      <div className={`text-${colors.accent}-400 font-medium text-sm`}>
        "{sequence.primaryQuestion}"
      </div>
    </div>
  );
}

function SequenceDetailSection({ sequence }: { sequence: GKSequenceEntity }) {
  const spheres = getGKSpheresBySequence(sequence.sequenceOrder === 1 ? 'Activation' : sequence.sequenceOrder === 2 ? 'Venus' : 'Pearl');

  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    'activation-sequence': { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    'venus-sequence': { bg: 'bg-rose-500/5', border: 'border-rose-500/20', text: 'text-rose-400' },
    'pearl-sequence': { bg: 'bg-blue-500/5', border: 'border-blue-500/20', text: 'text-blue-400' },
  };

  const colors = colorMap[sequence.id] || { bg: 'bg-neutral-500/5', border: 'border-neutral-500/20', text: 'text-theme-text-secondary' };

  return (
    <section className={`${colors.bg} rounded-xl p-6 border ${colors.border}`}>
      <div className="flex items-start gap-4 mb-6">
        <span className="text-4xl">{sequence.symbol}</span>
        <div>
          <h2 className="font-serif text-2xl font-medium">{sequence.name}</h2>
          <p className={`${colors.text} text-sm`}>{sequence.theme}</p>
        </div>
      </div>

      <p className="text-theme-text-secondary mb-6">{sequence.description}</p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-medium text-theme-text-secondary mb-2">Primary Question</h4>
          <p className={`${colors.text} italic`}>"{sequence.primaryQuestion}"</p>
        </div>
        <div>
          <h4 className="font-medium text-theme-text-secondary mb-2">Contemplation Focus</h4>
          <p className="text-theme-text-secondary text-sm">{sequence.contemplationFocus}</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium text-theme-text-secondary mb-2">Transformation</h4>
        <p className="text-theme-text-secondary text-sm">{sequence.transformation}</p>
      </div>

      <div className="border-t border-theme-border-subtle/50 pt-6">
        <h4 className="font-medium text-theme-text-secondary mb-3">Spheres in This Sequence</h4>
        <div className="grid md:grid-cols-2 gap-3">
          {spheres.map((sphere) => (
            <Link
              key={sphere.id}
              to={`/gene-keys/spheres/${sphere.id}`}
              className="flex items-center gap-3 p-3 bg-surface-base/50 rounded-lg hover:bg-surface-overlay transition-colors"
            >
              <span className={`${colors.text}`}>{sphere.symbol}</span>
              <div>
                <div className="font-medium text-sm">{sphere.name}</div>
                <div className="text-xs text-theme-text-tertiary">{sphere.planetarySource}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {sequence.keywords.map((keyword) => (
          <span key={keyword} className="px-2 py-1 bg-surface-overlay rounded text-theme-text-secondary text-xs">
            {keyword}
          </span>
        ))}
      </div>
    </section>
  );
}
export default GKSequences;
