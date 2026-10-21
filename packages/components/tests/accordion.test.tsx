import { renderToString } from 'react-dom/server';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
	AdsAccordion,
	AdsAccordionHeader,
	AdsAccordionItem,
	AdsAccordionPanel,
	AdsAccordionTrigger,
	type AdsAccordionProps,
} from '../src/index.js';

function Item({
	value,
	title,
	disabled,
	unmountOnCollapse,
}: {
	value: string;
	title: string;
	disabled?: boolean;
	unmountOnCollapse?: boolean;
}) {
	return (
		<AdsAccordion.Item disabled={disabled} unmountOnCollapse={unmountOnCollapse} value={value}>
			<AdsAccordion.Header>
				<AdsAccordion.Trigger>{title}</AdsAccordion.Trigger>
			</AdsAccordion.Header>
			<AdsAccordion.Panel>Conteúdo {title}</AdsAccordion.Panel>
		</AdsAccordion.Item>
	);
}

function renderAccordion(props: AdsAccordionProps = { type: 'single' }) {
	return render(
		<AdsAccordion {...props}>
			<Item title="Um" value="one" />
			<Item title="Dois" value="two" />
			<Item title="Três" value="three" />
		</AdsAccordion>,
	);
}

const trigger = (name: string) => screen.getByRole('button', { name });

describe('AdsAccordion structure', () => {
	it('exposes headings, buttons, expanded state and named regions', () => {
		renderAccordion({ type: 'single', defaultValue: 'two' });
		expect(screen.getAllByRole('heading')).toHaveLength(3);
		expect(screen.getByRole('heading', { name: 'Dois', level: 3 })).toContainElement(
			trigger('Dois'),
		);
		expect(trigger('Dois')).toHaveAttribute('aria-expanded', 'true');
		expect(trigger('Um')).toHaveAttribute('aria-expanded', 'false');
		const region = screen.getByRole('region', { name: 'Dois' });
		expect(region).toHaveTextContent('Conteúdo Dois');
		expect(trigger('Dois')).toHaveAttribute('aria-controls', region.id);
		expect(screen.getAllByRole('region')).toHaveLength(1);
	});

	it('uses the configured heading level without changing the others', () => {
		render(
			<AdsAccordion type="single">
				<AdsAccordion.Item value="a">
					<AdsAccordion.Header level={4}>
						<AdsAccordion.Trigger>Quatro</AdsAccordion.Trigger>
					</AdsAccordion.Header>
					<AdsAccordion.Panel>A</AdsAccordion.Panel>
				</AdsAccordion.Item>
				<AdsAccordion.Item value="b">
					<AdsAccordion.Header>
						<AdsAccordion.Trigger>Padrão</AdsAccordion.Trigger>
					</AdsAccordion.Header>
					<AdsAccordion.Panel>B</AdsAccordion.Panel>
				</AdsAccordion.Item>
			</AdsAccordion>,
		);
		expect(screen.getByRole('heading', { name: 'Quatro', level: 4 })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'Padrão', level: 3 })).toBeInTheDocument();
	});

	it('hides the decorative indicator and renders non-submit buttons', () => {
		renderAccordion();
		expect(trigger('Um').querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
		expect(trigger('Um')).toHaveAttribute('type', 'button');
	});

	it('generates valid and distinct ids for any item value', () => {
		render(
			<AdsAccordion defaultValue={['a b', 'a_b']} type="multiple">
				<Item title="Espaço" value="a b" />
				<Item title="Sublinhado" value="a_b" />
			</AdsAccordion>,
		);
		const ids = [trigger('Espaço').id, trigger('Sublinhado').id];
		expect(new Set(ids).size).toBe(2);
		for (const id of ids) {
			expect(id).toMatch(/^[A-Za-z0-9_-]+$/);
			expect(document.querySelector(`#${id}`)).not.toBeNull();
		}
		expect(screen.getByRole('region', { name: 'Espaço' })).toBeInTheDocument();
		expect(screen.getByRole('region', { name: 'Sublinhado' })).toBeInTheDocument();
	});
});

