import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-slate-600">
          Manage tu suscripción y métodos de pago
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Plan Básico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">$9.99</div>
              <p className="text-sm text-slate-600">por mes</p>
              <ul className="space-y-1 text-sm">
                <li>✓ 10 proyectos</li>
                <li>✓ 1 GB storage</li>
                <li>✓ Soporte básico</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500 bg-blue-50">
          <CardHeader>
            <CardTitle>Plan Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">$29.99</div>
              <p className="text-sm text-slate-600">por mes</p>
              <ul className="space-y-1 text-sm">
                <li>✓ Proyectos ilimitados</li>
                <li>✓ 10 GB storage</li>
                <li>✓ Soporte prioritario</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan Enterprise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">$99.99</div>
              <p className="text-sm text-slate-600">por mes</p>
              <ul className="space-y-1 text-sm">
                <li>✓ Todo ilimitado</li>
                <li>✓ 100 GB storage</li>
                <li>✓ Soporte 24/7</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
