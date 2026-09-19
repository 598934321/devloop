#!/usr/bin/env node
// Structural validation for the devloop plugin repo. No dependencies.
// Usage: node scripts/validate.mjs   (exit 0 = all good)

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
let failures = 0;
let checks = 0;

const fail = (msg) => { failures++; console.error(`FAIL ${msg}`); };
const ok = (msg) => { checks++; };

// ── 1. Plugin manifests: valid JSON + required fields ──────────────────────
const manifestPaths = [
  '.devin-plugin/plugin.json',
  '.claude-plugin/plugin.json',
  '.codex-plugin/plugin.json',
  '.cursor-plugin/plugin.json',
  '.kimi-plugin/plugin.json',
  '.agents/plugins/marketplace.json',
  'gemini-extension.json',
];

const isSemver = (v) => typeof v === 'string' && /^\d+\.\d+\.\d+(-[\w.]+)?$/.test(v);

for (const rel of manifestPaths) {
  const abs = join(root, rel);
  if (!existsSync(abs)) { fail(`missing manifest: ${rel}`); continue; }
  let json;
  try { json = JSON.parse(readFileSync(abs, 'utf8')); }
  catch (e) { fail(`${rel}: invalid JSON — ${e.message}`); continue; }
  if (typeof json.name !== 'string' || !json.name) fail(`${rel}: missing "name"`);
  else ok(`${rel}: name=${json.name}`);
  if (rel.endsWith('plugin.json') || rel.endsWith('gemini-extension.json')) {
    if (!isSemver(json.version)) fail(`${rel}: missing/invalid "version" (want semver)`);
    else ok(`${rel}: version=${json.version}`);
    if (typeof json.description !== 'string' || !json.description)
      fail(`${rel}: missing "description"`);
  }
  // Declared skills dirs must exist
  const skillDirs = json.skills
    ? Array.isArray(json.skills) ? json.skills : [json.skills]
    : [];
  for (const dir of skillDirs) {
    const normalized = dir.replace(/^\.\//, '').replace(/\/$/, '');
    if (!existsSync(join(root, normalized))) fail(`${rel}: skills dir "${dir}" does not exist`);
    else ok(`${rel}: skills dir ${normalized} exists`);
  }
}

// ── 2. Skills: skills/<name>/SKILL.md + frontmatter name/description ──────
const skillsRoot = join(root, 'skills');
if (!existsSync(skillsRoot)) {
  fail('missing skills/ directory');
} else {
  const dirs = readdirSync(skillsRoot, { withFileTypes: true }).filter((d) => d.isDirectory());
  if (!dirs.length) fail('skills/ is empty');
  for (const dir of dirs) {
    const skillFile = join(skillsRoot, dir.name, 'SKILL.md');
    if (!existsSync(skillFile)) { fail(`skills/${dir.name}/: no SKILL.md`); continue; }
    const text = readFileSync(skillFile, 'utf8');
    const match = text.match(/^---\n([\s\S]*?)\n---/);
    if (!match) { fail(`skills/${dir.name}/SKILL.md: no YAML frontmatter`); continue; }
    const fm = match[1];
    const name = fm.match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const description = fm.match(/^description:\s*(.+)$/m)?.[1]?.trim();
    if (!name) fail(`skills/${dir.name}: frontmatter missing "name"`);
    else if (name !== dir.name) fail(`skills/${dir.name}: frontmatter name "${name}" != directory name`);
    else ok(`skills/${dir.name}: name ok`);
    if (!description) fail(`skills/${dir.name}: frontmatter missing "description"`);
    else ok(`skills/${dir.name}: description ok`);
  }
}

console.log(`\n${checks} checks passed, ${failures} failure(s)`);
process.exit(failures ? 1 : 0);
