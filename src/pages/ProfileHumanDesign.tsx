import { useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfile } from '../context';
import { hdGates, hdCenters, hdChannels, geneKeys, hdLines, codonRings } from '../data';
import { LoadingSkeleton, ProfileRequiredState } from '../components';
import { BodyGraphCentersOnly } from '../components/BodyGraph';
import { NeutrinoWidget } from '../components/NeutrinoWidget';
import { isNeutrinoConfigured } from '../config/neutrino';
import { EntityStack, EntityLink } from '../components/entities';
import type { EntityInfo } from '../services/entities';

export function ProfileHumanDesign() {
  const { profile, isLoading, hasProfile } = useProfile();
  const [chartSource, setChartSource] = useState<'builtin' | 'neutrino'>('builtin');
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);
  const neutrinoConfigured = isNeutrinoConfigured();
  const [selectedEntities, setSelectedEntities] = useState<EntityInfo[]>([]);

  const handleEntityClick = useCallback((entity: EntityInfo) => {
    setSelectedEntities(prev => {
      if (prev.some(e => e.id === entity.id)) return prev;
      if (prev.length < 2) return [...prev, entity];
      return [prev[1], entity];
    });
  }, []);

  const handleCloseEntity = useCallback((entityId: string) => {
    setSelectedEntities(prev => prev.filter(e => e.id !== entityId));
  }, []);

  // Get selected center data for entity panel
  const selectedCenter = selectedCenterId ? hdCenters.get(selectedCenterId) : null;

  // Calculate channels from gates
  const definedChannels = useMemo(() => {
    if (!profile?.humanDesignProfile) return [];

    const allGates = [
      ...(profile.humanDesignProfile.personalityGates || []),
      ...(profile.humanDesignProfile.designGates || []),
    ];

    const gateNumbers = new Set(allGates.map(g => g.gateNumber));
    const channels: Array<{ id: string; channel: typeof hdChannels extends Map<string, infer V> ? V : never }> = [];

    hdChannels.forEach((channel, id) => {
      if (channel.gate1Number && channel.gate2Number &&
          gateNumbers.has(channel.gate1Number) && gateNumbers.has(channel.gate2Number)) {
        channels.push({ id, channel });
      }
    });

    return channels;
  }, [profile]);

  if (isLoading) {
    return <LoadingSkeleton variant="profile" />;
  }

  if (!hasProfile || !profile) {
    return (
      <ProfileRequiredState
        title="Human Design Profile"
        description="Create your profile to explore your Human Design chart and body graph."
      />
    );
  }

  const hdProfile = profile.humanDesignProfile;
  if (!hdProfile) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Human Design Profile Not Available</h1>
        <p className="text-theme-text-secondary mb-4">Human Design data is not yet calculated for this profile.</p>
        <Link to="/profile" className="text-amber-400 hover:underline">Back to Profile</Link>
      </div>
    );
  }

  // All 9 centers
  const allCenters = [
    'head-center', 'ajna-center', 'throat-center', 'g-center', 'heart-center',
    'sacral-center', 'spleen-center', 'solar-plexus-center', 'root-center'
  ];
  const definedCenterIds = new Set(hdProfile.definedCenterIds || []);

  // Parse profile lines
  const profileParts = hdProfile.profile?.split('/') || ['5', '1'];
  const personalityLine = parseInt(profileParts[0]);
  const designLine = parseInt(profileParts[1]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full"
    >
    <div className="flex-1 min-w-0 overflow-y-auto">
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/profile" className="text-theme-text-secondary hover:text-theme-text-primary text-sm mb-2 inline-block">
            ← Back to Overview
          </Link>
          <h1 className="font-serif text-3xl text-theme-text-primary flex items-center gap-3">
            <span className="text-amber-400">⬡</span>
            Human Design Profile
          </h1>
          <p className="text-theme-text-secondary mt-1">{profile.name}'s Body Graph Blueprint</p>
        </div>
        <Link
          to="/contemplate"
          className="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30 transition-colors text-sm"
        >
          Contemplate Human Design
        </Link>
      </div>

      {/* Body Graph Visualization */}
      <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xltext-theme-text-primary">Your Body Graph</h2>
          {/* Chart Source Toggle */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setChartSource('builtin')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                chartSource === 'builtin'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'text-theme-text-secondary hover:text-theme-text-primary'
              }`}
            >
              Built-in
            </button>
            <button
              onClick={() => setChartSource('neutrino')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                chartSource === 'neutrino'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'text-theme-text-secondary hover:text-theme-text-primary'
              }`}
            >
              Neutrino
              {!neutrinoConfigured && (
                <span className="ml-1 text-theme-text-tertiary text-xs">(Setup)</span>
              )}
            </button>
          </div>
        </div>

        {/* Built-in Body Graph - Centers Only */}
        {chartSource === 'builtin' && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Body Graph */}
            <div className="flex-1 flex justify-center">
              <BodyGraphCentersOnly
                width={320}
                height={420}
                definedCenters={hdProfile.definedCenterIds || []}
                selectedCenterId={selectedCenterId}
                onCenterClick={(id) => setSelectedCenterId(id === selectedCenterId ? null : id)}
              />
            </div>

            {/* Entity Panel (when center selected) */}
            {selectedCenter && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:w-80 bg-surface-overlay rounded-lg p-4 border border-theme-border-subtle"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-mediumtext-theme-text-primary">{selectedCenter.name}</h3>
                  <button
                    onClick={() => setSelectedCenterId(null)}
                    className="text-theme-text-secondary hover:text-theme-text-primary text-xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className={`inline-block px-2 py-0.5 rounded text-xs mb-3 ${
                  definedCenterIds.has(selectedCenter.id)
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-surface-interactive text-theme-text-secondary'
                }`}>
                  {definedCenterIds.has(selectedCenter.id) ? 'Defined' : 'Open/Undefined'}
                </div>

                <p className="text-sm text-theme-text-secondary mb-4">
                  {definedCenterIds.has(selectedCenter.id)
                    ? selectedCenter.definedMeaning
                    : selectedCenter.undefinedMeaning}
                </p>

                {selectedCenter.biologicalCorrelate && (
                  <div className="mb-4">
                    <p className="text-xs text-theme-text-tertiary mb-1">Biological Correlate</p>
                    <p className="text-sm text-theme-text-secondary">{selectedCenter.biologicalCorrelate}</p>
                  </div>
                )}

                <Link
                  to={`/human-design/centers/${selectedCenter.id}`}
                  className="text-amber-400 hover:text-amber-300 text-sm inline-flex items-center gap-1"
                >
                  Learn more about {selectedCenter.name} →
                </Link>
              </motion.div>
            )}

            {/* Hint when no center selected */}
            {!selectedCenter && (
              <div className="lg:w-80 flex items-center justify-center text-theme-text-tertiary text-sm text-center p-4">
                <p>Click on a center to see its meaning in your design</p>
              </div>
            )}
          </div>
        )}

        {/* Neutrino Platform Widget */}
        {chartSource === 'neutrino' && (
          <NeutrinoWidget
            type="chart"
            height={450}
            birthData={{
              date: profile.dateOfBirth,
              time: profile.timeOfBirth,
              latitude: profile.coordinates?.latitude,
              longitude: profile.coordinates?.longitude,
              timezone: profile.coordinates?.timezone,
              city: profile.cityOfBirth,
            }}
          />
        )}
      </div>

      {/* Core Mechanics */}
      <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-xl p-6 border border-amber-500/20">
        <h2 className="font-serif text-xl text-theme-text-primary mb-4">Core Mechanics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/human-design/types" className="bg-surface-base/50 rounded-lg p-4 hover:bg-surface-overlay transition-colors">
            <p className="text-theme-text-secondary text-xs mb-1">Type</p>
            <p className="text-amber-300 font-medium text-xl">{hdProfile.type}</p>
            <p className="text-theme-text-tertiary text-xs mt-1">Your energy blueprint</p>
          </Link>
          <div className="bg-surface-base/50 rounded-lg p-4">
            <p className="text-theme-text-secondary text-xs mb-1">Strategy</p>
            <p className="text-amber-300 font-medium">{hdProfile.strategy}</p>
            <p className="text-theme-text-tertiary text-xs mt-1">How to engage life</p>
          </div>
          <Link to="/human-design/authorities" className="bg-surface-base/50 rounded-lg p-4 hover:bg-surface-overlay transition-colors">
            <p className="text-theme-text-secondary text-xs mb-1">Authority</p>
            <p className="text-amber-300 font-medium">{hdProfile.authority}</p>
            <p className="text-theme-text-tertiary text-xs mt-1">Decision-making</p>
          </Link>
          <Link to="/human-design/profiles" className="bg-surface-base/50 rounded-lg p-4 hover:bg-surface-overlay transition-colors">
            <p className="text-theme-text-secondary text-xs mb-1">Profile</p>
            <p className="text-amber-300 font-medium text-xl">{hdProfile.profile}</p>
            <p className="text-theme-text-tertiary text-xs mt-1">Life archetype</p>
          </Link>
        </div>
      </div>

      {/* Profile Lines Detail */}
      <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h2 className="font-serif text-xl text-theme-text-primary mb-4">Profile Lines: {hdProfile.profile}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-amber-500/5 rounded-lg p-4 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 bg-amber-500/20 text-amber-300 rounded-full flex items-center justify-center font-medium">
                {personalityLine}
              </span>
              <div>
                <p className="text-amber-300 font-medium">Personality Line (Conscious)</p>
                <p className="text-theme-text-secondary text-xs">How you see yourself</p>
              </div>
            </div>
            {hdLines.get(`hd-line-${personalityLine}`) && (
              <div className="mt-3">
                <p className="text-theme-text-primary">{hdLines.get(`hd-line-${personalityLine}`)?.name}</p>
                <p className="text-theme-text-secondary text-sm mt-1">
                  {hdLines.get(`hd-line-${personalityLine}`)?.description?.slice(0, 150)}...
                </p>
              </div>
            )}
          </div>
          <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 bg-red-500/20 text-red-300 rounded-full flex items-center justify-center font-medium">
                {designLine}
              </span>
              <div>
                <p className="text-red-300 font-medium">Design Line (Unconscious)</p>
                <p className="text-theme-text-secondary text-xs">How others see you</p>
              </div>
            </div>
            {hdLines.get(`hd-line-${designLine}`) && (
              <div className="mt-3">
                <p className="text-theme-text-primary">{hdLines.get(`hd-line-${designLine}`)?.name}</p>
                <p className="text-theme-text-secondary text-sm mt-1">
                  {hdLines.get(`hd-line-${designLine}`)?.description?.slice(0, 150)}...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Incarnation Cross & Definition */}
      <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-theme-text-secondary text-sm mb-2">Incarnation Cross</h3>
            <p className="text-theme-text-primary font-medium text-lg">{hdProfile.incarnationCross}</p>
            <p className="text-theme-text-tertiary text-sm mt-2">
              Your incarnation cross represents your life purpose and the theme that runs through your existence.
              It's formed by your conscious and unconscious Sun and Earth gates.
            </p>
          </div>
          <div>
            <h3 className="text-theme-text-secondary text-sm mb-2">Definition</h3>
            <p className="text-theme-text-primary font-medium text-lg">{hdProfile.definition}</p>
            <p className="text-theme-text-tertiary text-sm mt-2">
              {hdProfile.definition === 'Quadruple Split' &&
                'Four separate areas of definition that require different experiences to connect. You process information in unique ways and need time to integrate.'}
              {hdProfile.definition === 'Triple Split' &&
                'Three separate areas of definition that come together through different life experiences.'}
              {hdProfile.definition === 'Split' &&
                'Two separate areas of definition that can bridge through specific gates or through other people.'}
              {hdProfile.definition === 'Single' &&
                'All defined centers are connected in one continuous flow of energy.'}
              {hdProfile.definition === 'No Definition' &&
                'No defined centers, making you a pure Reflector who samples all energies.'}
            </p>
          </div>
        </div>
      </div>

      {/* Centers Grid */}
      <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h2 className="font-serif text-xl text-theme-text-primary mb-4">
          Centers ({hdProfile.definedCenterIds?.length || 0} Defined / {9 - (hdProfile.definedCenterIds?.length || 0)} Open)
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {allCenters.map(centerId => {
            const center = hdCenters.get(centerId);
            const isDefined = definedCenterIds.has(centerId);

            return center ? (
              <Link
                key={centerId}
                to={`/human-design/centers/${centerId}`}
                className={`rounded-lg p-4 text-center transition-colors ${
                  isDefined
                    ? 'bg-amber-500/20 border border-amber-500/30 hover:bg-amber-500/30'
                    : 'bg-surface-raised/30 border border-theme-border-subtle hover:bg-surface-overlay'
                }`}
              >
                <p className={`font-medium ${isDefined ? 'text-amber-300' : 'text-theme-text-secondary'}`}>
                  {center.name.replace(' Center', '')}
                </p>
                <p className={`text-xs mt-1 ${isDefined ? 'text-amber-400/70' : 'text-theme-text-tertiary'}`}>
                  {isDefined ? 'Defined' : 'Open'}
                </p>
              </Link>
            ) : null;
          })}
        </div>
        <p className="text-theme-text-tertiary text-xs mt-4">
          Defined centers represent consistent, reliable energy. Open centers are where you experience and amplify the energy of others.
        </p>
      </div>

      {/* Defined Channels */}
      {definedChannels.length > 0 && (
        <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xltext-theme-text-primary">Defined Channels ({definedChannels.length})</h2>
            <Link to="/human-design/channels" className="text-amber-400 hover:text-amber-300 text-sm">
              View All Channels →
            </Link>
          </div>
          <div className="space-y-3">
            {definedChannels.map(({ id, channel }) => (
              <div
                key={id}
                className="p-4 bg-surface-overlay rounded-lg hover:bg-surface-interactive/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <EntityLink
                        entityId={id}
                        displayName={channel.name}
                        onClick={handleEntityClick}
                        className="font-medium"
                      />
                      <Link
                        to={`/profile/human-design/channels/${channel.gate1Number}-${channel.gate2Number}`}
                        className="text-xs text-theme-text-muted hover:text-amber-300 transition-colors"
                        title="Full channel detail"
                        onClick={(e) => e.stopPropagation()}
                      >
                        →
                      </Link>
                    </div>
                    <p className="text-amber-400 text-sm mt-0.5">
                      Gate {channel.gate1Number} — Gate {channel.gate2Number}
                    </p>
                  </div>
                  <span className="text-theme-text-tertiary text-xs">
                    {channel.circuitType?.replace('-circuit', '')}
                  </span>
                </div>
                {channel.description && (
                  <p className="text-theme-text-secondary text-sm mt-2">
                    {channel.description.slice(0, 120)}...
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Gates */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personality Gates */}
        <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-lg text-theme-text-primary mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
            Personality Gates (Conscious)
          </h2>
          <div className="space-y-2">
            {hdProfile.personalityGates?.map((gate, index) => {
              const gateData = hdGates.get(gate.gateId);
              const gk = geneKeys.get(`gene-key-${gate.gateNumber}`);
              const center = gateData?.centerId ? hdCenters.get(gateData.centerId) : null;
              const ring = gk?.codonRingId ? codonRings.get(gk.codonRingId) : null;

              return (
                <div
                  key={`${gate.gateId}-${index}`}
                  className="p-3 bg-surface-overlay hover:bg-surface-interactive/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-medium">{gate.gateNumber}.{gate.line}</span>
                      {gateData && (
                        <EntityLink
                          entityId={gate.gateId}
                          displayName={gateData.name}
                          onClick={handleEntityClick}
                        />
                      )}
                      <Link
                        to={`/profile/human-design/gates/${gate.gateNumber}`}
                        className="text-xs text-theme-text-muted hover:text-amber-300 transition-colors"
                        title="Full gate detail"
                        onClick={(e) => e.stopPropagation()}
                      >
                        →
                      </Link>
                    </div>
                    <span className="text-theme-text-muted text-xs">{gate.planet}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs flex-wrap">
                    {center && <span className="text-theme-text-tertiary">{center.name}</span>}
                    {gk && (
                      <span className="text-genekey-400">
                        <span className="text-red-400/70">{gk.shadow?.name}</span>
                        {' → '}
                        <span className="text-emerald-400/70">{gk.gift?.name}</span>
                        {' → '}
                        <span className="text-purple-400/70">{gk.siddhi?.name}</span>
                      </span>
                    )}
                    {ring && (
                      <span className="text-genekey-500/70 bg-genekey-500/10 px-1.5 py-0.5 rounded">
                        ⬡ {ring.name}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Design Gates */}
        <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-lg text-theme-text-primary mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-400 rounded-full"></span>
            Design Gates (Unconscious)
          </h2>
          <div className="space-y-2">
            {hdProfile.designGates?.map((gate, index) => {
              const gateData = hdGates.get(gate.gateId);
              const gk = geneKeys.get(`gene-key-${gate.gateNumber}`);
              const center = gateData?.centerId ? hdCenters.get(gateData.centerId) : null;
              const ring = gk?.codonRingId ? codonRings.get(gk.codonRingId) : null;

              return (
                <div
                  key={`${gate.gateId}-${index}`}
                  className="p-3 bg-surface-overlay hover:bg-surface-interactive/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 font-medium">{gate.gateNumber}.{gate.line}</span>
                      {gateData && (
                        <EntityLink
                          entityId={gate.gateId}
                          displayName={gateData.name}
                          onClick={handleEntityClick}
                        />
                      )}
                      <Link
                        to={`/profile/human-design/gates/${gate.gateNumber}`}
                        className="text-xs text-theme-text-muted hover:text-amber-300 transition-colors"
                        title="Full gate detail"
                        onClick={(e) => e.stopPropagation()}
                      >
                        →
                      </Link>
                    </div>
                    <span className="text-theme-text-muted text-xs">{gate.planet}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs flex-wrap">
                    {center && <span className="text-theme-text-tertiary">{center.name}</span>}
                    {gk && (
                      <span className="text-genekey-400">
                        <span className="text-red-400/70">{gk.shadow?.name}</span>
                        {' → '}
                        <span className="text-emerald-400/70">{gk.gift?.name}</span>
                        {' → '}
                        <span className="text-purple-400/70">{gk.siddhi?.name}</span>
                      </span>
                    )}
                    {ring && (
                      <span className="text-genekey-500/70 bg-genekey-500/10 px-1.5 py-0.5 rounded">
                        ⬡ {ring.name}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Variables (Arrows) - Placeholder */}
      <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xltext-theme-text-primary">Variables (Arrows)</h2>
          <Link to="/human-design/variables" className="text-amber-400 hover:text-amber-300 text-sm">
            Learn About Variables →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-overlay rounded-lg p-4">
            <p className="text-theme-text-secondary text-xs mb-1">Digestion</p>
            <p className="text-theme-text-primary font-medium">Environment</p>
            <p className="text-theme-text-tertiary text-xs mt-1">How you take in nourishment</p>
          </div>
          <div className="bg-surface-overlay rounded-lg p-4">
            <p className="text-theme-text-secondary text-xs mb-1">Environment</p>
            <p className="text-theme-text-primary font-medium">Determination</p>
            <p className="text-theme-text-tertiary text-xs mt-1">Where you thrive</p>
          </div>
          <div className="bg-surface-overlay rounded-lg p-4">
            <p className="text-theme-text-secondary text-xs mb-1">Perspective</p>
            <p className="text-theme-text-primary font-medium">Motivation</p>
            <p className="text-theme-text-tertiary text-xs mt-1">How you see the world</p>
          </div>
          <div className="bg-surface-overlay rounded-lg p-4">
            <p className="text-theme-text-secondary text-xs mb-1">Awareness</p>
            <p className="text-theme-text-primary font-medium">View</p>
            <p className="text-theme-text-tertiary text-xs mt-1">Your cognitive style</p>
          </div>
        </div>
        <p className="text-theme-text-tertiary text-xs mt-4">
          Variables represent the four arrows on your chart, indicating deeper aspects of how you're designed to operate.
          Advanced Human Design analysis.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link to="/human-design" className="p-4 bg-surface-base/50 rounded-lg border border-theme-border-subtle hover:border-theme-border-subtle text-center">
          <span className="text-2xl block mb-1">⬡</span>
          <span className="text-theme-text-secondary text-sm">Gates</span>
        </Link>
        <Link to="/human-design/centers" className="p-4 bg-surface-base/50 rounded-lg border border-theme-border-subtle hover:border-theme-border-subtle text-center">
          <span className="text-2xl block mb-1">⚬</span>
          <span className="text-theme-text-secondary text-sm">Centers</span>
        </Link>
        <Link to="/human-design/channels" className="p-4 bg-surface-base/50 rounded-lg border border-theme-border-subtle hover:border-theme-border-subtle text-center">
          <span className="text-2xl block mb-1">⎯</span>
          <span className="text-theme-text-secondary text-sm">Channels</span>
        </Link>
        <Link to="/human-design/types" className="p-4 bg-surface-base/50 rounded-lg border border-theme-border-subtle hover:border-theme-border-subtle text-center">
          <span className="text-2xl block mb-1">◉</span>
          <span className="text-theme-text-secondary text-sm">Types</span>
        </Link>
      </div>
    </div>
    </div>

      {/* Entity Stack — side panels for entity details */}
      <EntityStack
        entities={selectedEntities}
        onCloseEntity={handleCloseEntity}
        onEntityClick={handleEntityClick}
      />
    </motion.div>
  );
}

export default ProfileHumanDesign;
