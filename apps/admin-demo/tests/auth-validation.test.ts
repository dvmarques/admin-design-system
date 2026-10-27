import { describe, expect, it } from 'vitest';
import { emailPattern, isValidEmail } from '../lib/auth-demo';

describe('auth-demo validation', () => {
	it('accepts common valid e-mails', () => {
		expect(isValidEmail('nome@exemplo.com.br')).toBe(true);
		expect(emailPattern.test('a@b.co')).toBe(true);
	});

	it('rejects empty or malformed e-mails', () => {
		expect(isValidEmail('')).toBe(false);
		expect(isValidEmail('abc')).toBe(false);
		expect(isValidEmail('a@b')).toBe(false);
	});
});
