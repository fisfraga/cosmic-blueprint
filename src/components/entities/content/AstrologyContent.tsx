import type { EntityInfo } from '../../../services/entities';
import type { AstroProfile, NatalPlacement, NatalAspect } from '../../../types';
import {
  getPlacementsInSign,
  getPlacementsInHouse,
  getAspectsInvolving,
} from '../../../services/entities';
import { signs, planets, aspects, getSignsByElement } from '../../../data';
import { getStringValue } from '../entityPanelUtils';

interface AstrologyContentProps {
  entity: EntityInfo;
  profile: AstroProfile | null;
}

export function AstrologyContent({ entity, profile }: AstrologyContentProps) {
  const data = entity.data as Record<string, unknown>;

  return (
    <>
      {/* Planet: Archetype */}
      {entity.type === 'planet' && getStringValue(data, 'archetype') && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-theme-text-tertiary mb-1">
            Archetype
          </h4>
          <p className="text-sm text-theme-text-secondary">{getStringValue(data, 'archetype')}</p>
        </div>
      )}

      {/* Planet: Silverman role archetype (Sprint AE) */}
      {entity.type === 'planet' && getStringValue(data, 'debraRoleMetaphor') && (
        <PlanetDebraSection entity={entity} />
      )}

      {/* Element: Placements in signs of this element */}
      {entity.type === 'element' && (
        <ElementPlacements entity={entity} />
      )}

      {/* Aspect: Your aspects of this type */}
      {entity.type === 'aspect' && (
        <AspectsByType entity={entity} profile={profile} />
      )}

      {/* Sign: Silverman psychological layer (Sprint AE) */}
      {entity.type === 'sign' && (
        <SignDebraSection entity={entity} />
      )}

      {/* Sign: Placements in this sign */}
      {entity.type === 'sign' && (
        <SignPlacements entity={entity} />
      )}

      {/* House: Placements in this house */}
      {entity.type === 'house' && (
        <HousePlacements entity={entity} />
      )}

      {/* Planet: Aspects with this planet */}
      {entity.type === 'planet' && (
        <PlanetAspects entity={entity} />
      )}
    </>
  );
}

