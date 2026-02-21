import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getChannelsInOrder, getChannelsByCircuit, hdCenters, geneKeys } from '../data';
import type { HDCircuitType, HDChannel } from '../types';

const circuitTypes: HDCircuitType[] = ['Individual', 'Collective', 'Tribal', 'Integration'];

const circuitDescriptions: Record<HDCircuitType, string> = {
  'Individual': 'Mutation and uniqueness - designed to empower individuals to be different',
  'Collective': 'Sharing and logic/abstract patterns - designed to benefit the whole',
  'Tribal': 'Support and resources - designed to ensure survival and nurturing of the tribe',
  'Integration': 'Self-empowerment - designed to ensure individual survival and self-sufficiency',
};

export function HumanDesignChannels() {
  const allChannels = getChannelsInOrder();
  const [filterCircuit, setFilterCircuit] = useState<string>('all');

  const filteredChannels = filterCircuit === 'all'
    ? allChannels
    : getChannelsByCircuit(filterCircuit as HDCircuitType);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl text-humandesign-400">&#9473;</span>
          <h1 className="font-serif text-3xl font-medium">Human Design Channels</h1>
        </div>
        <p className="text-theme-text-secondary max-w-3xl">
          The 36 channels are pathways that connect the centers in your body graph. When both
          gates at either end of a channel are activated, the channel is defined, creating a
          fixed way of operating and consistent life themes. Channels are grouped into circuits
          that share similar themes and purposes.
        </p>
      </section>

      {/* Filter by Circuit */}
      <section className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCircuit('all')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filterCircuit === 'all'
              ? 'bg-humandesign-500 text-white'
              : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive'
          }`}
        >
          All Channels ({allChannels.length})
        </button>
        {circuitTypes.map(circuit => {
          const count = getChannelsByCircuit(circuit).length;
          return (
            <button
              key={circuit}
              onClick={() => setFilterCircuit(circuit)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filterCircuit === circuit
                  ? 'bg-humandesign-500 text-white'
                  : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive'
              }`}
            >
              {circuit} ({count})
            </button>
          );
        })}
      </section>

      {/* Circuit Description */}
      {filterCircuit !== 'all' && (
        <section className="bg-humandesign-500/10 rounded-lg p-4 border border-humandesign-500/20">
          <p className="text-humandesign-300 text-sm">
            <strong>{filterCircuit} Circuit:</strong> {circuitDescriptions[filterCircuit as HDCircuitType]}
          </p>
        </section>
      )}

      {/* Channels Grid */}
      <section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChannels.map(channel => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      </section>

      {/* Understanding Note */}
      <section className="bg-gradient-to-br from-humandesign-500/10 to-humandesign-600/5 rounded-xl p-6 border border-humandesign-500/20">
        <h3 className="font-serif text-lg mb-2 text-humandesign-300">Understanding Channels</h3>
        <p className="text-theme-text-secondary text-sm mb-4">
          A <strong className="text-humandesign-300">defined channel</strong> means both gates are activated
          in your chart, creating a consistent energy flow between the two connected centers. This gives you
          reliable access to this energy and makes it part of your identity.
        </p>
        <p className="text-theme-text-secondary text-sm">
          Channels are organized into <strong className="text-humandesign-300">circuits</strong>—larger
          groupings that share themes. The Individual Circuit is about mutation and uniqueness, the Collective
          Circuit is about sharing, and the Tribal Circuit is about support and resources.
        </p>
      </section>

      {/* Circuit Overview */}
      <section>
        <h2 className="font-serif text-2xl mb-4">Circuit Overview</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {circuitTypes.map(circuit => {
            const channels = getChannelsByCircuit(circuit);
            return (
              <div
                key={circuit}
                className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-lgtext-theme-text-primary">{circuit} Circuit</h3>
                  <span className="text-sm text-theme-text-tertiary">{channels.length} channels</span>
                </div>
                <p className="text-theme-text-secondary text-sm mb-3">{circuitDescriptions[circuit]}</p>
                <div className="flex flex-wrap gap-1">
                  {channels.slice(0, 6).map(ch => (
                    <span
                      key={ch.id}
                      className="text-xs text-humandesign-400 bg-surface-raised px-2 py-0.5 rounded"
                    >
                      {ch.gate1Number}-{ch.gate2Number}
                    </span>
                  ))}
                  {channels.length > 6 && (
                    <span className="text-xs text-theme-text-tertiary">+{channels.length - 6} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ChannelCard({ channel }: { channel: HDChannel }) {
  const center1 = hdCenters.get(channel.center1Id);
  const center2 = hdCenters.get(channel.center2Id);
  const gk1 = geneKeys.get(`gk-${channel.gate1Number}`);
  const gk2 = geneKeys.get(`gk-${channel.gate2Number}`);

  return (
    <Link
      to={`/human-design/channels/${channel.id}`}
      className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle hover:border-humandesign-500/50 hover:bg-surface-base transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl font-serif text-humandesign-400">
          {channel.gate1Number}-{channel.gate2Number}
        </span>
        <span className="text-xs text-theme-text-tertiary bg-surface-raised px-2 py-1 rounded">
          {channel.circuitType}
        </span>
      </div>

      <h3 className="font-serif text-lg text-theme-text-primary group-hover:text-humandesign-300 transition-colors mb-1">
        {channel.name}
      </h3>
      <p className="text-humandesign-400 text-sm mb-2">{channel.theme}</p>

      {/* Centers Connected */}
      <p className="text-theme-text-tertiary text-xs mb-3">
        {center1?.name.replace(' Center', '')} &#8594; {center2?.name.replace(' Center', '')}
      </p>

      {/* Keywords */}
      {channel.keywords && channel.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {channel.keywords.slice(0, 3).map((kw, i) => (
            <span key={i} className="text-xs text-theme-text-secondary bg-surface-raised px-2 py-0.5 rounded">
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Gene Key bridge */}
      {(gk1 || gk2) && (
        <div className="pt-2 border-t border-theme-border-subtle flex flex-col gap-0.5">
          {gk1 && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-genekey-500 w-5">{gk1.keyNumber}</span>
              <span className="text-red-400/60">{gk1.shadow.name}</span>
              <span className="text-theme-text-muted">→</span>
              <span className="text-emerald-400/70">{gk1.gift.name}</span>
            </div>
          )}
          {gk2 && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-genekey-500 w-5">{gk2.keyNumber}</span>
              <span className="text-red-400/60">{gk2.shadow.name}</span>
              <span className="text-theme-text-muted">→</span>
              <span className="text-emerald-400/70">{gk2.gift.name}</span>
            </div>
          )}
        </div>
      )}
    </Link>
  );
}
export default HumanDesignChannels;