describe('AdsAccordion modes and state', () => {
	it('opens one item at a time in single mode', () => {
		renderAccordion({ type: 'single', defaultValue: 'one' });
		fireEvent.click(trigger('Dois'));
		expect(trigger('Dois')).toHaveAttribute('aria-expanded', 'true');
		expect(trigger('Um')).toHaveAttribute('aria-expanded', 'false');
	});

	it('keeps the open item open in single mode without collapsible', () => {
		renderAccordion({ type: 'single', defaultValue: 'one' });
		fireEvent.click(trigger('Um'));
		expect(trigger('Um')).toHaveAttribute('aria-expanded', 'true');
	});

	it('collapses the open item in single mode with collapsible', () => {
		const onValueChange = vi.fn();
		renderAccordion({ type: 'single', collapsible: true, defaultValue: 'one', onValueChange });
		fireEvent.click(trigger('Um'));
		expect(trigger('Um')).toHaveAttribute('aria-expanded', 'false');
		expect(onValueChange).toHaveBeenCalledWith('');
	});

	it('keeps several items open in multiple mode, each trigger closing only its item', () => {
		const onValueChange = vi.fn();
		renderAccordion({ type: 'multiple', onValueChange });
		fireEvent.click(trigger('Um'));
		fireEvent.click(trigger('Dois'));
		expect(trigger('Um')).toHaveAttribute('aria-expanded', 'true');
		expect(trigger('Dois')).toHaveAttribute('aria-expanded', 'true');
		expect(onValueChange).toHaveBeenLastCalledWith(['one', 'two']);
		fireEvent.click(trigger('Um'));
		expect(trigger('Um')).toHaveAttribute('aria-expanded', 'false');
		expect(trigger('Dois')).toHaveAttribute('aria-expanded', 'true');
		expect(onValueChange).toHaveBeenLastCalledWith(['two']);
	});

	it('accepts several initial items in multiple mode', () => {
		renderAccordion({ type: 'multiple', defaultValue: ['one', 'three'] });
		expect(screen.getAllByRole('region')).toHaveLength(2);
	});

	it('only changes appearance when the consumer updates a controlled value', () => {
		const onValueChange = vi.fn();
		const { rerender } = render(
			<AdsAccordion onValueChange={onValueChange} type="single" value="one">
				<Item title="Um" value="one" />
				<Item title="Dois" value="two" />
			</AdsAccordion>,
		);
		fireEvent.click(trigger('Dois'));
		expect(onValueChange).toHaveBeenCalledWith('two');
		expect(trigger('Um')).toHaveAttribute('aria-expanded', 'true');
		expect(trigger('Dois')).toHaveAttribute('aria-expanded', 'false');
		rerender(
			<AdsAccordion onValueChange={onValueChange} type="single" value="two">
				<Item title="Um" value="one" />
				<Item title="Dois" value="two" />
			</AdsAccordion>,
		);
		expect(trigger('Dois')).toHaveAttribute('aria-expanded', 'true');
	});

	it('toggles with Enter and Space on the native button', () => {
		renderAccordion({ type: 'multiple' });
		// jsdom does not synthesize a click from the keyboard, so this only checks that the keys are not swallowed.
		const first = trigger('Um');
		first.focus();
		const enter = fireEvent.keyDown(first, { key: 'Enter' });
		const space = fireEvent.keyDown(first, { key: ' ' });
		expect(enter).toBe(true);
		expect(space).toBe(true);
	});
});

