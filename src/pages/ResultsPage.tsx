import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  Save, 
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

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { history, settings } = useApp();

  const result = history.find(h => h.id === id);

  if (!result) {
    return (
      <MainLayout>
        <div className="min-h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Result not found</h1>
            <Button onClick={() => navigate('/home')}>Go Home</Button>
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
        // User cancelled or error
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
        The health score is ${result.health.score} percent, which is ${result.health.status}.
        The estimated market price is ${result.price.estimated} rupees.`;
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
      toast({ title: 'Playing audio...' });
    }
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
                onClick={() => navigate('/home')}
                className="rounded-xl"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Scan Results</h1>
                <p className="text-muted-foreground">
                  {new Date(result.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Image Preview */}
          <div className="mb-8 rounded-2xl overflow-hidden bg-card shadow-soft animate-fade-in-up">
            <div className="aspect-video flex items-center justify-center bg-muted">
              {result.imageUrl !== '/placeholder.svg' ? (
                <img src={result.imageUrl} alt="Scanned cattle" className="w-full h-full object-cover" />
              ) : (
                <span className="text-8xl">🐄</span>
              )}
            </div>
          </div>

          {/* Result Cards Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {/* Breed Card */}
            <div className="result-card animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Breed Detection</p>
                  <h3 className="text-xl font-bold text-foreground">{result.breed.name}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${result.breed.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-primary">{result.breed.confidence}%</span>
              </div>
            </div>

            {/* Animal Type Card */}
            <div className="result-card animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <Tag className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Animal Type</p>
                  <h3 className="text-xl font-bold text-foreground">
                    {ANIMAL_TYPE_LABELS[result.animalType]}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Identified as {ANIMAL_TYPE_LABELS[result.animalType].toLowerCase()}
              </p>
            </div>

            {/* Health Score Card */}
            <div className="result-card animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Health Score</p>
                  <h3 className="text-xl font-bold text-foreground">{result.health.score}/100</h3>
                </div>
              </div>
              <div className="health-meter">
                <div className={`health-meter-fill ${healthColor}`} style={{ width: `${result.health.score}%` }} />
              </div>
              <p className={`text-sm mt-2 font-medium capitalize text-health-${result.health.status}`}>
                {result.health.status}
              </p>
            </div>

            {/* Weight Card */}
            <div className="result-card animate-fade-in-up" style={{ animationDelay: '250ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weight Estimation</p>
                  <h3 className="text-xl font-bold text-foreground">{result.weight.estimated} kg</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Range: {result.weight.range.min} - {result.weight.range.max} kg
              </p>
            </div>

            {/* Price Card */}
            <div className="result-card animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price Estimation</p>
                  <h3 className="text-xl font-bold text-foreground">
                    ₹{result.price.estimated.toLocaleString()}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Range: ₹{result.price.range.min.toLocaleString()} - ₹{result.price.range.max.toLocaleString()}
              </p>
            </div>

            {/* Feed Recommendation Card */}
            <div className="result-card animate-fade-in-up" style={{ animationDelay: '350ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Feed Recommendation</p>
                  <h3 className="text-lg font-bold text-foreground">{result.feed.daily}</h3>
                </div>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                {result.feed.recommendations.slice(0, 3).map((rec, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Health Notes */}
          {result.health.notes.length > 0 && (
            <div className="result-card mb-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <h3 className="font-semibold text-foreground mb-4">Health Notes</h3>
              <ul className="space-y-2">
                {result.health.notes.map((note, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className={`w-2 h-2 mt-2 rounded-full ${healthColor} flex-shrink-0`} />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '450ms' }}>
            <Button
              variant="outline"
              onClick={() => toast({ title: 'Result saved!' })}
              className="gap-2 rounded-xl px-6"
            >
              <Save className="w-5 h-5" />
              Save Result
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="gap-2 rounded-xl px-6"
            >
              <Share2 className="w-5 h-5" />
              Share
            </Button>
            <Button
              onClick={handleSpeak}
              className="gap-2 rounded-xl px-6"
            >
              <Volume2 className="w-5 h-5" />
              Listen
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
