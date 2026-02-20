// Entity Registry Service
// Re-export everything from the registry module

export {
  entityRegistry,
  getEntity,
  hasEntity,
  searchEntities,
  getEntitiesBySystem,
  getEntitiesByCategory,
  getRelatedEntities,
  getEntityStats,
  // Profile entity functions
  registerProfile,
  unregisterProfile,
  getProfileEntity,
  getAllProfileEntities,
  getProfilePlacements,
  getProfileAspects,
  getPlacementsInSign,
  getPlacementsInHouse,
  getAspectsInvolving,
  getAspectsByType,
  getEntityWithProfile,
  type EntitySystem,
  type EntityCategory,
  type EntityInfo,
} from './registry';
