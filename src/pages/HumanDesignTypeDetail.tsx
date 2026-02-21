import { useParams, Link } from 'react-router-dom';
import { hdTypes, getStrategyForType, hdCenters, chakras } from '../data';
import { NotFoundState } from '../components';

export function HumanDesignTypeDetail() {
  const { id } = useParams<{ id: string }>();
  const hdType = id ? hdTypes.get(id) : undefined;

  if (!hdType) {
    return (
      <NotFoundState
        title="Type Not Found"
        description="The Human Design Type you're looking for doesn't exist."
        backLink="/human-design/types"
        backLabel="Back to Types"
      />
    );
  }

  const strategy = getStrategyForType(hdType.id);
  const definedCenters = hdType.definedCenters
    .map(centerId => hdCenters.get(centerId))
    .filter(Boolean);

  // Chakras for the type's defining centers
  const allChakras = Array.from(chakras.values());
  const typeChakras = definedCenters
    .map((c) => c ? allChakras.find((ch) => ch.relatedHDCenters.includes(c.id)) : undefined)
    .filter(Boolean)
    .filter((ch, i, arr) => arr.findIndex((x) => x?.id === ch?.id) === i);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center py-8">
        <div className="text-6xl mb-4">{hdType.symbol}</div>
        <h1 className="font-serif text-4xl font-medium mb-2">{hdType.name}</h1>
        <p className="text-xl text-humandesign-400 mb-2">{hdType.percentage} of the population</p>
        <p className="text-theme-text-secondary">{hdType.role}</p>
      </header>

      {/* Description */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <p className="text-theme-text-secondary leading-relaxed">{hdType.description}</p>
      </section>

      {/* Core Info Grid */}
      <section className="grid md:grid-cols-2 gap-4">
        {/* Strategy */}
        <div className="bg-gradient-to-br from-humandesign-500/10 to-humandesign-600/5 rounded-xl p-6 border border-humandesign-500/20">
          <h2 className="font-serif text-xl mb-3 text-humandesign-300">Strategy</h2>
          <p className="text-2xl font-medium text-theme-text-primary mb-2">{strategy?.name}</p>
          {strategy && (
            <p className="text-theme-text-secondary text-sm">{strategy.description?.slice(0, 150)}...</p>
          )}
        </div>

        {/* Aura */}
        <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl mb-3">Aura Type</h2>
          <p className="text-xl font-medium text-theme-text-primary mb-2">{hdType.auraType}</p>
          <p className="text-theme-text-secondary text-sm">{hdType.auraDescription}</p>
        </div>
      </section>

      {/* Signature & Not-Self */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-6 border border-green-500/20">
          <h2 className="font-serif text-xl mb-3 text-green-300">Signature: {hdType.signatureEmotion}</h2>
          <p className="text-theme-text-secondary">{hdType.signatureBehavior}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-6 border border-red-500/20">
          <h2 className="font-serif text-xl mb-3 text-red-300">Not-Self: {hdType.notSelfEmotion}</h2>
          <p className="text-theme-text-secondary">{hdType.notSelfBehavior}</p>
        </div>
      </section>

      {/* Keywords */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h2 className="font-serif text-xl mb-4">Keywords</h2>
        <div className="flex flex-wrap gap-2">
          {hdType.keywords.map((keyword, i) => (
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
            {hdType.gifts.map((gift, i) => (
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
            {hdType.challenges.map((challenge, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">!</span>
                <span className="text-theme-text-secondary">{challenge}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Practical Guidance */}
      <section className="bg-gradient-to-br from-humandesign-500/10 to-humandesign-600/5 rounded-xl p-6 border border-humandesign-500/20">
        <h2 className="font-serif text-xl mb-4 text-humandesign-300">Practical Guidance</h2>
        <p className="text-theme-text-secondary leading-relaxed">{hdType.practicalGuidance}</p>
      </section>

      {/* Defined Centers */}
      {definedCenters.length > 0 && (
        <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl mb-4">Key Centers</h2>
          <p className="text-theme-text-secondary mb-4">
            {hdType.name}s have these centers defined as part of their type:
          </p>
          <div className="flex gap-4">
            {definedCenters.map((center) => (
              center && (
                <Link
                  key={center.id}
                  to={`/human-design/centers/${center.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-humandesign-500/10 rounded-lg hover:bg-humandesign-500/20 transition-colors"
                >
                  <span className="text-2xl">{center.symbol}</span>
                  <span className="text-humandesign-300">{center.name}</span>
                </Link>
              )
            ))}
          </div>
        </section>
      )}

      {/* Famous Examples */}
      {hdType.famousExamples && hdType.famousExamples.length > 0 && (
        <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl mb-4">Famous Examples</h2>
          <div className="flex flex-wrap gap-3">
            {hdType.famousExamples.map((example, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-surface-raised text-theme-text-secondary rounded-lg text-sm"
              >
                {example}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Chakra Resonance */}
      {typeChakras.length > 0 && (
        <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl mb-2">Chakra Resonance</h2>
          <p className="text-theme-text-tertiary text-sm mb-4">
            The centers that define this type resonate with these chakras in the Hindu-Brahman tradition.
          </p>
          <div className="flex flex-wrap gap-3">
            {typeChakras.map((chakra) => chakra && (
              <Link
                key={chakra.id}
                to={`/chakras/${chakra.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors border border-theme-border-subtle"
              >
                <div
                  className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: chakra.colorHex + '33', border: `2px solid ${chakra.colorHex}66` }}
                >
                  {chakra.symbol}
                </div>
                <div>
                  <p className="text-theme-text-primary text-sm font-medium">{chakra.name}</p>
                  <p className="text-theme-text-tertiary text-xs">{chakra.lifeTheme}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Links */}
      <section className="flex gap-4">
        {strategy && (
          <div className="flex-1 p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle">
            <span className="text-lg">{strategy.symbol}</span>
            <h4 className="font-medium mt-2">{strategy.name}</h4>
            <p className="text-sm text-theme-text-secondary mt-1">This type's strategy</p>
          </div>
        )}
        <Link
          to="/human-design/authorities"
          className="flex-1 p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
        >
          <span className="text-lg">⌖</span>
          <h4 className="font-medium mt-2">Authorities</h4>
          <p className="text-sm text-theme-text-secondary mt-1">Learn about decision-making</p>
        </Link>
      </section>

      {/* Back Link */}
      <div className="text-center pt-4">
        <Link to="/human-design/types" className="text-theme-text-secondary hover:text-theme-text-primary transition-colors">
          &#8592; Back to Types
        </Link>
      </div>
    </div>
  );
}
export default HumanDesignTypeDetail;
