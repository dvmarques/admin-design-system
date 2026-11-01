import type { Metadata } from 'next';
import { LoginForm } from '../../auth/login-form';

export const metadata: Metadata = {
	title: 'Login — Admin Design System Demo',
	description: 'Exemplo demonstrativo de login sem backend',
};

export default function LoginPage() {
	return <LoginForm />;
}
