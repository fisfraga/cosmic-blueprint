import { useParams, Link } from 'react-router-dom';
import { gkSpheres, getPartnerSphere, getGKSpheresBySequence } from '../data';
import { NotFoundState } from '../components';

export function GKSphereDetail() {
  const { id } = useParams<{ id: string }>();
  const sphere = id ? gkSpheres.get(id) : undefined;

  if (!sphere) {
    return (
      <NotFoundState
        title="Sphere Not Found"
        description="The Gene Keys Sphere you're looking for doesn't exist."
        backLink="/gene-keys/spheres"
        backLabel="Back to Spheres"
      />
    );
  }

  const partnerSphere = getPartnerSphere(sphere.id);
  const sequenceSpheres = getGKSpheresBySequence(sphere.sequence);

  const sequenceColors = {
    Activation: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-300',
    Venus: 'from-rose-500/10 to-rose-600/5 border-rose-500/20 text-rose-300',
    Pearl: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-300',
    Additional: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-300',
  };

  const sequenceColor = sequenceColors[sphere.sequence];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center py-8">
        <div className="text-6xl mb-4">{sphere.symbol}</div>
        <h1 className="font-serif text-4xl font-medium mb-2">{sphere.name}</h1>
        <p className="text-xl text-genekey-400 mb-2">{sphere.theme}</p>
        <div className="flex justify-center gap-4 mt-4">
          <span className={`px-3 py-1 bg-gradient-to-r ${sequenceColor} rounded-lg text-sm`}>
            {sphere.sequence} Sequence
          </span>
          <span className="px-3 py-1 bg-surface-raised text-theme-text-secondary rounded-lg text-sm">
            Position {sphere.sequenceOrder}
          </span>
        </div>
      </header>

      {/* Planetary Source */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle text-center">
        <p className="text-theme-text-tertiary text-sm mb-1">Planetary Source</p>
        <p className="text-xl text-genekey-300">{sphere.planetarySource}</p>
      </section>

      {/* Description */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <p className="text-theme-text-secondary leading-relaxed">{sphere.description}</p>
      </section>

      {/* Central Question */}
      <section className={`bg-gradient-to-br ${sequenceColor} rounded-xl p-6 border`}>
        <h2 className="font-serif text-xl mb-3">The Central Question</h2>
        <p className="text-xl text-theme-text-primary italic">"{sphere.question}"</p>
      </section>

      {/* Keywords */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h2 className="font-serif text-xl mb-4">Keywords</h2>
        <div className="flex flex-wrap gap-2">
          {sphere.keywords.map((keyword, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-genekey-500/10 text-genekey-300 rounded-lg text-sm"
            >
              {keyword}
            </span>
          ))}
        </div>
      </section>

      {/* Practical Guidance */}
      <section className="bg-gradient-to-br from-genekey-500/10 to-genekey-600/5 rounded-xl p-6 border border-genekey-500/20">
        <h2 className="font-serif text-xl mb-4 text-genekey-300">Practical Guidance</h2>
        <p className="text-theme-text-secondary leading-relaxed">{sphere.practicalGuidance}</p>
      </section>

      {/* Partner Sphere */}
      {partnerSphere && (
        <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl mb-4">Partner Sphere</h2>
          <p className="text-theme-text-secondary mb-4">{sphere.relationship}</p>
          <Link
            to={`/gene-keys/spheres/${partnerSphere.id}`}
            className="flex items-center gap-4 p-4 bg-genekey-500/10 rounded-lg hover:bg-genekey-500/20 transition-colors"
          >
            <span className="text-3xl">{partnerSphere.symbol}</span>
            <div>
              <h3 className="font-medium text-genekey-300">{partnerSphere.name}</h3>
              <p className="text-theme-text-secondary text-sm">{partnerSphere.theme}</p>
            </div>
          </Link>
        </section>
      )}

      {/* Other Spheres in Sequence */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h2 className="font-serif text-xl mb-4">Other {sphere.sequence} Sequence Spheres</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {sequenceSpheres
            .filter((s) => s.id !== sphere.id)
            .map((s) => (
              <Link
                key={s.id}
                to={`/gene-keys/spheres/${s.id}`}
                className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg hover:bg-surface-raised transition-colors"
              >
                <span className="text-xl">{s.symbol}</span>
                <div>
                  <span className="text-theme-text-primary">{s.name}</span>
                  <p className="text-theme-text-tertiary text-xs">{s.theme}</p>
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* Related Links */}
      <section className="flex gap-4">
        <Link
          to="/gene-keys"
          className="flex-1 p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
        >
          <span className="text-lg">✧</span>
          <h4 className="font-medium mt-2">Gene Keys</h4>
          <p className="text-sm text-theme-text-secondary mt-1">Find the key for this sphere</p>
        </Link>
        <Link
          to="/gene-keys/spheres"
          className="flex-1 p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
        >
          <span className="text-lg">◎</span>
          <h4 className="font-medium mt-2">All Spheres</h4>
          <p className="text-sm text-theme-text-secondary mt-1">View all 13 spheres</p>
        </Link>
      </section>

      {/* Back Link */}
      <div className="text-center pt-4">
        <Link to="/gene-keys/spheres" className="text-theme-text-secondary hover:text-theme-text-primary transition-colors">
          &#8592; Back to Spheres
        </Link>
      </div>
    </div>
  );
}
export default GKSphereDetail;
