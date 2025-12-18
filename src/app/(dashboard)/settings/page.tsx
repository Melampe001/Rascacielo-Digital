import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-600">Configura tu cuenta y preferencias</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre Completo</label>
              <p className="text-slate-600">Usuario Demo</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-slate-600">demo@rascacielo.digital</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">🔐 Post-Quantum Kyber-1024 encryption activa</p>
          <p className="text-xs text-slate-500 mt-2">Rotación de claves cada 11 minutos</p>
        </CardContent>
      </Card>
    </div>
  );
}
