import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-4 text-6xl font-bold">
          🏗️ RASCACIELO DIGITAL ∞
        </h1>
        <p className="mb-8 text-xl text-slate-300">
          SaaS production-ready de clase mundial con arquitectura post-quantum
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-white px-8 py-3 text-lg font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/signup"
            className="rounded-lg border-2 border-white px-8 py-3 text-lg font-semibold transition hover:bg-white hover:text-slate-900"
          >
            Registrarse
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <div className="mb-2 text-3xl">🔐</div>
            <h3 className="mb-2 text-lg font-semibold">Post-Quantum Security</h3>
            <p className="text-sm text-slate-400">
              Kyber-1024 encryption con rotación cada 11 minutos
            </p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <div className="mb-2 text-3xl">⚡</div>
            <h3 className="mb-2 text-lg font-semibold">Next.js 16+</h3>
            <p className="text-sm text-slate-400">
              App Router con Server Components y Server Actions
            </p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <div className="mb-2 text-3xl">💰</div>
            <h3 className="mb-2 text-lg font-semibold">Stripe + Solana</h3>
            <p className="text-sm text-slate-400">
              Pagos integrados con webhooks y facturación automática
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
