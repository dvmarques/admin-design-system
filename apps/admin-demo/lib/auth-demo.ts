/** Local part, `@` and a domain with at least one dot, without spaces. */
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const invalidEmailMessage = 'Informe um e-mail válido, como nome@exemplo.com.br.';
export const requiredEmailMessage = 'Informe o e-mail.';
export const requiredPasswordMessage = 'Informe a senha.';
export const passwordMismatchMessage = 'As senhas não coincidem.';
export const passwordRulesMessage = 'Atenda todos os requisitos da senha antes de continuar.';
export const demoAuthNotice =
	'Demonstração sem backend: nenhuma credencial é validada nem armazenada.';

export function isValidEmail(value: string): boolean {
	const trimmed = value.trim();
	return trimmed !== '' && emailPattern.test(trimmed);
}

/** Simulated login delay so loading state is visible in the demo. */
export const simulatedAuthDelayMs = 400;