describe('AdsAccordion keyboard', () => {
	it('keeps every enabled trigger in the tab order', () => {
		renderAccordion();
		for (const name of ['Um', 'Dois', 'Três'])
			expect(trigger(name)).not.toHaveAttribute('tabindex');
	});

	it('moves the focus between triggers without changing the state', () => {
		renderAccordion({ type: 'single', defaultValue: 'one' });
		trigger('Um').focus();
		fireEvent.keyDown(trigger('Um'), { key: 'ArrowDown' });
		expect(trigger('Dois')).toHaveFocus();
		fireEvent.keyDown(trigger('Dois'), { key: 'End' });
		expect(trigger('Três')).toHaveFocus();
		fireEvent.keyDown(trigger('Três'), { key: 'ArrowUp' });
		expect(trigger('Dois')).toHaveFocus();
		fireEvent.keyDown(trigger('Dois'), { key: 'Home' });
		expect(trigger('Um')).toHaveFocus();
		expect(trigger('Um')).toHaveAttribute('aria-expanded', 'true');
		expect(trigger('Dois')).toHaveAttribute('aria-expanded', 'false');
	});

	it('wraps around at the ends, like the tabs', () => {
		renderAccordion();
		trigger('Um').focus();
		fireEvent.keyDown(trigger('Um'), { key: 'ArrowUp' });
		expect(trigger('Três')).toHaveFocus();
		fireEvent.keyDown(trigger('Três'), { key: 'ArrowDown' });
		expect(trigger('Um')).toHaveFocus();
	});

	it('moves the focus only among the triggers of a nested accordion', () => {
		render(
			<AdsAccordion defaultValue="outer" type="single">
				<AdsAccordion.Item value="outer">
					<AdsAccordion.Header>
						<AdsAccordion.Trigger>Externo</AdsAccordion.Trigger>
					</AdsAccordion.Header>
					<AdsAccordion.Panel>
						<AdsAccordion defaultValue="a" type="single">
							<Item title="Interno A" value="a" />
							<Item title="Interno B" value="b" />
						</AdsAccordion>
					</AdsAccordion.Panel>
				</AdsAccordion.Item>
				<Item title="Irmão" value="sibling" />
			</AdsAccordion>,
		);
		trigger('Interno A').focus();
		fireEvent.keyDown(trigger('Interno A'), { key: 'ArrowDown' });
		expect(trigger('Interno B')).toHaveFocus();
		fireEvent.keyDown(trigger('Interno B'), { key: 'ArrowDown' });
		expect(trigger('Interno A')).toHaveFocus();
		fireEvent.keyDown(trigger('Interno A'), { key: 'End' });
		expect(trigger('Interno B')).toHaveFocus();
		trigger('Externo').focus();
		fireEvent.keyDown(trigger('Externo'), { key: 'ArrowDown' });
		expect(trigger('Irmão')).toHaveFocus();
	});
});

describe('AdsAccordion disabled items', () => {
	it('does not open or close a disabled item and exposes it as disabled', () => {
		render(
			<AdsAccordion defaultValue="two" type="multiple">
				<Item disabled title="Um" value="one" />
				<Item disabled title="Dois" value="two" />
			</AdsAccordion>,
		);
		expect(trigger('Um')).toBeDisabled();
		fireEvent.click(trigger('Um'));
		fireEvent.click(trigger('Dois'));
		expect(trigger('Um')).toHaveAttribute('aria-expanded', 'false');
		expect(trigger('Dois')).toHaveAttribute('aria-expanded', 'true');
	});

	it('skips disabled triggers in the arrow, Home and End navigation', () => {
		render(
			<AdsAccordion type="single">
				<Item disabled title="Um" value="one" />
				<Item title="Dois" value="two" />
				<Item disabled title="Três" value="three" />
				<Item title="Quatro" value="four" />
				<Item disabled title="Cinco" value="five" />
			</AdsAccordion>,
		);
		trigger('Dois').focus();
		fireEvent.keyDown(trigger('Dois'), { key: 'ArrowDown' });
		expect(trigger('Quatro')).toHaveFocus();
		fireEvent.keyDown(trigger('Quatro'), { key: 'Home' });
		expect(trigger('Dois')).toHaveFocus();
		fireEvent.keyDown(trigger('Dois'), { key: 'End' });
		expect(trigger('Quatro')).toHaveFocus();
	});
});

