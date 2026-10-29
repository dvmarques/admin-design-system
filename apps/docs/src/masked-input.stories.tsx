import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AdsButton, AdsField } from '@admin-ds/components';
import { AdsMaskedInput, type AdsMaskedInputValues } from '@admin-ds/components/masked-input';

const meta = {
	title: 'Forms/Masked input',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'AdsMaskedInput formata o texto durante a digitação, a colagem e a remoção, preservando caret, seleção e composição IME. Fica no subpath opcional `@admin-ds/components/masked-input` e exige o peer opcional `react-imask`; o entrypoint principal nunca o carrega. `value` e `defaultValue` representam o texto formatado exibido; `onValueChange` informa `maskedValue`, `unmaskedValue` (sempre string, com zeros à esquerda), `typedValue` e `complete`. `onChange` continua sendo o evento nativo do input e não é sintetizado a cada alteração aceita. Todos os dados desta página são fictícios.',
			},
		},
	},
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const phoneMasks = ['(00) 0000-0000', '(00) 00000-0000'] as const;

function Values({ values }: { values: AdsMaskedInputValues | undefined }) {
	return (
		<dl className="m-0 grid gap-1 text-sm">
			<div>
				<dt className="inline font-medium">Formatado: </dt>
				<dd className="m-0 inline">{values ? values.maskedValue : '—'}</dd>
			</div>
			<div>
				<dt className="inline font-medium">Bruto: </dt>
				<dd className="m-0 inline">{values ? values.unmaskedValue : '—'}</dd>
			</div>
			<div>
				<dt className="inline font-medium">Completo: </dt>
				<dd className="m-0 inline">{values ? (values.complete ? 'sim' : 'não') : '—'}</dd>
			</div>
		</dl>
	);
}

export const StaticMask: Story = {
	render: () => {
		function Example() {
			const [values, setValues] = useState<AdsMaskedInputValues>();
			return (
				<div className="flex max-w-sm flex-col gap-3">
					<AdsField description="Seis dígitos no padrão 000-000." label="Código de exemplo">
						<AdsMaskedInput
							inputMode="numeric"
							mask="000-000"
							onValueChange={setValues}
							placeholder="000-000"
						/>
					</AdsField>
					<Values values={values} />
				</div>
			);
		}
		return <Example />;
	},
};

export const DynamicMask: Story = {
	render: () => {
		function Example() {
			const [values, setValues] = useState<AdsMaskedInputValues>();
			return (
				<div className="flex max-w-sm flex-col gap-3">
					<AdsField
						description="Alterna entre 8 e 9 dígitos conforme o texto cresce."
						label="Telefone fictício"
					>
						<AdsMaskedInput
							inputMode="tel"
							mask={phoneMasks}
							onValueChange={setValues}
							placeholder="(00) 00000-0000"
						/>
					</AdsField>
					<Values values={values} />
				</div>
			);
		}
		return <Example />;
	},
};

export const NumericMask: Story = {
	render: () => {
		function Example() {
			const [values, setValues] = useState<AdsMaskedInputValues>();
			return (
				<div className="flex max-w-sm flex-col gap-3">
					<AdsField
						description="typedValue é um número; o valor bruto continua sendo texto."
						label="Quantia fictícia"
					>
						<AdsMaskedInput
							inputMode="decimal"
							mask={{
								mask: Number,
								scale: 2,
								radix: ',',
								thousandsSeparator: '.',
								mapToRadix: ['.'],
							}}
							onValueChange={setValues}
						/>
					</AdsField>
					<Values values={values} />
					<p className="m-0 text-sm">
						typedValue: {typeof values?.typedValue === 'number' ? String(values.typedValue) : '—'}
					</p>
				</div>
			);
		}
		return <Example />;
	},
};

export const LeadingZeros: Story = {
	render: () => (
		<div className="flex max-w-sm flex-col gap-3">
			<AdsField description="O valor bruto preserva os zeros à esquerda." label="Protocolo">
				<AdsMaskedInput defaultValue="000123" inputMode="numeric" mask="000000" />
			</AdsField>
		</div>
	),
};

