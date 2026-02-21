import { Link } from 'react-router-dom';
import type { Planet, ZodiacSign, House, Element, Aspect, UniversalEntity, HDGate, HDCenter, GeneKey, CodonRing, GKSphereEntity } from '../types';
import { entityCardColors, getPlanetElementColor, type EntityColorKey } from '../styles';

type EntityCardProps = {
  entity: Planet | ZodiacSign | House | Element | Aspect | HDGate | HDCenter | GeneKey | CodonRing | GKSphereEntity | UniversalEntity;
  variant?: 'default' | 'compact' | 'full';
};

function getElementColor(entity: EntityCardProps['entity']): EntityColorKey {
  // For signs, use their element
  if (entity.type === 'sign') {
    const sign = entity as ZodiacSign;
    const elementMap: Record<string, EntityColorKey> = {
      fire: 'fire',
      earth: 'earth',
      air: 'air',
      water: 'water',
    };
    return elementMap[sign.elementId] || 'neutral';
  }

  // For elements, use their own color
  if (entity.type === 'element') {
    return entity.id as EntityColorKey;
  }

  // For planets, use archetype-based colors
  if (entity.type === 'planet') {
    const planet = entity as Planet;
    return getPlanetElementColor(planet.id) as EntityColorKey;
  }

  // For aspects
  if (entity.type === 'aspect') {
    const aspect = entity as Aspect;
    if (aspect.nature === 'Harmonious') return 'water';
    if (aspect.nature === 'Challenging') return 'fire';
    return 'air';
  }

  // Human Design entities
  if (entity.type === 'hd-gate' || entity.type === 'hd-center') {
    return 'humandesign';
  }

  // Gene Keys entities
  if (entity.type === 'gene-key' || entity.type === 'codon-ring' || entity.type === 'gk-sphere') {
    return 'genekey';
  }

  return 'neutral';
}

export function EntityCard({ entity, variant = 'default' }: EntityCardProps) {
  const color = getElementColor(entity);
  const colors = entityCardColors[color] || entityCardColors.neutral;

  const getEntityPath = () => {
    switch (entity.type) {
      case 'planet': return `/planets/${entity.id}`;
      case 'sign': return `/signs/${entity.id}`;
      case 'house': return `/houses/${entity.id}`;
      case 'element': return `/elements/${entity.id}`;
      case 'aspect': return `/aspects/${entity.id}`;
      case 'hd-gate': return `/human-design/${entity.id}`;
      case 'hd-center': return `/human-design/centers/${entity.id}`;
      case 'gene-key': return `/gene-keys/${entity.id}`;
      case 'codon-ring': return `/gene-keys/codon-rings/${entity.id}`;
      case 'gk-sphere': return `/gene-keys/spheres/${entity.id}`;
      default: return '#';
    }
  };

  const getSubtitle = () => {
    switch (entity.type) {
      case 'planet': {
        const planet = entity as Planet;
        return planet.archetype;
      }
      case 'sign': {
        const sign = entity as ZodiacSign;
        return `${sign.signModality} ${sign.elementId.charAt(0).toUpperCase() + sign.elementId.slice(1)} • ${sign.keyPhrase}`;
      }
      case 'house': {
        const house = entity as House;
        return `${house.houseType} House • ${house.lifeAreaFocus.slice(0, 3).join(', ')}`;
      }
      case 'element': {
        const element = entity as Element;
        return element.corePrinciple;
      }
      case 'aspect': {
        const aspect = entity as Aspect;
        return `${aspect.angle}° • ${aspect.nature} • ${aspect.keyword}`;
      }
      case 'hd-gate': {
        const gate = entity as HDGate;
        return `Gate ${gate.gateNumber} • ${gate.iChingName} • ${gate.coreTheme}`;
      }
      case 'hd-center': {
        const center = entity as HDCenter;
        return `${center.centerType} Center • ${center.biologicalCorrelate}`;
      }
      case 'gene-key': {
        const gk = entity as GeneKey;
        return `${gk.shadow.name} → ${gk.gift.name} → ${gk.siddhi.name}`;
      }
      case 'codon-ring': {
        const ring = entity as CodonRing;
        return ring.theme;
      }
      case 'gk-sphere': {
        const sphere = entity as GKSphereEntity;
        return `${sphere.sequence} Sequence • ${sphere.theme}`;
      }
      default:
        return '';
    }
  };

  const getDescription = () => {
    switch (entity.type) {
      case 'planet': {
        const planet = entity as Planet;
        return planet.functionAndMeaning;
      }
      case 'sign': {
        const sign = entity as ZodiacSign;
        return sign.characteristicsAndQualities;
      }
      case 'house': {
        const house = entity as House;
        return house.meaningAndRepresentation;
      }
      case 'element': {
        const element = entity as Element;
        return element.coreQuality;
      }
      case 'aspect': {
        const aspect = entity as Aspect;
        return aspect.explanation;
      }
      case 'hd-gate': {
        const gate = entity as HDGate;
        return gate.hdDefinition;
      }
      case 'hd-center': {
        const center = entity as HDCenter;
        return center.definedMeaning;
      }
      case 'gene-key': {
        const gk = entity as GeneKey;
        return gk.gift.description || gk.description || '';
      }
      case 'codon-ring': {
        const ring = entity as CodonRing;
        return ring.collectivePurpose;
      }
      case 'gk-sphere': {
        const sphere = entity as GKSphereEntity;
        return sphere.description || sphere.practicalGuidance;
      }
      default:
        return entity.description || '';
    }
  };

  if (variant === 'compact') {
    return (
      <Link
        to={getEntityPath()}
        className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:border-theme-border ${colors.bg} ${colors.border}`}
      >
        <span className={`text-2xl ${colors.accent}`}>{entity.symbol}</span>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium truncate">{entity.name}</h3>
        </div>
      </Link>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`block p-6 rounded-xl border ${colors.bg} ${colors.border}`}>
        <div className="text-center mb-4">
          <div className={`text-5xl mb-3 ${colors.accent}`}>{entity.symbol || '✧'}</div>
          <h3 className="font-serif text-2xl font-medium text-theme-text-primary">
            {entity.name}
          </h3>
          <p className="text-theme-text-secondary text-sm mt-1 capitalize">{entity.type}</p>
        </div>

        <p className="text-theme-text-secondary text-sm mb-4">{getSubtitle()}</p>

        <p className="text-theme-text-secondary text-sm line-clamp-4 mb-4">
          {getDescription()}
        </p>

        <Link
          to={getEntityPath()}
          className="block w-full text-center px-4 py-2 bg-surface-raised hover:bg-surface-interactive text-theme-text-primary text-sm rounded-lg transition-colors"
        >
          View Full Details
        </Link>
      </div>
    );
  }

  return (
    <Link
      to={getEntityPath()}
      className={`block p-5 rounded-xl border transition-all group hover:border-theme-border ${colors.bg} ${colors.border}`}
    >
      <div className="flex items-start gap-4">
        {entity.image ? (
          <img
            src={entity.image}
            alt={entity.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
        ) : (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${colors.bg}`}>
            {entity.symbol || '✧'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-xl ${colors.accent}`}>{entity.symbol}</span>
            <h3 className="font-serif text-lg font-medium group-hover:text-theme-text-primary transition-colors truncate">
              {entity.name}
            </h3>
          </div>
          <p className="text-theme-text-secondary text-sm mt-1 line-clamp-2">
            {getSubtitle()}
          </p>
        </div>
      </div>
    </Link>
  );
}
