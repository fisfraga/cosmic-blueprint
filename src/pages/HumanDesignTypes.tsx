import { getHDTypes, getStrategyForType } from '../data';
import { EntityCard } from '../components';
import { Link } from 'react-router-dom';

export function HumanDesignTypes() {
  const hdTypes = getHDTypes();

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">◉</span>
          <h1 className="font-serif text-3xl font-medium">Human Design Types</h1>
        </div>
        <p className="text-neutral-400 max-w-3xl">
          There are five distinct Human Design Types, each with a unique aura, strategy, and role
          in the collective. Your Type is the foundation of your design—it determines how you're
          designed to engage with life and make decisions correctly.
        </p>
      </section>

      {/* Types Grid */}
      <section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hdTypes.map((hdType) => (
            <EntityCard key={hdType.id} entity={hdType} />
          ))}
        </div>
      </section>

      {/* Type Overview */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h3 className="font-serif text-lg mb-4">Understanding Your Type</h3>
        <div className="space-y-4 text-sm">
          {hdTypes.map((hdType) => {
            const strategy = getStrategyForType(hdType.id);
            return (
              <div key={hdType.id} className="flex gap-4 items-start">
                <div className="w-16 text-center">
                  <span className="text-2xl">{hdType.symbol}</span>
                  <p className="text-xs text-neutral-500 mt-1">{hdType.percentage}</p>
                </div>
                <div className="flex-1">
                  <Link
                    to={`/human-design/types/${hdType.id}`}
                    className="font-medium text-neutral-200 hover:text-white transition-colors"
                  >
                    {hdType.name}
                  </Link>
                  <p className="text-neutral-400 mt-1">{hdType.role}</p>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-neutral-500">
                      Strategy: <span className="text-neutral-300">{strategy?.name}</span>
                    </span>
                    <span className="text-neutral-500">
                      Signature: <span className="text-green-400">{hdType.signatureEmotion}</span>
                    </span>
                    <span className="text-neutral-500">
                      Not-Self: <span className="text-red-400">{hdType.notSelfEmotion}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Energy Types vs. Non-Energy Types */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h3 className="font-serif text-lg mb-4">Energy Types vs. Non-Energy Types</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-amber-400 mb-2">Energy Types (Sacral Beings)</h4>
            <p className="text-neutral-400 mb-3">
              Generators and Manifesting Generators have a defined Sacral Center, giving them
              consistent access to life force energy for work. They make up approximately 70%
              of the population.
            </p>
            <ul className="space-y-1 text-neutral-400">
              <li>• Sustainable energy for work they love</li>
              <li>• Strategy: Wait to Respond</li>
              <li>• Need to be active and use their energy</li>
              <li>• Go to sleep when exhausted, wake up regenerated</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-400 mb-2">Non-Energy Types</h4>
            <p className="text-neutral-400 mb-3">
              Projectors, Manifestors, and Reflectors don't have consistent Sacral energy.
              They have different rhythms and capacities, and aren't designed to work in
              the same way as Generators.
            </p>
            <ul className="space-y-1 text-neutral-400">
              <li>• Variable energy levels</li>
              <li>• Need more rest and alone time</li>
              <li>• Different relationship to work</li>
              <li>• Must manage energy carefully</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="flex gap-4">
        <Link
          to="/human-design/authorities"
          className="flex-1 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-lg">⌖</span>
          <h4 className="font-medium mt-2">Authorities</h4>
          <p className="text-sm text-neutral-400 mt-1">Learn about decision-making authorities</p>
        </Link>
        <Link
          to="/human-design/centers"
          className="flex-1 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-lg">⚬</span>
          <h4 className="font-medium mt-2">Centers</h4>
          <p className="text-sm text-neutral-400 mt-1">Explore the nine energy centers</p>
        </Link>
      </section>
    </div>
  );
}
export default HumanDesignTypes;
