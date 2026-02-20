#!/usr/bin/env node
/**
 * Ephemeris Data Generator
 *
 * Generates pre-computed planetary positions for fast lookups.
 * Uses astronomy-engine for accurate calculations.
 *
 * Usage: node scripts/generate-ephemeris.mjs
 */

import { Body, GeoVector, Ecliptic } from 'astronomy-engine';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
const START_YEAR = 2020;
const END_YEAR = 2035;
const PLANETS = [
  { id: 'sun', body: Body.Sun },
  { id: 'moon', body: Body.Moon },
  { id: 'mercury', body: Body.Mercury },
  { id: 'venus', body: Body.Venus },
  { id: 'mars', body: Body.Mars },
  { id: 'jupiter', body: Body.Jupiter },
  { id: 'saturn', body: Body.Saturn },
  { id: 'uranus', body: Body.Uranus },
  { id: 'neptune', body: Body.Neptune },
  { id: 'pluto', body: Body.Pluto },
];

/**
 * Get ecliptic longitude for a planet at a given date
 *
 * IMPORTANT: Use GeoVector + Ecliptic for ALL planets to get GEOCENTRIC coordinates.
 * This is critical for astrology which uses Earth-centered positions.
 *
 * EclipticLongitude returns heliocentric coordinates which are INCORRECT for:
 * - The Moon (which orbits Earth, not the Sun)
 * - Any astrological calculation (astrology is geocentric)
 */
function getPlanetLongitude(planetId, body, date) {
  try {
    // All planets: use geocentric vector then convert to ecliptic coordinates
    const geoVec = GeoVector(body, date, true);
    const eclip = Ecliptic(geoVec);
    const longitude = eclip.elon;

    return Math.round(longitude * 100) / 100; // Round to 2 decimals
  } catch (e) {
    console.error(`Error calculating ${planetId} for ${date}:`, e.message);
    return 0;
  }
}

/**
 * Generate ephemeris data for the specified date range
 */
function generateEphemeris() {
  console.log(`Generating ephemeris data from ${START_YEAR} to ${END_YEAR}...`);
  console.log(`Planets: ${PLANETS.map(p => p.id).join(', ')}`);

  const data = [];
  const startDate = new Date(`${START_YEAR}-01-01T00:00:00Z`);
  const endDate = new Date(`${END_YEAR}-12-31T00:00:00Z`);

  let currentDate = new Date(startDate);
  let dayCount = 0;
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  while (currentDate <= endDate) {
    const positions = PLANETS.map(planet => getPlanetLongitude(planet.id, planet.body, currentDate));
    data.push(positions);

    // Progress indicator every 365 days
    dayCount++;
    if (dayCount % 365 === 0) {
      const percent = Math.round((dayCount / totalDays) * 100);
      console.log(`  Progress: ${percent}% (${currentDate.toISOString().split('T')[0]})`);
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log(`Generated ${data.length} days of data`);

  return {
    meta: {
      version: 1,
      source: 'astronomy-engine',
      startDate: `${START_YEAR}-01-01`,
      endDate: `${END_YEAR}-12-31`,
      planets: PLANETS.map(p => p.id),
      generatedAt: new Date().toISOString(),
    },
    data,
  };
}

/**
 * Main execution
 */
function main() {
  const outputDir = join(__dirname, '..', 'src', 'data', 'ephemeris');
  const outputFile = join(outputDir, `positions-${START_YEAR}-${END_YEAR}.json`);

  // Create directory if it doesn't exist
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
    console.log(`Created directory: ${outputDir}`);
  }

  // Generate data
  const startTime = Date.now();
  const ephemeris = generateEphemeris();
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  // Write to file
  const jsonData = JSON.stringify(ephemeris);
  writeFileSync(outputFile, jsonData);

  // Stats
  const sizeKB = (jsonData.length / 1024).toFixed(2);
  console.log(`\nGeneration complete!`);
  console.log(`  File: ${outputFile}`);
  console.log(`  Size: ${sizeKB} KB`);
  console.log(`  Time: ${elapsed} seconds`);
  console.log(`  Days: ${ephemeris.data.length}`);

  // Sample verification
  console.log(`\nSample data (first 3 days):`);
  ephemeris.data.slice(0, 3).forEach((day, i) => {
    const date = new Date(`${START_YEAR}-01-01`);
    date.setDate(date.getDate() + i);
    console.log(`  ${date.toISOString().split('T')[0]}: Sun=${day[0]}°, Moon=${day[1]}°`);
  });
}

main();