describe('AdsAccordion panel mounting', () => {
	it('keeps a closed panel in the document, hidden, and preserves its state', () => {
		render(
			<AdsAccordion collapsible type="single">
				<AdsAccordion.Item value="form">
					<AdsAccordion.Header>
						<AdsAccordion.Trigger>Formulário</AdsAccordion.Trigger>
					</AdsAccordion.Header>
					<AdsAccordion.Panel>
						<input aria-label="Nome" />
					</AdsAccordion.Panel>
				</AdsAccordion.Item>
			</AdsAccordion>,
		);
		const input = screen.getByLabelText('Nome');
		expect(input.closest('[role="region"]')).toHaveAttribute('hidden');
		expect(screen.queryByRole('region')).toBeNull();
		fireEvent.click(trigger('Formulário'));
		expect(screen.getByRole('region', { name: 'Formulário' })).toBeInTheDocument();
		fireEvent.change(input, { target: { value: 'Ana' } });
		fireEvent.click(trigger('Formulário'));
		expect(input.closest('[role="region"]')).toHaveAttribute('hidden');
		expect(screen.queryByRole('region')).toBeNull();
		fireEvent.click(trigger('Formulário'));
		expect(screen.getByLabelText('Nome')).toBe(input);
		expect(input).toHaveValue('Ana');
	});

	it('removes the closed panel with unmountOnCollapse, and the trigger stops referencing it', () => {
		renderAccordion({
			type: 'single',
			collapsible: true,
			defaultValue: 'one',
			unmountOnCollapse: true,
		});
		expect(screen.getByRole('region', { name: 'Um' })).toBeInTheDocument();
		expect(trigger('Um')).toHaveAttribute('aria-controls');
		expect(trigger('Dois')).not.toHaveAttribute('aria-controls');
		expect(screen.queryByText('Conteúdo Dois')).toBeNull();
		fireEvent.click(trigger('Um'));
		expect(screen.queryByText('Conteúdo Um')).toBeNull();
		expect(trigger('Um')).not.toHaveAttribute('aria-controls');
	});

	it('lets an item override unmountOnCollapse of the root', () => {
		render(
			<AdsAccordion type="multiple" unmountOnCollapse>
				<Item title="Um" unmountOnCollapse={false} value="one" />
				<Item title="Dois" value="two" />
			</AdsAccordion>,
		);
		expect(
			document.getElementById(trigger('Um').getAttribute('aria-controls') ?? ''),
		).toHaveAttribute('hidden');
		expect(trigger('Dois')).not.toHaveAttribute('aria-controls');
		expect(screen.queryByText('Conteúdo Dois')).toBeNull();
	});
});

describe('AdsAccordion styles', () => {
	it('uses the public focus and surface tokens and respects reduced motion', () => {
		renderAccordion({ type: 'single', defaultValue: 'one' });
		expect(trigger('Um')).toHaveClass(
			'text-text',
			'hover:bg-surface-hover',
			'focus-visible:outline-focus-ring',
			'disabled:text-text-muted',
		);
		expect(trigger('Um').querySelector('svg')).toHaveClass(
			'rotate-180',
			'motion-reduce:transition-none',
		);
		expect(trigger('Dois').querySelector('svg')).not.toHaveClass('rotate-180');
		expect(trigger('Um').closest('.ads-accordion')).toHaveClass('border-border', 'bg-surface');
	});
});

describe('AdsAccordion on the server', () => {
	it('renders from a function component without a client boundary, with an open item', () => {
		function Page() {
			return (
				<AdsAccordion defaultValue="one" type="single">
					<Item title="Um" value="one" />
					<Item title="Dois" value="two" />
				</AdsAccordion>
			);
		}
		const html = renderToString(<Page />);
		expect(html).toContain('aria-expanded="true"');
		expect(html).toContain('Conteúdo <!-- -->Um');
		expect(html).toContain('hidden');
	});
});

