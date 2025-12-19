import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  Trash2, 
  Volume2, 
  Heart, 
  Scale, 
  Tag, 
  Leaf,
  IndianRupee,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/MainLayout';
import { useApp } from '@/context/AppContext';
import { ANIMAL_TYPE_LABELS } from '@/types/livestock';
import { toast } from '@/hooks/use-toast';
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

export default function HistoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { history, removeFromHistory } = useApp();

  const result = history.find(h => h.id === id);

  if (!result) {
    return (
      <MainLayout>
        <div className="min-h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Result not found</h1>
            <Button onClick={() => navigate('/history')}>Go to History</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleShare = async () => {
    const shareText = `AI Livestock Scan Result:\n🐄 Breed: ${result.breed.name}\n⚖️ Weight: ${result.weight.estimated}kg\n💰 Price: ₹${result.price.estimated.toLocaleString()}\n❤️ Health: ${result.health.score}%`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Cattle Scan Result', text: shareText });
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast({ title: 'Copied to clipboard!' });
    }
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const text = `This is a ${result.breed.name} ${ANIMAL_TYPE_LABELS[result.animalType]}. 
        The estimated weight is ${result.weight.estimated} kilograms.
        The health score is ${result.health.score} percent.
        The estimated market price is ${result.price.estimated} rupees.`;
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const handleDelete = () => {
    removeFromHistory(result.id);
    toast({ title: 'Scan deleted' });
    navigate('/history');
  };

  const healthColor = 
    result.health.status === 'good' ? 'bg-health-good' :
    result.health.status === 'moderate' ? 'bg-health-moderate' : 'bg-health-poor';

  return (
    <MainLayout>
      <div className="min-h-full natural-gradient p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/history')}
                className="rounded-xl"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{result.breed.name}</h1>
                <p className="text-muted-foreground">
                  {new Date(result.timestamp).toLocaleDateString()} at{' '}
                  {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-xl text-destructive">
                  <Trash2 className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this scan?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this scan result. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Image */}
          <div className="mb-8 rounded-2xl overflow-hidden bg-card shadow-soft">
            <div className="aspect-video flex items-center justify-center bg-muted">
              {result.imageUrl !== '/placeholder.svg' ? (
                <img src={result.imageUrl} alt="Scanned cattle" className="w-full h-full object-cover" />
              ) : (
                <span className="text-8xl">🐄</span>
              )}
            </div>
          </div>

          {/* Result Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {/* Breed */}
            <div className="result-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Breed</p>
                  <h3 className="text-xl font-bold text-foreground">{result.breed.name}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${result.breed.confidence}%` }} />
                </div>
                <span className="text-sm font-medium text-primary">{result.breed.confidence}%</span>
              </div>
            </div>

            {/* Type */}
            <div className="result-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <Tag className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <h3 className="text-xl font-bold text-foreground">{ANIMAL_TYPE_LABELS[result.animalType]}</h3>
                </div>
              </div>
            </div>

            {/* Health */}
            <div className="result-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Health</p>
                  <h3 className="text-xl font-bold text-foreground">{result.health.score}/100</h3>
                </div>
              </div>
              <div className="health-meter">
                <div className={`health-meter-fill ${healthColor}`} style={{ width: `${result.health.score}%` }} />
              </div>
            </div>

            {/* Weight */}
            <div className="result-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <h3 className="text-xl font-bold text-foreground">{result.weight.estimated} kg</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Range: {result.weight.range.min} - {result.weight.range.max} kg
              </p>
            </div>

            {/* Price */}
            <div className="result-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <h3 className="text-xl font-bold text-foreground">₹{result.price.estimated.toLocaleString()}</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                ₹{result.price.range.min.toLocaleString()} - ₹{result.price.range.max.toLocaleString()}
              </p>
            </div>

            {/* Feed */}
            <div className="result-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Feed</p>
                  <h3 className="text-lg font-bold text-foreground">{result.feed.daily}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" onClick={handleShare} className="gap-2 rounded-xl px-6">
              <Share2 className="w-5 h-5" />
              Share
            </Button>
            <Button onClick={handleSpeak} className="gap-2 rounded-xl px-6">
              <Volume2 className="w-5 h-5" />
              Listen
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
