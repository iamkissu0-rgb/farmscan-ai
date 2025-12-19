import { Link } from 'react-router-dom';
import { Camera, Mic, History, Users, ChevronRight, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/MainLayout';
import { useApp } from '@/context/AppContext';

export default function HomePage() {
  const { history } = useApp();

  const quickActions = [
    {
      icon: Mic,
      label: 'Voice Assistant',
      description: 'Speak commands',
      path: '/voice',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: History,
      label: 'View History',
      description: `${history.length} scans saved`,
      path: '/history',
      color: 'bg-accent text-accent-foreground',
    },
    {
      icon: Users,
      label: 'Cattle Profiles',
      description: 'Manage your herd',
      path: '/history',
      color: 'bg-secondary text-secondary-foreground',
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-full natural-gradient relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-40 -left-20 w-48 h-48 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-40 right-10 opacity-10">
            <Leaf className="w-32 h-32 text-primary rotate-45" />
          </div>
        </div>

        <div className="relative z-10 p-6 lg:p-10 max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-10 animate-fade-in-up">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Welcome, Farmer! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              Scan your cattle with AI-powered analysis
            </p>
          </div>

          {/* Main Scan Button */}
          <div className="mb-12 text-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <Link to="/scan">
              <button className="scan-button w-48 h-48 lg:w-56 lg:h-56 mx-auto flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform">
                <Camera className="w-16 h-16 lg:w-20 lg:h-20" />
                <span className="text-xl lg:text-2xl font-bold">Scan Cattle</span>
              </button>
            </Link>
            <p className="mt-6 text-muted-foreground">
              Take a photo of your cattle for instant AI analysis
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.path + action.label}
                    to={action.path}
                    className="result-card flex items-center gap-4 animate-fade-in-up"
                    style={{ animationDelay: `${(index + 2) * 100}ms` }}
                  >
                    <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{action.label}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Scans Preview */}
          {history.length > 0 && (
            <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Recent Scans</h2>
                <Link to="/history" className="text-primary font-medium flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {history.slice(0, 2).map((scan) => (
                  <Link
                    key={scan.id}
                    to={`/history/${scan.id}`}
                    className="result-card flex items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                      {scan.imageUrl !== '/placeholder.svg' ? (
                        <img src={scan.imageUrl} alt="Cattle" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl">🐄</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{scan.breed.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {scan.weight.estimated} kg • {new Date(scan.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full bg-health-${scan.health.status}`} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tips Section */}
          <div className="mt-10 p-6 rounded-2xl bg-primary/5 border border-primary/10 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Pro Tip</h3>
                <p className="text-muted-foreground">
                  For best results, take a clear side-angle photo of your cattle in good lighting conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