describe('AdsAccordion locked item', () => {
	it('marks the open item of a single accordion that cannot collapse as aria-disabled', () => {
		renderAccordion({ type: 'single', defaultValue: 'one' });
		expect(trigger('Um')).toHaveAttribute('aria-disabled', 'true');
		expect(trigger('Dois')).not.toHaveAttribute('aria-disabled');
	});

	it('does not mark it when the item can collapse or the mode is multiple', () => {
		const { unmount } = renderAccordion({ type: 'single', collapsible: true, defaultValue: 'one' });
		expect(trigger('Um')).not.toHaveAttribute('aria-disabled');
		unmount();
		renderAccordion({ type: 'multiple', defaultValue: ['one'] });
		expect(trigger('Um')).not.toHaveAttribute('aria-disabled');
	});

	it('keeps the panel free of display utilities, which would defeat the hidden attribute', () => {
		renderAccordion({ type: 'single' });
		const panel = document.getElementById(trigger('Um').getAttribute('aria-controls') ?? '');
		expect(panel).toHaveAttribute('hidden');
		expect(panel?.className).not.toMatch(/(^|\s)(block|flex|grid|inline|contents)(\s|$)/);
	});
});

describe('AdsAccordion named parts', () => {
	it('composes from the named exports, for Server Components', () => {
		render(
			<AdsAccordion defaultValue="a" type="single">
				<AdsAccordionItem value="a">
					<AdsAccordionHeader>
						<AdsAccordionTrigger>Nomeado</AdsAccordionTrigger>
					</AdsAccordionHeader>
					<AdsAccordionPanel>Conteúdo nomeado</AdsAccordionPanel>
				</AdsAccordionItem>
			</AdsAccordion>,
		);
		expect(trigger('Nomeado')).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByRole('region', { name: 'Nomeado' })).toBeInTheDocument();
		expect(AdsAccordionItem).toBe(AdsAccordion.Item);
	});
});

describe('AdsAccordion references and mode changes', () => {
	it('stops referencing a panel that the consumer removes', async () => {
		function Example({ withPanel }: { withPanel: boolean }) {
			return (
				<AdsAccordion defaultValue="a" type="single">
					<AdsAccordion.Item value="a">
						<AdsAccordion.Header>
							<AdsAccordion.Trigger>Item</AdsAccordion.Trigger>
						</AdsAccordion.Header>
						{withPanel ? <AdsAccordion.Panel>Conteúdo</AdsAccordion.Panel> : null}
					</AdsAccordion.Item>
				</AdsAccordion>
			);
		}
		const { rerender } = render(<Example withPanel />);
		const controls = trigger('Item').getAttribute('aria-controls');
		expect(document.getElementById(controls ?? '')).toHaveTextContent('Conteúdo');
		rerender(<Example withPanel={false} />);
		await act(async () => undefined);
		expect(trigger('Item')).not.toHaveAttribute('aria-controls');
	});

	it('keeps at most one item open when a multiple accordion becomes single', () => {
		const items = (
			<>
				<Item title="Um" value="one" />
				<Item title="Dois" value="two" />
			</>
		);
		const { rerender } = render(
			<AdsAccordion defaultValue={['one', 'two']} type="multiple">
				{items}
			</AdsAccordion>,
		);
		expect(screen.getAllByRole('region')).toHaveLength(2);
		rerender(
			<AdsAccordion collapsible type="single">
				{items}
			</AdsAccordion>,
		);
		expect(screen.getAllByRole('region')).toHaveLength(1);
		expect(trigger('Um')).toHaveAttribute('aria-expanded', 'true');
		expect(trigger('Dois')).toHaveAttribute('aria-expanded', 'false');
		fireEvent.click(trigger('Dois'));
		expect(trigger('Dois')).toHaveAttribute('aria-expanded', 'true');
		expect(trigger('Um')).toHaveAttribute('aria-expanded', 'false');
	});
});
