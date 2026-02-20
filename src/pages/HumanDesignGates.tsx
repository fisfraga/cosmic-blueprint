import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getGatesInOrder, getCentersInOrder, getGatesByCenter, hdCenters, signs, geneKeys } from '../data';
import { BodyGraphResponsive } from '../components/BodyGraph';
import type { HDGate, HDCenter } from '../types';

export function HumanDesignGates() {
  const navigate = useNavigate();
  const allGates = getGatesInOrder();
  const centers = getCentersInOrder();
  const [filterCenter, setFilterCenter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'bodyGraph' | 'byCenter' | 'grid'>('bodyGraph');

  const filteredGates = filterCenter === 'all'
    ? allGates
    : getGatesByCenter(filterCenter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl text-humandesign-400">&#9672;</span>
          <h1 className="font-serif text-3xl font-medium">Human Design Gates</h1>
        </div>
        <p className="text-neutral-400 max-w-3xl">
          The 64 Gates of Human Design correspond to the 64 hexagrams of the I Ching and the 64 codons
          of our DNA. Each gate represents a specific archetypal energy that manifests through
          one of the nine energy centers, expressing the unique way you're designed to operate.
        </p>
      </section>

      {/* View Toggle & Filters */}
      <section className="flex flex-wrap items-center gap-4">
        {/* View Mode */}
        <div className="flex rounded-lg overflow-hidden border border-neutral-700">
          <button
            onClick={() => setViewMode('bodyGraph')}
            className={`px-4 py-2 text-sm transition-colors ${
              viewMode === 'bodyGraph'
                ? 'bg-humandesign-500 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            Body Graph
          </button>
          <button
            onClick={() => setViewMode('byCenter')}
            className={`px-4 py-2 text-sm transition-colors ${
              viewMode === 'byCenter'
                ? 'bg-humandesign-500 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            By Center
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 text-sm transition-colors ${
              viewMode === 'grid'
                ? 'bg-humandesign-500 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            Grid View
          </button>
        </div>

        {/* Center Filter (only in grid view) */}
        {viewMode === 'grid' && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCenter('all')}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                filterCenter === 'all'
                  ? 'bg-humandesign-500 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              All Gates ({allGates.length})
            </button>
            {centers.map(center => {
              const gateCount = getGatesByCenter(center.id).length;
              return (
                <button
                  key={center.id}
                  onClick={() => setFilterCenter(center.id)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    filterCenter === center.id
                      ? 'bg-humandesign-500 text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  {center.name} ({gateCount})
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Content */}
      {viewMode === 'bodyGraph' ? (
        <section className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Body Graph Visualization */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="bg-neutral-900/50 rounded-xl p-4 sm:p-6 border border-neutral-800 w-full max-w-md">
              <h3 className="font-serif text-lg mb-4 text-center text-humandesign-300">
                Interactive Body Graph
              </h3>
              <BodyGraphResponsive
                interactive={true}
                onCenterClick={(centerId) => navigate(`/human-design/centers/${centerId}`)}
              />
              <p className="text-xs text-neutral-500 text-center mt-4">
                Click on centers to explore. Hover for tooltips.
              </p>
            </div>
          </div>
          {/* Centers Overview in Body Graph view */}
          <div className="lg:w-1/2 space-y-4">
            <h3 className="font-serif text-xl text-humandesign-300">The Nine Centers</h3>
            <p className="text-neutral-400 text-sm mb-4">
              The body graph shows how energy flows through nine centers, connected by 36 channels
              that are formed when both gates on either end are activated.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {centers.map(center => {
                const gateCount = getGatesByCenter(center.id).length;
                return (
                  <div
                    key={center.id}
                    className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700 hover:border-humandesign-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">{center.name}</h4>
                        <p className="text-xs text-humandesign-400">{center.centerType} Center</p>
                      </div>
                      <span className="text-xs text-neutral-500 bg-neutral-700 px-2 py-1 rounded">
                        {gateCount} gates
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : viewMode === 'byCenter' ? (
        <div className="space-y-8">
          {centers.map(center => {
            const centerGates = getGatesByCenter(center.id);
            if (centerGates.length === 0) return null;
            return (
              <CenterSection key={center.id} center={center} gates={centerGates} />
            );
          })}
        </div>
      ) : (
        <section>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredGates.map((gate) => (
              <GateCard key={gate.id} gate={gate} />
            ))}
          </div>
        </section>
      )}

      {/* Understanding Note */}
      <section className="bg-gradient-to-br from-humandesign-500/10 to-humandesign-600/5 rounded-xl p-6 border border-humandesign-500/20">
        <h3 className="font-serif text-lg mb-2 text-humandesign-300">Understanding the Gates</h3>
        <p className="text-neutral-400 text-sm mb-4">
          In Human Design, gates are the doorways through which life force energy flows. When a gate
          is activated in your chart (by a planet at birth), that archetypal energy becomes a consistent
          part of your design. Gates connect to form <strong className="text-humandesign-300">channels</strong>—when
          both gates on either end of a channel are activated, the channel is defined, creating
          a fixed way of operating.
        </p>
        <p className="text-neutral-400 text-sm">
          Each gate has a <strong className="text-humandesign-300">high expression</strong> (when energy flows
          correctly) and a <strong className="text-humandesign-300">low expression</strong> (when operating from
          the not-self). Understanding your gates helps you recognize your natural gifts and potential shadow patterns.
        </p>
      </section>

      {/* Centers Overview */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl text-humandesign-400">&#9711;</span>
          <h2 className="font-serif text-2xl font-medium">The Nine Centers</h2>
        </div>
        <p className="text-neutral-400 max-w-3xl mb-6">
          The nine centers are energy hubs in the body graph, evolved from the seven chakras.
          Each center governs specific aspects of life and can be either defined (colored/consistent)
          or undefined (white/receptive) in your chart.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {centers.map(center => (
            <div
              key={center.id}
              className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800"
            >
              <h4 className="font-serif text-lg text-white mb-1">{center.name}</h4>
              <p className="text-humandesign-400 text-sm mb-2">{center.centerType} Center</p>
              <p className="text-neutral-400 text-sm line-clamp-2">{center.biologicalCorrelate}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CenterSection({ center, gates }: { center: HDCenter; gates: HDGate[] }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-humandesign-500/20 flex items-center justify-center text-humandesign-400">
          {center.name.charAt(0)}
        </div>
        <div>
          <h2 className="font-serif text-xl text-white">{center.name} Center</h2>
          <p className="text-neutral-500 text-sm">{center.centerType} • {gates.length} Gates</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {gates.map(gate => (
          <GateCard key={gate.id} gate={gate} />
        ))}
      </div>
    </section>
  );
}

function GateCard({ gate }: { gate: HDGate }) {
  const zodiacSign = gate.tropicalSignId ? signs.get(gate.tropicalSignId) : undefined;
  const center = gate.centerId ? hdCenters.get(gate.centerId) : undefined;
  const gk = gate.geneKeyId ? geneKeys.get(gate.geneKeyId) : undefined;

  return (
    <Link
      to={`/human-design/${gate.id}`}
      className="bg-neutral-900/50 rounded-xl p-5 border border-neutral-800 hover:border-humandesign-500/50 hover:bg-neutral-900 transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl font-serif text-humandesign-400">{gate.gateNumber}</span>
        <div className="flex items-center gap-2">
          {zodiacSign && (
            <span className="text-lg" title={zodiacSign.name}>{zodiacSign.symbol}</span>
          )}
          {center && (
            <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded">
              {center.name}
            </span>
          )}
        </div>
      </div>

      <h3 className="font-serif text-lg text-white group-hover:text-humandesign-300 transition-colors mb-1">
        {gate.name}
      </h3>
      <p className="text-neutral-400 text-sm mb-2">{gate.iChingName}</p>

      {gate.coreTheme && (
        <p className="text-humandesign-400/80 text-sm line-clamp-2">{gate.coreTheme}</p>
      )}

      {gate.keywords && gate.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {gate.keywords.slice(0, 3).map((keyword, i) => (
            <span key={i} className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
              {keyword}
            </span>
          ))}
        </div>
      )}

      {/* Gene Key bridge */}
      {gk && (
        <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center gap-2">
          <span className="text-xs text-genekey-500">GK</span>
          <span className="text-xs font-serif text-genekey-400">{gk.keyNumber}</span>
          <span className="text-neutral-700">·</span>
          <span className="text-xs text-red-400/60">{gk.shadow.name}</span>
          <span className="text-neutral-700">→</span>
          <span className="text-xs text-emerald-400/60">{gk.gift.name}</span>
        </div>
      )}
    </Link>
  );
}
export default HumanDesignGates;
