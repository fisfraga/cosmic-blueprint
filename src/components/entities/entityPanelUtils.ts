import type { AstroProfile, GeneKeySphere, NatalPlacement } from '../../types';
import { signs } from '../../data';
import { SPHERE_DISPLAY_NAMES } from './entityPanelConstants';

/** Find which profile spheres use a given Gene Key number */
export function getProfileSpheresForGeneKey(
  geneKeyNumber: number,
  profile: AstroProfile | null
): { sphereName: string; planetarySource: string; signPlacement?: string }[] {
  if (!profile?.geneKeysProfile) return [];

  const spheres: { sphereName: string; planetarySource: string; signPlacement?: string }[] = [];
  const gkProfile = profile.geneKeysProfile;

  const sphereKeys: (keyof typeof gkProfile)[] = [
    'lifesWork', 'evolution', 'radiance', 'purpose',
    'attraction', 'iq', 'eq', 'sq', 'core',
    'vocation', 'culture', 'pearl',
    'brand', 'creativity', 'relating', 'stability',
  ];

  for (const key of sphereKeys) {
    const sphere = gkProfile[key] as GeneKeySphere | undefined;
    if (sphere && sphere.geneKeyNumber === geneKeyNumber) {
      let signPlacement: string | undefined;
      const planetarySource = sphere.planetarySource;
      const planetName = planetarySource.replace(/^(Design|Natal)\s*/i, '').toLowerCase();

      const placement = profile.placements?.find(
        (p: NatalPlacement) => p.planetId.toLowerCase() === planetName
      );

      if (placement) {
        const sign = signs.get(placement.signId);
        if (sign) {
          const degreeStr = placement.degree !== undefined
            ? ` ${Math.floor(placement.degree)}°${Math.round((placement.degree % 1) * 60)}'`
            : '';
          signPlacement = `${sign.name}${degreeStr}`;
        }
      }

      spheres.push({
        sphereName: SPHERE_DISPLAY_NAMES[key] || key,
        planetarySource: sphere.planetarySource,
        signPlacement,
      });
    }
  }

  return spheres;
}

/** Safely get a string value from entity data */
export function getStringValue(data: Record<string, unknown>, key: string): string | null {
  const value = data[key];
  return typeof value === 'string' ? value : null;
}

/** Safely get a nested string value from entity data */
export function getNestedStringValue(data: Record<string, unknown>, key: string, nestedKey: string): string | null {
  const nested = data[key];
  if (nested && typeof nested === 'object' && nested !== null) {
    const value = (nested as Record<string, unknown>)[nestedKey];
    return typeof value === 'string' ? value : null;
  }
  return null;
}
