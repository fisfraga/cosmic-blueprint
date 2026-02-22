import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useProfile } from '../../context';
import { LoadingSkeleton, ProfileRequiredState } from '../../components';
import {
  getEntity,
  entityRegistry,
} from '../../services/entities/registry';
import type { ProfileConfigurationEntity } from '../../types';
import { EntityStack } from '../../components/entities/EntityStack';
import type { EntityInfo } from '../../services/entities/registry';

export function ProfileConfigurationDetail() {
  const { configId } = useParams<{ configId: string }>();
  const { profile, isLoading, hasProfile } = useProfile();
  const [selectedEntities, setSelectedEntities] = useState<EntityInfo[]>([]);
  const handleEntityClick = useCallback((entity: EntityInfo) => {
    setSelectedEntities(prev => {
      const already = prev.findIndex(e => e.id === entity.id);
      if (already !== -1) return prev;
      if (prev.length >= 2) return [prev[1], entity];
      return [...prev, entity];
    });
  }, []);
  const handleCloseEntity = useCallback((id: string) => {
    setSelectedEntities(prev => prev.filter(e => e.id !== id));
  }, []);

  if (isLoading) {
    return <LoadingSkeleton variant="profile" />;
  }

  if (!hasProfile || !profile) {
    return (
      <ProfileRequiredState
        title="Configuration Detail"
        description="Create your profile to explore your aspect patterns."
      />
    );
  }

  // Find the matching configuration
  let configInfo = null;
  const allProfileEntities = entityRegistry.getAllProfileEntities();
  for (const entity of allProfileEntities) {
    if (entity.type === 'profile-configuration') {
      const data = entity.data as ProfileConfigurationEntity;
      if (data.configurationType === configId || entity.id.includes(configId || '')) {
        configInfo = entity;
        break;
      }
    }
  }

  if (!configInfo) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Configuration Not Found</h1>
        <p className="text-theme-text-secondary mb-4">This configuration could not be found in your profile.</p>
        <Link to="/profile/astrology" className="text-amber-400 hover:underline">
          Back to Astrology Profile
        </Link>
      </div>
    );
  }

  const config = configInfo.data as ProfileConfigurationEntity;
  const configType = getEntity(config.configurationId);

  // Get involved planets with their placements
  const involvedPlanets = config.planetIds.map((planetId) => {
    const planet = getEntity(planetId);
    const placement = profile.placements?.find((p) => p.planetId === planetId);
    const sign = placement ? getEntity(placement.signId) : null;
    return { planet, placement, sign };
  });

  return (
    <div className="flex h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 min-w-0 overflow-y-auto space-y-8"
      >
        {/* Header */}
        <div>
          <Link to="/profile/astrology" className="text-theme-text-secondary hover:text-theme-text-primary text-sm mb-2 inline-block">
            ← Back to Astrology Profile
          </Link>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-5xl text-purple-400">{configType?.symbol || '✦'}</span>
            <div>
              <h1 className="font-serif text-3xltext-theme-text-primary">{config.displayName}</h1>
              <p className="text-theme-text-secondary mt-1">
                {config.planetIds.length} planets involved
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Visual */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-6 border border-purple-500/20">
          <h2 className="font-serif text-xl text-theme-text-primary mb-4">Pattern Overview</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {involvedPlanets.map(({ planet, sign }, index) => (
              <div
                key={planet?.id || index}
                className="flex flex-col items-center gap-2 bg-purple-500/20 rounded-lg p-4 cursor-pointer hover:bg-purple-500/30 transition-colors"
                onClick={() => planet && handleEntityClick(planet)}
              >
                <span className="text-3xl">{planet?.symbol}</span>
                <span className="text-theme-text-primary font-medium">{planet?.name}</span>
                {sign && (
                  <span className="text-purple-300 text-sm">in {sign.name}</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-theme-text-secondary text-center">
            {configType?.description}
          </p>
        </div>

        {/* Involved Placements */}
        <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl text-theme-text-primary mb-4">Involved Placements</h2>
          <div className="space-y-3">
            {involvedPlanets.map(({ planet, placement, sign }) => {
              if (!planet || !placement) return null;
              const house = getEntity(placement.houseId);

              return (
                <div
                  key={planet.id}
                  className="block p-4 bg-surface-overlay rounded-lg hover:bg-surface-interactive/50 transition-colors cursor-pointer"
                  onClick={() => handleEntityClick(planet)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{planet.symbol}</span>
                      <div>
                        <p className="text-theme-text-primary font-medium">{planet.name}</p>
                        <p className="text-theme-text-secondary text-sm">
                          {placement.degree}°{placement.minute}' {sign?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-theme-text-secondary text-sm">{house?.name}</p>
                    </div>
                  </div>
                  <Link
                    to={`/profile/astrology/placements/${planet.id}`}
                    className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-2 inline-block"
                    onClick={e => e.stopPropagation()}
                  >
                    Full profile →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Signs Involved */}
        {config.signIds.length > 0 && (
          <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
            <h2 className="font-serif text-xl text-theme-text-primary mb-4">Signs Involved</h2>
            <div className="flex flex-wrap gap-3">
              {[...new Set(config.signIds)].map((signId) => {
                const sign = getEntity(signId);
                if (!sign) return null;
                const signData = sign.data as { elementId?: string };

                return (
                  <div
                    key={signId}
                    className="flex items-center gap-2 px-4 py-2 bg-surface-overlay rounded-lg hover:bg-surface-interactive/50 transition-colors cursor-pointer"
                    onClick={() => handleEntityClick(sign)}
                  >
                    <span className="text-xl">{sign.symbol}</span>
                    <span className="text-theme-text-primary">{sign.name}</span>
                    <span className="text-theme-text-tertiary text-sm capitalize">({signData.elementId})</span>
                    <Link
                      to={sign.routePath || '#'}
                      className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary ml-1"
                      onClick={e => e.stopPropagation()}
                    >
                      →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Configuration Type Info */}
        <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl text-theme-text-primary mb-4">About {configType?.name || 'This Pattern'}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-theme-text-secondary leading-relaxed">
                {configType?.description || 'An aspect pattern in your natal chart.'}
              </p>
            </div>
            <div className="space-y-3">
              {configType && (configType.data as { nature?: string })?.nature && (
                <div className="flex justify-between items-center">
                  <span className="text-theme-text-tertiary">Nature</span>
                  <span className="text-theme-text-primary capitalize">
                    {(configType.data as { nature?: string }).nature}
                  </span>
                </div>
              )}
              {configType && (configType.data as { keyword?: string })?.keyword && (
                <div className="flex justify-between items-center">
                  <span className="text-theme-text-tertiary">Keyword</span>
                  <span className="text-purple-300">
                    {(configType.data as { keyword?: string }).keyword}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Universal Configuration Link */}
        <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl text-theme-text-primary mb-4">Learn More</h2>
          <Link
            to={configType?.routePath || '/configurations'}
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
          >
            <span className="text-xl">{configType?.symbol || '✦'}</span>
            <span>Explore {configType?.name || 'Configurations'} in the Knowledge Base →</span>
          </Link>
        </div>

        {/* Contemplation Link */}
        <div className="flex justify-center">
          <Link
            to={`/contemplate?focus=configuration&type=${config.configurationType}`}
            className="px-6 py-3 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            Contemplate this Pattern
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-theme-border-subtle">
          <Link to="/profile/astrology" className="text-theme-text-secondary hover:text-theme-text-primary text-sm">
            ← Back to Astrology
          </Link>
          <Link to="/configurations" className="text-theme-text-secondary hover:text-theme-text-primary text-sm">
            All Configuration Types →
          </Link>
        </div>
      </motion.div>
      <EntityStack
        entities={selectedEntities}
        onCloseEntity={handleCloseEntity}
        onEntityClick={handleEntityClick}
      />
    </div>
  );
}

export default ProfileConfigurationDetail;
