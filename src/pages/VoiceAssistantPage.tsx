import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceAssistantPage() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  const commands = [
    { phrase: 'Scan cattle', action: () => navigate('/scan'), description: 'Open camera to scan' },
    { phrase: 'Show history', action: () => navigate('/history'), description: 'View past scans' },
    { phrase: 'Go home', action: () => navigate('/home'), description: 'Return to home' },
    { phrase: 'Settings', action: () => navigate('/settings'), description: 'Open settings' },
    { phrase: 'Last result', action: () => navigate('/history'), description: 'Show recent scan' },
  ];

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const text = result[0].transcript.toLowerCase();
        setTranscript(text);
        if (result.isFinal) handleCommand(text);
      };

      recognitionInstance.onend = () => setIsListening(false);
      recognitionInstance.onerror = () => {
        setIsListening(false);
        toast({ title: 'Voice recognition error', variant: 'destructive' });
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleCommand = (text: string) => {
    const matchedCommand = commands.find(cmd => text.includes(cmd.phrase.toLowerCase()));
    if (matchedCommand) {
      speak(`Okay, ${matchedCommand.phrase}`);
      setTimeout(() => matchedCommand.action(), 1000);
    } else {
      speak("Sorry, I didn't understand that command");
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      toast({ title: 'Voice recognition not supported', variant: 'destructive' });
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      setTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-full natural-gradient flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Voice Assistant</h1>
          <p className="text-muted-foreground mb-12">Speak a command to control the app</p>

          <div className="relative mb-12">
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '1.5s' }} />
                <div className="absolute -inset-4 rounded-full bg-primary/5 animate-pulse" />
              </>
            )}
            <button
              onClick={toggleListening}
              className={cn(
                "relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300",
                isListening ? "bg-primary text-primary-foreground scale-110 shadow-glow" : "bg-card text-foreground shadow-soft-lg hover:shadow-glow hover:scale-105"
              )}
            >
              {isListening ? <Mic className="w-16 h-16 animate-pulse" /> : <MicOff className="w-16 h-16" />}
            </button>
          </div>

          <div className="h-20 mb-8">
            {isListening ? (
              <div className="animate-fade-in-up">
                <p className="text-lg text-primary font-medium mb-2">Listening...</p>
                <p className="text-foreground text-xl">{transcript || 'Say a command'}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Tap the microphone to start</p>
            )}
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Try saying:</h3>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {commands.map((cmd) => (
                <button
                  key={cmd.phrase}
                  onClick={() => { speak(`Okay, ${cmd.phrase}`); setTimeout(() => cmd.action(), 1000); }}
                  className="px-4 py-2 rounded-xl bg-muted hover:bg-accent transition-colors text-sm font-medium text-foreground"
                >
                  "{cmd.phrase}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