function ElementPlacements({ entity }: { entity: EntityInfo }) {
  const elementSigns = getSignsByElement(entity.id);
  const placementsInElement: EntityInfo[] = [];

  elementSigns.forEach(sign => {
    placementsInElement.push(...getPlacementsInSign(sign.id));
  });

  if (placementsInElement.length === 0) return null;

  return (
    <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
      <h4 className="text-xs uppercase tracking-wider text-purple-400 mb-2">
        Your {entity.name} Placements
      </h4>
      <div className="space-y-1.5">
        {placementsInElement.map((pe) => {
          const placement = pe.data as NatalPlacement;
          const planet = planets.get(placement.planetId);
          const sign = signs.get(placement.signId);
          return (
            <div key={pe.id} className="flex items-center gap-2 text-sm">
              <span className="text-lg">{planet?.symbol || ''}</span>
              <span className="text-theme-text-primary font-medium">{planet?.name || placement.planetId}</span>
              <span className="text-theme-text-tertiary">in</span>
              <span className="text-theme-text-secondary">{sign?.name || placement.signId}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AspectsByType({ entity, profile }: { entity: EntityInfo; profile: AstroProfile | null }) {
  const aspectsOfType = profile?.aspects?.planetary.filter(
    (a: NatalAspect) => a.aspectId === entity.id
  ) || [];

  if (aspectsOfType.length === 0) return null;

  return (
    <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
      <h4 className="text-xs uppercase tracking-wider text-purple-400 mb-2">
        Your {entity.name}s
      </h4>
      <div className="space-y-1.5">
        {aspectsOfType.slice(0, 6).map((aspect: NatalAspect, i: number) => {
          const planet1 = planets.get(aspect.planet1Id);
          const planet2 = planets.get(aspect.planet2Id);
          return (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="text-lg">{planet1?.symbol || ''}</span>
              <span className="text-theme-text-tertiary">{entity.symbol || '—'}</span>
              <span className="text-lg">{planet2?.symbol || ''}</span>
              <span className="text-theme-text-secondary text-xs ml-2">
                {aspect.orbDegree?.toFixed(1) || '0'}° orb
              </span>
            </div>
          );
        })}
        {aspectsOfType.length > 6 && (
          <p className="text-xs text-theme-text-tertiary mt-1">
            +{aspectsOfType.length - 6} more
          </p>
        )}
      </div>
    </div>
  );
}

function SignDebraSection({ entity }: { entity: EntityInfo }) {
  const data = entity.data as Record<string, unknown>;
  const medicine = getStringValue(data, 'debraSignMedicine');
  const gremlin = getStringValue(data, 'debraGremlinTheme');
  const bodyPart = getStringValue(data, 'debraBodyPart');

  if (!medicine && !gremlin && !bodyPart) return null;

  return (
    <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-500/20">
      <h4 className="text-xs uppercase tracking-wider text-amber-400/80 mb-2">
        Silverman Psychology
      </h4>
      {gremlin && (
        <div className="mb-2">
          <p className="text-xs text-theme-text-tertiary mb-0.5">Gremlin Pattern</p>
          <p className="text-xs text-theme-text-secondary italic">"{gremlin}"</p>
        </div>
      )}
      {medicine && (
        <div className="mb-2">
          <p className="text-xs text-theme-text-tertiary mb-0.5">Medicine</p>
          <p className="text-xs text-theme-text-secondary">{medicine}</p>
        </div>
      )}
      {bodyPart && (
        <div>
          <p className="text-xs text-theme-text-tertiary mb-0.5">Body Correspondence</p>
          <p className="text-xs text-theme-text-secondary">{bodyPart}</p>
        </div>
      )}
    </div>
  );
}

function PlanetDebraSection({ entity }: { entity: EntityInfo }) {
  const roleMetaphor = getStringValue(entity.data as Record<string, unknown>, 'debraRoleMetaphor');
  if (!roleMetaphor) return null;

  return (
    <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-500/20">
      <h4 className="text-xs uppercase tracking-wider text-amber-400/80 mb-1">
        Silverman: Role Archetype
      </h4>
      <p className="text-xs text-theme-text-secondary">{roleMetaphor}</p>
    </div>
  );
}

function SignPlacements({ entity }: { entity: EntityInfo }) {
  const placementsInSign = getPlacementsInSign(entity.id);
  if (placementsInSign.length === 0) return null;

  return (
    <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
      <h4 className="text-xs uppercase tracking-wider text-purple-400 mb-2">
        Your Placements in {entity.name}
      </h4>
      <div className="space-y-1.5">
        {placementsInSign.map((placementEntity: EntityInfo) => {
          const placement = placementEntity.data as NatalPlacement;
          const planet = planets.get(placement.planetId);
          return (
            <div key={placementEntity.id} className="flex items-center gap-2 text-sm">
              <span className="text-lg">{planet?.symbol || ''}</span>
              <span className="text-theme-text-primary font-medium">{planet?.name || placement.planetId}</span>
              <span className="text-theme-text-secondary">
                {placement.degree}°{placement.minute}'
                {placement.retrograde && <span className="text-amber-400 ml-1">℞</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HousePlacements({ entity }: { entity: EntityInfo }) {
  const placementsInHouse = getPlacementsInHouse(entity.id);
  if (placementsInHouse.length === 0) return null;

  return (
    <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
      <h4 className="text-xs uppercase tracking-wider text-purple-400 mb-2">
        Your Placements in {entity.name}
      </h4>
      <div className="space-y-1.5">
        {placementsInHouse.map((placementEntity: EntityInfo) => {
          const placement = placementEntity.data as NatalPlacement;
          const planet = planets.get(placement.planetId);
          const sign = signs.get(placement.signId);
          return (
            <div key={placementEntity.id} className="flex items-center gap-2 text-sm">
              <span className="text-lg">{planet?.symbol || ''}</span>
              <span className="text-theme-text-primary font-medium">{planet?.name || placement.planetId}</span>
              <span className="text-theme-text-secondary">
                in {sign?.name || placement.signId}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlanetAspects({ entity }: { entity: EntityInfo }) {
  const aspectsWithPlanet = getAspectsInvolving(entity.id);
  if (aspectsWithPlanet.length === 0) return null;

  return (
    <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
      <h4 className="text-xs uppercase tracking-wider text-purple-400 mb-2">
        Your Aspects with {entity.name}
      </h4>
      <div className="space-y-1.5">
        {aspectsWithPlanet.slice(0, 6).map((aspectEntity: EntityInfo) => {
          const aspect = aspectEntity.data as NatalAspect;
          const aspectType = aspects.get(aspect.aspectId);
          const otherPlanetId = aspect.planet1Id === entity.id ? aspect.planet2Id : aspect.planet1Id;
          const otherPlanet = planets.get(otherPlanetId);
          return (
            <div key={aspectEntity.id} className="flex items-center gap-2 text-sm">
              <span className="text-lg">{aspectType?.symbol || ''}</span>
              <span className="text-theme-text-primary font-medium">{aspectType?.name || aspect.aspectId}</span>
              <span className="text-theme-text-secondary">{otherPlanet?.name || otherPlanetId}</span>
              <span className="text-theme-text-tertiary text-xs">
                {aspect.orbDegree}°{aspect.orbMinute}'
              </span>
            </div>
          );
        })}
        {aspectsWithPlanet.length > 6 && (
          <p className="text-xs text-theme-text-tertiary mt-1">
            +{aspectsWithPlanet.length - 6} more aspects
          </p>
        )}
      </div>
    </div>
  );
}
