import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = resolve(root, 'dist/styles.css');
mkdirSync(dirname(out), { recursive: true });
copyFileSync(resolve(root, 'src/styles.css'), out);
