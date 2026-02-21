import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { geneKeys, chakras, getGateByDegree } from '../../data';
import { getCosmicWeather } from '../../services/transits';
import { exportUserData } from '../../services/dataExport';
import { elementColors, getSignData, getPlanetData, type ProfileTabProps } from './profileConstants';

export function ProfileHeader({ profile }: ProfileTabProps) {
  const navigate = useNavigate();
  const [exportSuccess, setExportSuccess] = useState(false);

  const { elementalAnalysis, chartRulers } = profile;

  // Rising sign (ASC)
  const ascendant = profile.housePositions.find(h => h.houseId === 'house-1');
  const risingSign = ascendant ? getSignData(ascendant.signId) : null;

  // Sprint A9: Cross-system synthesis data
  const allGateNumbers = new Set<number>([
    ...(profile.humanDesignProfile?.personalityGates?.map(g => g.gateNumber) ?? []),
    ...(profile.humanDesignProfile?.designGates?.map(g => g.gateNumber) ?? []),
  ]);

  const todayWeather = getCosmicWeather(new Date());
  const todayActivations = todayWeather.positions
    .map(pos => {
      const gr = getGateByDegree(pos.degree);
      if (!gr || !allGateNumbers.has(gr.gate.gateNumber)) return null;
      const chakra = Array.from(chakras.values()).find(c => c.relatedHDCenters.includes(gr.gate.centerId));
      return { pos, gate: gr.gate, line: gr.line, gk: gr.gate.geneKeyId ? geneKeys.get(gr.gate.geneKeyId) : undefined, chakra };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <>
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="font-serif text-4xl font-medium text-white">
            {profile.name}
          </h1>
          {profile.relationship && profile.relationship !== 'Me' && (
            <span className="px-2 py-1 bg-neutral-800 text-neutral-400 text-sm rounded">
              {profile.relationship}
            </span>
          )}
        </div>
        <p className="text-neutral-400">
          {new Date(profile.dateOfBirth).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          {profile.timeOfBirth && ` at ${profile.timeOfBirth}`}
        </p>
        <p className="text-neutral-500 text-sm mt-1">{profile.cityOfBirth}</p>
      </div>

      {/* Natal Chart */}
      <div className="flex justify-center">
        <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800 max-w-md">
          <h3 className="font-serif text-lg text-white mb-3 text-center">Natal Chart</h3>
          <img
            src="/images/astrology/Natal-Chart-Felipe-Fraga.png"
            alt="Natal Chart"
            className="w-full rounded-lg"
          />
        </div>
      </div>

      {/* Today in Your Chart */}
      {allGateNumbers.size > 0 && (
        <div className="bg-gradient-to-r from-purple-500/10 to-humandesign-500/10 rounded-xl p-5 border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-lg text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse inline-block"></span>
              Today in Your Chart
            </h2>
            <Link to="/transits" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
              All transits →
            </Link>
          </div>
          {todayActivations.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2">
                {todayActivations.map(({ pos, gate, line, gk, chakra }) => (
                  <Link
                    key={pos.planetId}
                    to={`/human-design/${gate.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800/80 hover:bg-neutral-800 border border-humandesign-500/30 rounded-full text-sm transition-colors"
                  >
                    <span className="text-xl leading-none">{pos.symbol}</span>
                    <span className="text-neutral-300">{pos.planetName}</span>
                    <span className="text-neutral-600">→</span>
                    <span className="text-humandesign-300 font-medium">Gate {gate.gateNumber}.{line}</span>
                    {gk && (
                      <span className="text-emerald-400/80 text-xs">· {gk.gift.name}</span>
                    )}
                    {chakra && (
                      <span style={{ color: chakra.colorHex }} className="text-sm ml-0.5" title={chakra.name}>{chakra.symbol}</span>
                    )}
                  </Link>
                ))}
              </div>
              <button
                onClick={() => navigate('/contemplate', {
                  state: {
                    seed: {
                      category: 'astrology',
                      contemplationType: 'transitOverview',
                    },
                  },
                })}
                className="mt-3 flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>✦</span>
                <span>Ask Oracle about today's activations →</span>
              </button>
            </>
          ) : (
            <p className="text-neutral-400 text-sm">
              No planets transiting your natal gates today.{' '}
              <Link to="/transits" className="text-purple-400 hover:text-purple-300 transition-colors">Explore all transits →</Link>
            </p>
          )}
        </div>
      )}

      {/* Key Signatures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rising Sign */}
        {risingSign && (
          <div className="bg-neutral-900/50 rounded-xl p-5 border border-neutral-800">
            <p className="text-neutral-400 text-sm mb-2">Rising Sign</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{risingSign.symbol}</span>
              <div>
                <p className="font-serif text-xl text-white">{risingSign.name}</p>
                <p className="text-neutral-500 text-sm">Ascendant</p>
              </div>
            </div>
          </div>
        )}

        {/* Chart Rulers */}
        <div className="bg-neutral-900/50 rounded-xl p-5 border border-neutral-800">
          <p className="text-neutral-400 text-sm mb-2">Chart Rulers</p>
          <div className="flex items-center gap-4">
            {chartRulers.traditional && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getPlanetData(chartRulers.traditional)?.symbol}</span>
                <div>
                  <p className="font-medium text-white">{getPlanetData(chartRulers.traditional)?.name}</p>
                  <p className="text-neutral-500 text-xs">Traditional</p>
                </div>
              </div>
            )}
            {chartRulers.modern && chartRulers.modern !== chartRulers.traditional && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getPlanetData(chartRulers.modern)?.symbol}</span>
                <div>
                  <p className="font-medium text-white">{getPlanetData(chartRulers.modern)?.name}</p>
                  <p className="text-neutral-500 text-xs">Modern</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dominant Element */}
        <div className="bg-neutral-900/50 rounded-xl p-5 border border-neutral-800">
          <p className="text-neutral-400 text-sm mb-2">Dominant Element</p>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${elementColors[elementalAnalysis.dominant as keyof typeof elementColors]?.bg || 'bg-neutral-700'} flex items-center justify-center`}>
              <span className="text-white text-lg">
                {elementalAnalysis.dominant === 'fire' && '🜂'}
                {elementalAnalysis.dominant === 'earth' && '🜃'}
                {elementalAnalysis.dominant === 'air' && '🜁'}
                {elementalAnalysis.dominant === 'water' && '🜄'}
              </span>
            </div>
            <div>
              <p className="font-serif text-xl text-white capitalize">{elementalAnalysis.dominant}</p>
              <p className="text-neutral-500 text-sm">{elementalAnalysis[elementalAnalysis.dominant as keyof typeof elementalAnalysis]} planets</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/contemplate', {
            state: {
              seed: {
                category: 'astrology',
                contemplationType: 'natalOverview',
              },
            },
          })}
          className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-colors text-left w-full"
        >
          <span className="text-2xl">✦</span>
          <div>
            <p className="font-medium text-white">Contemplate Your Chart</p>
            <p className="text-neutral-500 text-sm">Explore with AI wisdom guide</p>
          </div>
        </button>
        <Link
          to="/wheel"
          className="flex items-center gap-3 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-2xl">☉</span>
          <div>
            <p className="font-medium text-white">View Chart Wheel</p>
            <p className="text-neutral-500 text-sm">See your placements on the mandala</p>
          </div>
        </Link>
        <Link
          to="/graph"
          className="flex items-center gap-3 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-2xl">⚭</span>
          <div>
            <p className="font-medium text-white">Explore Relationships</p>
            <p className="text-neutral-500 text-sm">Discover cosmic connections</p>
          </div>
        </Link>
        <Link
          to="/elements"
          className="flex items-center gap-3 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-2xl">🜂</span>
          <div>
            <p className="font-medium text-white">Learn About Elements</p>
            <p className="text-neutral-500 text-sm">Deepen your elemental understanding</p>
          </div>
        </Link>
      </div>

      {/* Data Management */}
      <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl text-white mb-4">Data Management</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              exportUserData();
              setExportSuccess(true);
              setTimeout(() => setExportSuccess(false), 2000);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-neutral-200 rounded-lg hover:bg-neutral-700 transition-colors text-sm"
          >
            {exportSuccess ? (
              <>
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-400">Exported!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export My Data</span>
              </>
            )}
          </button>
          <p className="text-neutral-500 text-sm">
            Download all your profiles, insights, sessions, and pathway progress as JSON.
          </p>
        </div>
      </div>
    </>
  );
}
