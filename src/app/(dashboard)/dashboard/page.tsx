import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-600">
          Bienvenido a Rascacielo Digital
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Revenue Total"
          value="$45,231"
          change="+20.1%"
          trend="up"
        />
        <StatsCard
          title="Suscripciones"
          value="2,350"
          change="+180"
          trend="up"
        />
        <StatsCard
          title="Tasa de Conversión"
          value="12.5%"
          change="+4.75%"
          trend="up"
        />
        <StatsCard
          title="Churn Rate"
          value="2.4%"
          change="-0.5%"
          trend="down"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center text-slate-400">
              [Revenue Chart Component]
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-full bg-slate-200"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Usuario {i}</p>
                    <p className="text-xs text-slate-500">
                      Acción realizada hace {i}h
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
