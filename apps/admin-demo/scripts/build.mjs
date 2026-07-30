import { mkdir, writeFile } from 'node:fs/promises';

await mkdir(new URL('../.next/', import.meta.url), { recursive: true });
await writeFile(new URL('../.next/BUILD_ID', import.meta.url), 'placeholder', 'utf8');
