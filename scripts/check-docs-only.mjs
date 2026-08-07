#!/usr/bin/env node
// Cloudflare Pages build guard:
// If the commit being built only touches docs (md files, scripts/, etc.)
// we exit 0 WITHOUT running the real build, so no pointless redeploy happens.
// Use as: "npm run build" -> "node scripts/check-docs-only.mjs && npm run build"

import { execSync } from 'node:child_process';

const DOC_ONLY_PATTERNS = [/\.md$/i, /^scripts\//, /^\.claude\//, /^supabase\/migrations\//];

const sha = process.env.CF_PAGES_COMMIT_SHA;
if (!sha) {
  // Not on Cloudflare Pages (local dev, other CI) — always build normally.
  console.log('[docs-guard] No CF_PAGES_COMMIT_SHA, building normally.');
  process.exit(0);
}

let files;
try {
  // Files changed between the commit Cloudflare is building and its parent.
  // On Pages, CF_PAGES_COMMIT_SHA points at the commit being deployed.
  const parent = execSync(`git rev-parse ${sha}~1`, { encoding: 'utf8' }).trim();
  files = execSync(`git diff --name-only ${parent} ${sha}`, { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
} catch {
  try {
    files = execSync(`git show --name-only --format= ${sha}`, { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);
  } catch {
    console.log('[docs-guard] Could not read changed files, building normally.');
    process.exit(0);
  }
}

if (!files.length) {
  console.log('[docs-guard] No changed files detected, building normally.');
  process.exit(0);
}

const allDocs = files.every((f) => DOC_ONLY_PATTERNS.some((re) => re.test(f)));
if (allDocs) {
  console.log(`[docs-guard] Skipping build: only docs/config changed → ${files.join(', ')}`);
  process.exit(0);
}

console.log(`[docs-guard] Source files changed → ${files.join(', ')}`);
process.exit(1); // run the real build
