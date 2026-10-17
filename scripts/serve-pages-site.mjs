// Serve `site/` sob /admin-design-system/, como o GitHub Pages faz, para verificar o site
// publicado localmente. Uso: node scripts/serve-pages-site.mjs [porta]
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'site');
const base = '/admin-design-system';
const port = Number(process.argv[2] ?? 4173);

const types = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.txt': 'text/plain; charset=utf-8',
	'.woff2': 'font/woff2',
	'.ico': 'image/x-icon',
};

createServer((request, response) => {
	const { pathname } = new URL(request.url ?? '/', 'http://localhost');
	const notFound = () => {
		response.statusCode = 404;
		const page = join(root, '404.html');
		if (existsSync(page)) createReadStream(page).pipe(response);
		else response.end('Not found');
	};

	if (pathname !== base && !pathname.startsWith(`${base}/`)) return notFound();

	let file = normalize(join(root, decodeURIComponent(pathname.slice(base.length))));
	if (!file.startsWith(root)) return notFound();
	if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
	if (!existsSync(file)) return notFound();

	response.setHeader('content-type', types[extname(file)] ?? 'application/octet-stream');
	createReadStream(file).pipe(response);
}).listen(port, '127.0.0.1', () => {
	console.log(`http://127.0.0.1:${port}${base}/`);
});
