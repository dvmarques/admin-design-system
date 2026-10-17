import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StorybookLink } from '../app/storybook-link';

afterEach(() => vi.unstubAllEnvs());

describe('StorybookLink', () => {
	it('renders an accessible link that opens in a new tab when the catalog address is set', () => {
		vi.stubEnv('NEXT_PUBLIC_STORYBOOK_URL', '/admin-design-system/storybook/');

		render(<StorybookLink />);

		const link = screen.getByRole('link', { name: 'Storybook (abre em nova aba)' });
		expect(link).toHaveAttribute('href', '/admin-design-system/storybook/');
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
	});

	it('renders nothing without the catalog address', () => {
		vi.stubEnv('NEXT_PUBLIC_STORYBOOK_URL', '');

		const { container } = render(<StorybookLink />);

		expect(container).toBeEmptyDOMElement();
	});
});
