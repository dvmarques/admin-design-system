import type { Metadata } from 'next';
import { ForgotPasswordForm } from '../../auth/forgot-password-form';

export const metadata: Metadata = {
	title: 'Recuperar senha — Admin Design System Demo',
	description: 'Exemplo demonstrativo de recuperação de senha sem backend',
};

export default function ForgotPasswordPage() {
	return <ForgotPasswordForm />;
}
