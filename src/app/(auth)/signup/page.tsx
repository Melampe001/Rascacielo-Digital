import { SignupForm } from '@/components/auth/signup-form';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function SignupPage() {
  return (
    <div className="space-y-6 p-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-white">Crear Cuenta</h1>
        <p className="text-slate-400">Únete a Rascacielo Digital hoy</p>
      </div>
      <SignupForm />
      <p className="text-center text-sm text-slate-400">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-white hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
