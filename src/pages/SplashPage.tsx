import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

export default function SplashPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center natural-gradient relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 right-20 opacity-20">
          <Leaf className="w-24 h-24 text-primary" />
        </div>
        <div className="absolute bottom-1/3 left-16 opacity-10 rotate-45">
          <Leaf className="w-16 h-16 text-primary" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 animate-fade-in-up">
        {/* Logo */}
        <div className="mb-8 relative">
          <div className="w-40 h-40 mx-auto rounded-full bg-card shadow-soft-lg flex items-center justify-center relative">
            <span className="text-7xl">🐄</span>
            {/* AI Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse-slow" />
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          AI Livestock
          <span className="block text-primary">Scanner</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl text-muted-foreground mb-12 max-w-md mx-auto">
          Smart AI for Your Cattle
        </p>

        {/* Get Started Button */}
        <Button
          onClick={() => navigate('/language')}
          size="lg"
          className="px-12 py-6 text-lg rounded-2xl shadow-glow hover:shadow-soft-lg transition-all hover:scale-105"
        >
          Get Started
        </Button>

        {/* Features hint */}
        <div className="mt-16 flex justify-center gap-8 text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-card shadow-soft flex items-center justify-center">
              <span className="text-2xl">📷</span>
            </div>
            <span className="text-sm">Scan</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-card shadow-soft flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <span className="text-sm">Analyze</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-card shadow-soft flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <span className="text-sm">Results</span>
          </div>
        </div>
      </div>
    </div>
  );
}
