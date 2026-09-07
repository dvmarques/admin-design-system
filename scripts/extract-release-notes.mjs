#!/usr/bin/env node
import fs from 'node:fs/promises';
import { extractReleaseNotes } from './release-utils.mjs';
const version = process.argv[2];
if (!version) throw new Error('Uso: node scripts/extract-release-notes.mjs X.Y.Z [CHANGELOG.md]');
const file = process.argv[3] ?? 'CHANGELOG.md';
process.stdout.write(`${extractReleaseNotes(await fs.readFile(file,'utf8'),version)}\n`);
