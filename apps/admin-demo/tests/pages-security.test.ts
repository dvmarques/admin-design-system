import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { pageContentSecurityPolicy, pageReferrerPolicy } from '../lib/page-policies';

// Testes de consistência sobre os fontes; o comportamento renderizado é coberto pelos E2E.

const csp = "object-src 'none'; base-uri 'self'; form-action 'self'";
const referrer = 'strict-origin-when-cross-origin';

function source(path: string) {
	return readFileSync(new URL('../../../' + path, import.meta.url), 'utf8');
}

describe('políticas declaradas em HTML do Demo e Storybook (#269)', () => {
	it('mantém no layout Next a CSP parcial e o referrer, antes do script de tema', () => {
		expect(pageContentSecurityPolicy).toBe(csp);
		expect(pageReferrerPolicy).toBe(referrer);
		const layout = source('apps/admin-demo/app/layout.tsx');
		expect(layout).toContain('content={pageContentSecurityPolicy}');
		expect(layout).toContain('referrer: pageReferrerPolicy');
		expect(layout.indexOf('httpEquiv="Content-Security-Policy"')).toBeLessThan(
			layout.indexOf('dangerouslySetInnerHTML'),
		);
	});

	it('repete a mesma política nos documentos manager/preview do Storybook', () => {
		for (const name of ['manager-head.html', 'preview-head.html']) {
			const head = source('apps/docs/.storybook/' + name);
			expect(head).toContain(`content="${csp}"`);
			expect(head).toContain(`name="referrer" content="${referrer}"`);
			expect(head).not.toMatch(/frame-ancestors|unsafe-inline|unsafe-eval/);
		}
	});

	it('preserva noopener no link em nova aba para Storybook', () => {
		const link = source('apps/admin-demo/app/storybook-link.tsx');
		expect(link).toContain('target="_blank"');
		expect(link).toContain('rel="noopener"');
	});
});
