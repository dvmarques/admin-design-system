import { render } from '@testing-library/react';
import type { ReactNode } from 'react';

export type TestTheme = 'light' | 'dark';

export function renderWithTheme(ui: ReactNode, theme: TestTheme = 'light') {
	return render(<div data-theme={theme}>{ui}</div>);
}
