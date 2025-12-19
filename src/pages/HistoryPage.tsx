import { Link } from 'react-router-dom';
import { ChevronRight, Camera, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/MainLayout';
import { useApp } from '@/context/AppContext';
import { ANIMAL_TYPE_LABELS } from '@/types/livestock';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function HistoryPage() {
  const { history, clearHistory } = useApp();

  return (
    <MainLayout>
      <div className="min-h-full natural-gradient p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Scan History</h1>
              <p className="text-muted-foreground">{history.length} scans saved</p>
            </div>
            {history.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your scan history. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearHistory}>Delete All</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* History List */}
          {history.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <span className="text-5xl">📋</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">No scans yet</h2>
              <p className="text-muted-foreground mb-6">
                Start by scanning your first cattle
              </p>
              <Link to="/scan">
                <Button className="gap-2 rounded-xl">
                  <Camera className="w-5 h-5" />
                  Scan Now
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((scan, index) => {
                const healthColor = 
                  scan.health.status === 'good' ? 'bg-health-good' :
                  scan.health.status === 'moderate' ? 'bg-health-moderate' : 'bg-health-poor';

                return (
                  <Link
                    key={scan.id}
                    to={`/history/${scan.id}`}
                    className="result-card flex items-center gap-4 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                      {scan.imageUrl !== '/placeholder.svg' ? (
                        <img src={scan.imageUrl} alt="Cattle" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl">🐄</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{scan.breed.name}</h3>
                        <span className="text-sm text-muted-foreground">
                          • {ANIMAL_TYPE_LABELS[scan.animalType]}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>⚖️ {scan.weight.estimated} kg</span>
                        <span>💰 ₹{scan.price.estimated.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(scan.timestamp).toLocaleDateString()} at{' '}
                        {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* Health Indicator */}
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${healthColor}`} />
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
