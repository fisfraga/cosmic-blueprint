import { useParams, Link } from 'react-router-dom';
import { trigrams } from '../data';

export function TrigramDetail() {
  const { id } = useParams<{ id: string }>();
  const trigram = id ? trigrams.get(id) : undefined;

  // Not found state
  if (!trigram) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Trigram Not Found</h1>
        <p className="text-theme-text-secondary mb-4">
          The trigram you're looking for doesn't exist.
        </p>
        <Link to="/gene-keys/trigrams" className="text-emerald-400 hover:underline">
          ← Back to Trigrams
        </Link>
      </div>
    );
  }

  // Element colors
  const elementColors: Record<string, { bg: string; text: string; border: string }> = {
    Metal: { bg: 'from-neutral-500/20 to-neutral-600/10', text: 'text-theme-text-secondary', border: 'border-neutral-500/30' },
    Earth: { bg: 'from-amber-500/20 to-amber-600/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    Wood: { bg: 'from-green-500/20 to-green-600/10', text: 'text-green-400', border: 'border-green-500/30' },
    Water: { bg: 'from-blue-500/20 to-blue-600/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    Fire: { bg: 'from-red-500/20 to-red-600/10', text: 'text-red-400', border: 'border-red-500/30' },
  };

  const colors = elementColors[trigram.element] || elementColors.Metal;

  // Render line representation
  const renderLines = () => {
    return (
      <div className="flex flex-col gap-1">
        {trigram.lines.slice().reverse().map((line, idx) => (
          <div key={idx} className="flex justify-center">
            {line === 'yang' ? (
              <div className="w-16 h-2 bg-white rounded-sm" />
            ) : (
              <div className="flex gap-2">
                <div className="w-6 h-2 bg-white rounded-sm" />
                <div className="w-6 h-2 bg-white rounded-sm" />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className={`text-center py-8 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border}`}>
        <div className="text-6xl mb-4">{trigram.symbol}</div>
        <h1 className="font-serif text-4xl font-medium mb-2">{trigram.name}</h1>
        <p className="text-xl text-theme-text-secondary italic">{trigram.chineseName}</p>

        {/* Meta Pills */}
        <div className="flex items-center justify-center gap-3 text-sm flex-wrap mt-4">
          <span className={`px-3 py-1.5 ${colors.text} bg-surface-base/50 rounded-full`}>
            {trigram.nature}
          </span>
          <span className={`px-3 py-1.5 ${colors.text} bg-surface-base/50 rounded-full`}>
            {trigram.element}
          </span>
          <span className="px-3 py-1.5 text-theme-text-secondary bg-surface-base/50 rounded-full">
            {trigram.familyMember}
          </span>
        </div>
      </header>

      {/* Line Structure */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h2 className="font-serif text-xl mb-4 text-center">Line Structure</h2>
        <div className="flex justify-center mb-4">
          {renderLines()}
        </div>
        <div className="flex justify-center gap-4 text-sm text-theme-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1.5 bg-white rounded-sm" />
            <span>Yang (unbroken)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-3 h-1.5 bg-white rounded-sm" />
              <div className="w-3 h-1.5 bg-white rounded-sm" />
            </div>
            <span>Yin (broken)</span>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h2 className="font-serif text-xl mb-4">Meaning</h2>
        <p className="text-theme-text-secondary leading-relaxed">{trigram.description}</p>
      </section>

      {/* Attributes Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-lg mb-4">Nature & Attributes</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-theme-text-tertiary">Nature</span>
              <span className="text-theme-text-primary">{trigram.nature}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-text-tertiary">Attribute</span>
              <span className="text-theme-text-primary">{trigram.attribute}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-text-tertiary">Element</span>
              <span className={colors.text}>{trigram.element}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-text-tertiary">Direction</span>
              <span className="text-theme-text-primary">{trigram.direction}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-text-tertiary">Season</span>
              <span className="text-theme-text-primary">{trigram.season}</span>
            </div>
          </div>
        </section>

        <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-lg mb-4">Correspondences</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-theme-text-tertiary">Family Role</span>
              <span className="text-theme-text-primary">{trigram.familyMember}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-text-tertiary">Body Part</span>
              <span className="text-theme-text-primary">{trigram.bodyPart}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-text-tertiary">Animal</span>
              <span className="text-theme-text-primary">{trigram.animal}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Gene Keys Correlation */}
      {trigram.geneKeyCorrelation && (
        <section className="bg-emerald-900/20 rounded-xl p-6 border border-emerald-500/20">
          <h2 className="font-serif text-xl mb-4 text-emerald-400">Gene Keys Correlation</h2>
          <p className="text-theme-text-secondary leading-relaxed">{trigram.geneKeyCorrelation}</p>
        </section>
      )}

      {/* Upper/Lower Trigram Meanings */}
      <div className="grid md:grid-cols-2 gap-6">
        {trigram.upperTrigram && (
          <section className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-xl p-6 border border-amber-500/20">
            <h2 className="font-serif text-lg mb-3 text-amber-400">As Upper Trigram</h2>
            <p className="text-theme-text-secondary leading-relaxed text-sm">{trigram.upperTrigram}</p>
          </section>
        )}
        {trigram.lowerTrigram && (
          <section className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 rounded-xl p-6 border border-teal-500/20">
            <h2 className="font-serif text-lg mb-3 text-teal-400">As Lower Trigram</h2>
            <p className="text-theme-text-secondary leading-relaxed text-sm">{trigram.lowerTrigram}</p>
          </section>
        )}
      </div>

      {/* Keywords */}
      {trigram.keywords && trigram.keywords.length > 0 && (
        <section className="flex flex-wrap gap-2 justify-center">
          {trigram.keywords.map((keyword, i) => (
            <span
              key={i}
              className={`px-3 py-1.5 bg-surface-raised ${colors.text} rounded-full text-sm`}
            >
              {keyword}
            </span>
          ))}
        </section>
      )}

      {/* Navigation */}
      <nav className="flex justify-between pt-6 border-t border-theme-border-subtle">
        <Link
          to="/gene-keys/trigrams"
          className="text-theme-text-secondary hover:text-theme-text-primary transition-colors"
        >
          ← All Trigrams
        </Link>
        <Link
          to="/gene-keys"
          className="text-theme-text-secondary hover:text-theme-text-primary transition-colors"
        >
          Gene Keys →
        </Link>
      </nav>
    </div>
  );
}

export default TrigramDetail;
