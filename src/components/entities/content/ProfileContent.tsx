import type { EntityInfo } from '../../../services/entities';
import type {
  AstrologyPlacementEntity,
  GeneKeysPlacementEntity,
  HDPlacementEntity,
  ProfileAspectEntity,
  ProfileChannelEntity,
  ProfileConfigurationEntity,
} from '../../../types';
import { getEntity } from '../../../services/entities';
import { signs, planets, aspects } from '../../../data';

interface ProfileContentProps {
  entity: EntityInfo;
}

export function ProfileContent({ entity }: ProfileContentProps) {
  return (
    <>
      {entity.type === 'profile-placement' && (
        <PlacementContent entity={entity} />
      )}
      {entity.type === 'profile-gk-placement' && (
        <GKPlacementContent entity={entity} />
      )}
      {entity.type === 'profile-hd-placement' && (
        <HDPlacementContent entity={entity} />
      )}
      {entity.type === 'profile-aspect' && (
        <AspectContent entity={entity} />
      )}
      {entity.type === 'profile-channel' && (
        <ChannelContent entity={entity} />
      )}
      {entity.type === 'profile-configuration' && (
        <ConfigurationContent entity={entity} />
      )}
    </>
  );
}

function PlacementContent({ entity }: { entity: EntityInfo }) {
  const placement = entity.data as AstrologyPlacementEntity;
  const planet = planets.get(placement.planetId);
  const sign = signs.get(placement.signId);
  const house = getEntity(placement.houseId);

  return (
    <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
      <h4 className="text-xs uppercase tracking-wider text-purple-400 mb-2">
        Your Placement
      </h4>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{planet?.symbol}</span>
          <span className="text-white font-medium">{planet?.name}</span>
          <span className="text-gray-400">in</span>
          <span className="text-purple-300">{sign?.name}</span>
        </div>
        <div className="text-sm text-gray-400">
          {placement.degree}°{placement.minute}' • {house?.name}
          {placement.retrograde && <span className="text-amber-400 ml-2">℞ Retrograde</span>}
        </div>
      </div>
    </div>
  );
}

function GKPlacementContent({ entity }: { entity: EntityInfo }) {
  const gkPlacement = entity.data as GeneKeysPlacementEntity;

  return (
    <div className="bg-emerald-900/30 rounded-lg p-3 border border-emerald-500/20">
      <h4 className="text-xs uppercase tracking-wider text-emerald-400 mb-2">
        {gkPlacement.sphereName}
      </h4>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl text-emerald-300">{gkPlacement.geneKeyNumber}</span>
          <span className="text-gray-400">Line {gkPlacement.lineNumber}</span>
        </div>
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-14 text-red-400">Shadow</span>
            <span className="text-gray-300">{gkPlacement.shadow?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-14 text-emerald-400">Gift</span>
            <span className="text-gray-300">{gkPlacement.gift?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-14 text-purple-400">Siddhi</span>
            <span className="text-gray-300">{gkPlacement.siddhi?.name}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500">{gkPlacement.planetarySource}</p>
      </div>
    </div>
  );
}

function HDPlacementContent({ entity }: { entity: EntityInfo }) {
  const hdPlacement = entity.data as HDPlacementEntity;
  const center = getEntity(hdPlacement.centerId);

  return (
    <div className="bg-amber-900/30 rounded-lg p-3 border border-amber-500/20">
      <h4 className="text-xs uppercase tracking-wider text-amber-400 mb-2">
        Gate {hdPlacement.gateNumber}.{hdPlacement.lineNumber}
      </h4>
      <div className="space-y-2">
        <div className={`inline-flex px-2 py-0.5 rounded text-xs ${
          hdPlacement.isPersonality
            ? 'bg-amber-500/20 text-amber-300'
            : 'bg-red-500/20 text-red-300'
        }`}>
          {hdPlacement.isPersonality ? 'Personality (Conscious)' : 'Design (Unconscious)'}
        </div>
        <p className="text-sm text-gray-400">{center?.name}</p>
        {hdPlacement.isChannelComplete && (
          <p className="text-sm text-emerald-400">Channel Complete</p>
        )}
      </div>
    </div>
  );
}

function AspectContent({ entity }: { entity: EntityInfo }) {
  const aspect = entity.data as ProfileAspectEntity;
  const planet1 = planets.get(aspect.planet1Id);
  const planet2 = planets.get(aspect.planet2Id);
  const aspectType = aspects.get(aspect.aspectId);

  return (
    <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
      <h4 className="text-xs uppercase tracking-wider text-purple-400 mb-2">
        Your Aspect
      </h4>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{planet1?.symbol}</span>
        <span className="text-lg text-purple-300">{aspectType?.symbol}</span>
        <span className="text-2xl">{planet2?.symbol}</span>
      </div>
      <p className="text-sm text-gray-300">
        {planet1?.name} {aspectType?.name?.toLowerCase()} {planet2?.name}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Orb: {aspect.orbDegree}°{aspect.orbMinute}' • {aspect.direction}
      </p>
    </div>
  );
}

function ChannelContent({ entity }: { entity: EntityInfo }) {
  const channel = entity.data as ProfileChannelEntity;

  return (
    <div className="bg-amber-900/30 rounded-lg p-3 border border-amber-500/20">
      <h4 className="text-xs uppercase tracking-wider text-amber-400 mb-2">
        Your Channel
      </h4>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl text-amber-300">{channel.gate1Number}</span>
        <span className="text-gray-500">—</span>
        <span className="text-2xl text-amber-300">{channel.gate2Number}</span>
      </div>
      <p className="text-sm text-white">{channel.channelTheme}</p>
      <p className="text-xs text-gray-500 mt-1">{channel.circuitType} Circuit</p>
    </div>
  );
}

function ConfigurationContent({ entity }: { entity: EntityInfo }) {
  const config = entity.data as ProfileConfigurationEntity;

  return (
    <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
      <h4 className="text-xs uppercase tracking-wider text-purple-400 mb-2">
        {config.configurationType}
      </h4>
      <div className="flex flex-wrap gap-1 mb-2">
        {config.planetIds.map((planetId) => {
          const planet = planets.get(planetId);
          return (
            <span key={planetId} className="text-xl" title={planet?.name}>
              {planet?.symbol}
            </span>
          );
        })}
      </div>
      <p className="text-sm text-white">{config.configurationName}</p>
    </div>
  );
}
