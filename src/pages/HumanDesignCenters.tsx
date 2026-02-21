import { Link, useNavigate } from 'react-router-dom';
import { getCentersInOrder, getCentersByType, getGatesByCenter, getChannelsForCenter, chakras } from '../data';
import { BodyGraphMini } from '../components/BodyGraph';
import type { HDCenter } from '../types';

const centerTypeOrder: HDCenter['centerType'][] = ['Pressure', 'Awareness', 'Motor', 'Identity', 'Communication'];

const centerTypeDescriptions: Record<HDCenter['centerType'], string> = {
  'Pressure': 'Create the drive and motivation to act',
  'Awareness': 'Provide insight and consciousness',
  'Motor': 'Generate power and energy for action',
  'Identity': 'Define sense of self and direction',
  'Communication': 'Express and manifest through words',
};

export function HumanDesignCenters() {
  const navigate = useNavigate();
  const allCenters = getCentersInOrder();

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl text-humandesign-400">&#9675;</span>
          <h1 className="font-serif text-3xl font-medium">Human Design Centers</h1>
        </div>
        <p className="text-theme-text-secondary max-w-3xl">
          The nine centers in Human Design evolved from the seven chakras. Each center governs
          specific aspects of life and can be either defined (colored/consistent) or undefined
          (white/receptive) in your chart. Understanding your centers reveals where you have
          consistent energy and where you're open to conditioning.
        </p>
      </section>

      {/* Stats & Mini Body Graph */}
      <section className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="flex flex-wrap gap-4 text-sm mb-6">
            <div className="bg-surface-base/50 rounded-lg px-4 py-2 border border-theme-border-subtle">
              <span className="text-humandesign-400 font-medium">{allCenters.length}</span>
              <span className="text-theme-text-tertiary ml-2">Centers</span>
            </div>
            <div className="bg-surface-base/50 rounded-lg px-4 py-2 border border-theme-border-subtle">
              <span className="text-humandesign-400 font-medium">64</span>
              <span className="text-theme-text-tertiary ml-2">Gates</span>
            </div>
            <div className="bg-surface-base/50 rounded-lg px-4 py-2 border border-theme-border-subtle">
              <span className="text-humandesign-400 font-medium">36</span>
              <span className="text-theme-text-tertiary ml-2">Channels</span>
            </div>
          </div>

          {/* Center Type Summary */}
          <div className="space-y-3">
            {centerTypeOrder.map(type => {
              const centersOfType = getCentersByType(type);
              return (
                <div key={type} className="flex items-center gap-3 text-sm">
                  <span className="w-28 text-theme-text-tertiary">{type}:</span>
                  <span className="text-humandesign-300">
                    {centersOfType.map(c => c.name.replace(' Center', '')).join(', ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mini Body Graph */}
        <div className="lg:w-64">
          <div className="bg-surface-base/50 rounded-xl p-4 border border-theme-border-subtle">
            <h3 className="text-xs text-theme-text-tertiary text-center mb-3">Click a center</h3>
            <BodyGraphMini
              onCenterClick={(centerId) => navigate(`/human-design/centers/${centerId}`)}
              interactive={true}
            />
          </div>
        </div>
      </section>

      {/* Centers By Type */}
      {centerTypeOrder.map(type => {
        const centersOfType = getCentersByType(type);
        if (centersOfType.length === 0) return null;

        return (
          <section key={type}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl text-humandesign-400">&#9702;</span>
              <h2 className="font-serif text-xl">{type} Centers</h2>
            </div>
            <p className="text-theme-text-tertiary text-sm mb-4">{centerTypeDescriptions[type]}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {centersOfType.map(center => (
                <CenterCard key={center.id} center={center} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Understanding Note */}
      <section className="bg-gradient-to-br from-humandesign-500/10 to-humandesign-600/5 rounded-xl p-6 border border-humandesign-500/20">
        <h3 className="font-serif text-lg mb-2 text-humandesign-300">Defined vs Undefined</h3>
        <p className="text-theme-text-secondary text-sm mb-4">
          A <strong className="text-humandesign-300">defined center</strong> (colored in your chart) means you have
          consistent, reliable access to that energy. You're not easily influenced by others in this area—you are
          the one who influences.
        </p>
        <p className="text-theme-text-secondary text-sm">
          An <strong className="text-humandesign-300">undefined center</strong> (white in your chart) means you're
          open and receptive in this area. You take in and amplify the energy of others, which gives you wisdom
          about this aspect of life—but can also lead to conditioning if you're not aware.
        </p>
      </section>
    </div>
  );
}

function CenterCard({ center }: { center: HDCenter }) {
  const gateCount = getGatesByCenter(center.id).length;
  const channelCount = getChannelsForCenter(center.id).length;
  const relatedChakra = Array.from(chakras.values()).find(c => c.relatedHDCenters.includes(center.id));

  return (
    <Link
      to={`/human-design/centers/${center.id}`}
      className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle hover:border-humandesign-500/50 hover:bg-surface-base transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-serif text-lg text-theme-text-primary group-hover:text-humandesign-300 transition-colors">
            {center.name}
          </h3>
          <p className="text-humandesign-400 text-sm">{center.centerType}</p>
        </div>
        <span className="text-2xl">{center.symbol}</span>
      </div>

      <p className="text-theme-text-tertiary text-sm mb-3">{center.biologicalCorrelate}</p>

      <div className="flex items-center justify-between text-xs">
        <div className="flex gap-4">
          <span className="text-theme-text-secondary">
            <span className="text-humandesign-400">{gateCount}</span> gates
          </span>
          <span className="text-theme-text-secondary">
            <span className="text-humandesign-400">{channelCount}</span> channels
          </span>
        </div>
        {relatedChakra && (
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
            style={{ backgroundColor: relatedChakra.colorHex + '22', color: relatedChakra.colorHex }}
          >
            {relatedChakra.symbol} {relatedChakra.name}
          </span>
        )}
      </div>
    </Link>
  );
}
export default HumanDesignCenters;
