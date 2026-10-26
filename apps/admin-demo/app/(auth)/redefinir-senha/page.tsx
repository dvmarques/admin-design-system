import type { Metadata } from 'next';
import { ResetPasswordForm } from '../../auth/reset-password-form';

export const metadata: Metadata = {
	title: 'Redefinir senha — Admin Design System Demo',
	description: 'Exemplo demonstrativo de redefinição de senha sem backend',
};

export default function ResetPasswordPage() {
	return <ResetPasswordForm />;
}
