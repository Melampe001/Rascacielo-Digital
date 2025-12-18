import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="space-y-6 p-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-white">Iniciar Sesión</h1>
        <p className="text-slate-400">Accede a tu cuenta de Rascacielo Digital</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-slate-400">
        ¿No tienes cuenta?{' '}
        <Link href="/signup" className="text-white hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
