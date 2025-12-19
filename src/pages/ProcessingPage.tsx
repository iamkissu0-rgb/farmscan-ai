import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { generateMockResult } from '@/data/mockData';

export default function ProcessingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToHistory } = useApp();
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  const imageUrl = location.state?.imageUrl || '/placeholder.svg';

  const stages = [
    'Detecting cattle...',
    'Analyzing breed...',
    'Assessing health...',
    'Estimating weight...',
    'Calculating price...',
    'Generating recommendations...',
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    const stageInterval = setInterval(() => {
      setStage((prev) => {
        if (prev >= stages.length - 1) {
          clearInterval(stageInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    const timeout = setTimeout(() => {
      const result = generateMockResult(imageUrl);
      addToHistory(result);
      navigate(`/results/${result.id}`, { replace: true });
    }, 3500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
      clearTimeout(timeout);
    };
  }, [navigate, addToHistory, imageUrl]);

  return (
    <div className="min-h-screen forest-gradient flex flex-col items-center justify-center p-6">
      {/* Central Animation */}
      <div className="relative mb-12">
        {/* Outer Ring */}
        <div className="w-48 h-48 rounded-full border-4 border-primary/30 flex items-center justify-center animate-pulse-slow">
          {/* Inner Ring */}
          <div className="w-36 h-36 rounded-full border-4 border-primary/50 flex items-center justify-center">
            {/* Center */}
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center relative overflow-hidden">
              <span className="text-5xl relative z-10">🐄</span>
              {/* Scan Line */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/40 to-transparent animate-scan-line" />
            </div>
          </div>
        </div>
        
        {/* Orbiting Dots */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary/60" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/40" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/80" />
        </div>
      </div>

      {/* Text */}
      <div className="text-center text-primary-foreground">
        <h1 className="text-2xl font-bold mb-4">Analyzing Your Cattle</h1>
        <p className="text-lg opacity-90 mb-8 h-6">{stages[stage]}</p>
        
        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="h-2 rounded-full bg-primary-foreground/20 overflow-hidden">
            <div 
              className="h-full rounded-full bg-primary-foreground transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-sm opacity-75">{progress}% Complete</p>
        </div>
      </div>

      {/* AI Branding */}
      <div className="absolute bottom-10 flex items-center gap-2 text-primary-foreground/60">
        <span className="text-sm">Powered by</span>
        <span className="font-bold">AI Livestock Scanner</span>
      </div>
    </div>
  );
}
