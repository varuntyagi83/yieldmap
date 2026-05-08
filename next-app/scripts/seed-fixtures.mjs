/**
 * Run once to cache RentCast responses for the two demo zip codes.
 * After running, commit the generated JSON files — the API routes will
 * serve them instead of calling RentCast on every request.
 *
 * Usage:
 *   RENTCAST_API_KEY=sk_... node scripts/seed-fixtures.mjs
 *   OR set RENTCAST_API_KEY in .env.local and run:
 *   node -e "require('dotenv').config({path:'.env.local'})" scripts/seed-fixtures.mjs
 *   OR simply: node scripts/seed-fixtures.mjs  (reads .env.local automatically)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Read .env.local to get the key without requiring dotenv
function readEnvLocal() {
  const envPath = join(ROOT, '.env.local');
  if (!existsSync(envPath)) return {};
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  const env = {};
  for (const line of lines) {
    const [k, ...rest] = line.split('=');
    if (k && rest.length) env[k.trim()] = rest.join('=').trim();
  }
  return env;
}

const env = readEnvLocal();
const API_KEY = process.env.RENTCAST_API_KEY || env.RENTCAST_API_KEY;

if (!API_KEY) {
  console.error('Error: RENTCAST_API_KEY not found in env or .env.local');
  process.exit(1);
}

const ZIP_CODES = ['75409', '27253'];

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { 'X-Api-Key': API_KEY, Accept: 'application/json' },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

function saveFixture(zip, type, data) {
  const dir = join(ROOT, 'src', 'data', 'fixtures', zip);
  mkdirSync(dir, { recursive: true });
  const path = join(dir, `${type}.json`);
  writeFileSync(path, JSON.stringify(data, null, 2));
  const size = (JSON.stringify(data).length / 1024).toFixed(1);
  console.log(`  Saved ${path} (${size} KB)`);
}

async function seedZip(zip) {
  console.log(`\nSeeding ${zip}...`);
  const [listings, market] = await Promise.all([
    fetchJson(`https://api.rentcast.io/v1/listings/sale?zipCode=${zip}&status=Active&limit=500`),
    fetchJson(`https://api.rentcast.io/v1/markets?zipCode=${zip}&historyRange=6`),
  ]);
  const count = Array.isArray(listings) ? listings.length : (listings?.listings?.length ?? 0);
  console.log(`  Listings: ${count}, Market data: ${Object.keys(market).length} fields`);
  saveFixture(zip, 'listings', listings);
  saveFixture(zip, 'market', market);
}

console.log('YieldMap fixture seeder');
console.log('=======================');
console.log(`API key: ${API_KEY.slice(0, 8)}...`);

for (const zip of ZIP_CODES) {
  await seedZip(zip);
}

console.log('\nDone. Commit these files to avoid future RentCast calls for these zip codes:');
for (const zip of ZIP_CODES) {
  console.log(`  next-app/src/data/fixtures/${zip}/listings.json`);
  console.log(`  next-app/src/data/fixtures/${zip}/market.json`);
}