export const WithoutMask: Story = {
	render: () => {
		function Example() {
			const [values, setValues] = useState<AdsMaskedInputValues>();
			return (
				<div className="flex max-w-sm flex-col gap-3">
					<AdsField description="Sem `mask`, o campo é um input de texto comum." label="Observação">
						<AdsMaskedInput onValueChange={setValues} placeholder="Texto livre" />
					</AdsField>
					<Values values={values} />
				</div>
			);
		}
		return <Example />;
	},
};

export const ControlledAndUncontrolled: Story = {
	render: () => {
		function Example() {
			const [value, setValue] = useState('123-4');
			return (
				<div className="flex max-w-sm flex-col gap-4">
					<AdsField description="O estado é do consumidor." label="Controlado">
						<AdsMaskedInput
							mask="000-000"
							onValueChange={(values) => setValue(values.maskedValue)}
							value={value}
						/>
					</AdsField>
					<div className="flex gap-2">
						<AdsButton onClick={() => setValue('987654')} type="button" variant="secondary">
							Definir 987-654
						</AdsButton>
						<AdsButton onClick={() => setValue('')} type="button" variant="secondary">
							Limpar
						</AdsButton>
					</div>
					<p className="m-0 text-sm">
						Alterações externas atualizam o texto sem chamar onValueChange.
					</p>
					<AdsField description="O texto inicial é formatado na montagem." label="Não controlado">
						<AdsMaskedInput defaultValue="123456" mask="000-000" />
					</AdsField>
				</div>
			);
		}
		return <Example />;
	},
};

export const FormIntegration: Story = {
	render: () => {
		function Example() {
			const [complete, setComplete] = useState(false);
			const [touched, setTouched] = useState(false);
			const [submitted, setSubmitted] = useState<string>();
			const invalid = touched && !complete;
			return (
				<form
					className="flex max-w-sm flex-col gap-3"
					noValidate
					onSubmit={(event) => {
						event.preventDefault();
						setTouched(true);
						if (complete)
							setSubmitted(String(new FormData(event.currentTarget).get('codigo') ?? ''));
					}}
				>
					<AdsField
						description="`required` é nativo; a completude vem de onValueChange."
						error={invalid ? 'Preencha os seis dígitos.' : undefined}
						label="Código de exemplo"
						validationState={invalid ? 'error' : 'default'}
					>
						<AdsMaskedInput
							inputMode="numeric"
							mask="000-000"
							name="codigo"
							onBlur={() => setTouched(true)}
							onValueChange={(values) => setComplete(values.complete)}
							required
						/>
					</AdsField>
					<AdsButton type="submit">Enviar</AdsButton>
					<p aria-live="polite" className="m-0 text-sm">
						{submitted ? `Enviado o texto formatado: ${submitted}` : 'Nada enviado.'}
					</p>
				</form>
			);
		}
		return <Example />;
	},
};

export const States: Story = {
	render: () => (
		<div className="flex max-w-sm flex-col gap-4">
			<AdsField label="Desabilitado">
				<AdsMaskedInput defaultValue="123456" disabled mask="000-000" />
			</AdsField>
			<AdsField label="Somente leitura">
				<AdsMaskedInput defaultValue="123456" mask="000-000" readOnly />
			</AdsField>
			<AdsField error="Valor incompleto" label="Inválido" validationState="error">
				<AdsMaskedInput defaultValue="123" mask="000-000" />
			</AdsField>
			<AdsField label="Válido" validationState="success">
				<AdsMaskedInput defaultValue="123456" mask="000-000" />
			</AdsField>
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<AdsField key={size} label={`Tamanho ${size}`}>
					<AdsMaskedInput mask="000-000" placeholder="000-000" size={size} />
				</AdsField>
			))}
		</div>
	),
};
