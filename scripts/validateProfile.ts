/**
 * Profile Validation Test Script
 *
 * Run with: npx tsx scripts/validateProfile.ts
 */

// Since this runs outside of Vite, we need to handle imports differently
// This script outputs what the validation would produce

const FELIPE_FRAGA_PROFILE = {
  id: 'felipe-fraga',
  name: 'Felipe Fraga',
  dateOfBirth: '1994-10-18',
  timeOfBirth: '08:10',
  cityOfBirth: 'Rio de Janeiro, Brazil',
  coordinates: {
    latitude: -22.9068,
    longitude: -43.1729,
    timezone: 'America/Sao_Paulo',
  },

  // Currently stored Gene Keys values
  geneKeysProfile: {
    lifesWork: { geneKeyNumber: 32, line: 5 },
    evolution: { geneKeyNumber: 42, line: 5 },
    radiance: { geneKeyNumber: 56, line: 1 },
    purpose: { geneKeyNumber: 60, line: 1 },
    attraction: { geneKeyNumber: 15, line: 3 },
    iq: { geneKeyNumber: 48, line: 5 },
    eq: { geneKeyNumber: 4, line: 2 },
    sq: { geneKeyNumber: 50, line: 1 },
    core: { geneKeyNumber: 16, line: 6 },
    vocation: { geneKeyNumber: 16, line: 6 },
    culture: { geneKeyNumber: 28, line: 4 },
    pearl: { geneKeyNumber: 1, line: 6 },
    brand: { geneKeyNumber: 32, line: 5 },
    relating: { geneKeyNumber: 57, line: 1 },
    creativity: { geneKeyNumber: 54, line: 4 },
    stability: { geneKeyNumber: 36, line: 1 },
  },
};

// Calculate what the expected values should be based on the birth data
// Birth: October 18, 1994, 08:10 AM, Rio de Janeiro (-22.9068, -43.1729)
// UTC Time: 11:10 (Rio is UTC-3)

// Natal Date: 1994-10-18 11:10 UTC
// Design Date: ~88 days before = 1994-07-22 (approximately)

console.log('========================================');
console.log('FELIPE FRAGA PROFILE VALIDATION');
console.log('========================================');
console.log('');
console.log('Birth Data:');
console.log('  Date: October 18, 1994');
console.log('  Time: 08:10 AM (Local)');
console.log('  Location: Rio de Janeiro, Brazil');
console.log('  Timezone: America/Sao_Paulo (UTC-3)');
console.log('  UTC Time: 11:10');
console.log('');
console.log('Design Date (88 days before):');
console.log('  Approximately: July 22, 1994');
console.log('');
console.log('----------------------------------------');
console.log('SPHERE MAPPING REFERENCE');
console.log('----------------------------------------');
console.log('');
console.log('Activation Sequence:');
console.log("  Life's Work = Natal Sun");
console.log('  Evolution   = Natal Earth (opposite Sun)');
console.log('  Radiance    = Design Sun');
console.log('  Purpose     = Design Earth');
console.log('');
console.log('Venus Sequence:');
console.log('  Attraction  = Design Moon');
console.log('  IQ          = Natal Venus');
console.log('  EQ          = Natal Mars');
console.log('  SQ          = Design Venus');
console.log('  Core        = Design Mars');
console.log('');
console.log('Pearl Sequence:');
console.log('  Vocation    = Design Mars');
console.log('  Culture     = Design Jupiter');
console.log('  Brand       = Natal Sun');
console.log('  Pearl       = Natal Jupiter');
console.log('');
console.log('Additional:');
console.log('  Relating    = Natal Mercury');
console.log('  Creativity  = Design Uranus');
console.log('  Stability   = Design Saturn');
console.log('');
console.log('----------------------------------------');
console.log('CURRENTLY STORED VALUES');
console.log('----------------------------------------');
console.log('');

const gk = FELIPE_FRAGA_PROFILE.geneKeysProfile;
console.log('Activation Sequence:');
console.log(`  Life's Work: GK-${gk.lifesWork.geneKeyNumber}.${gk.lifesWork.line}`);
console.log(`  Evolution:   GK-${gk.evolution.geneKeyNumber}.${gk.evolution.line}`);
console.log(`  Radiance:    GK-${gk.radiance.geneKeyNumber}.${gk.radiance.line}`);
console.log(`  Purpose:     GK-${gk.purpose.geneKeyNumber}.${gk.purpose.line}`);
console.log('');
console.log('Venus Sequence:');
console.log(`  Attraction:  GK-${gk.attraction.geneKeyNumber}.${gk.attraction.line}`);
console.log(`  IQ:          GK-${gk.iq.geneKeyNumber}.${gk.iq.line}`);
console.log(`  EQ:          GK-${gk.eq.geneKeyNumber}.${gk.eq.line}`);
console.log(`  SQ:          GK-${gk.sq.geneKeyNumber}.${gk.sq.line}`);
console.log(`  Core:        GK-${gk.core.geneKeyNumber}.${gk.core.line}`);
console.log('');
console.log('Pearl Sequence:');
console.log(`  Vocation:    GK-${gk.vocation.geneKeyNumber}.${gk.vocation.line}`);
console.log(`  Culture:     GK-${gk.culture.geneKeyNumber}.${gk.culture.line}`);
console.log(`  Brand:       GK-${gk.brand.geneKeyNumber}.${gk.brand.line}`);
console.log(`  Pearl:       GK-${gk.pearl.geneKeyNumber}.${gk.pearl.line}`);
console.log('');
console.log('Additional:');
console.log(`  Relating:    GK-${gk.relating.geneKeyNumber}.${gk.relating.line}`);
console.log(`  Creativity:  GK-${gk.creativity.geneKeyNumber}.${gk.creativity.line}`);
console.log(`  Stability:   GK-${gk.stability.geneKeyNumber}.${gk.stability.line}`);
console.log('');
console.log('========================================');
console.log('');
console.log('To run the full validation with calculated positions,');
console.log('use the validation service in the app:');
console.log('');
console.log('  import { validateGeneKeysProfile, formatValidationReport } from "./services";');
console.log('  const report = validateGeneKeysProfile(profile);');
console.log('  console.log(formatValidationReport(report));');
console.log('');
