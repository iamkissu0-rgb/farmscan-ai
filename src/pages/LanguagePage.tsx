import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { LANGUAGES, Language } from '@/types/livestock';
import { Check, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LanguagePage() {
  const navigate = useNavigate();
  const { settings, setLanguage, setHasCompletedOnboarding } = useApp();
  const [selected, setSelected] = useState<Language>(settings.language);

  const handleContinue = () => {
    setLanguage(selected);
    setHasCompletedOnboarding(true);
    navigate('/home');
  };

  return (
    <div className="min-h-screen natural-gradient py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Choose Your Language
          </h1>
          <p className="text-muted-foreground">
            Select your preferred language to continue
          </p>
        </div>

        {/* Language Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {LANGUAGES.map((lang, index) => (
            <button
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className={cn(
                "p-6 rounded-2xl border-2 transition-all duration-300 text-left animate-fade-in-up",
                selected === lang.code
                  ? "border-primary bg-primary/10 shadow-glow"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-soft"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{getLanguageEmoji(lang.code)}</span>
                {selected === lang.code && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-foreground">{lang.name}</h3>
              <p className="text-lg text-muted-foreground">{lang.nativeName}</p>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            size="lg"
            className="px-12 py-6 text-lg rounded-2xl shadow-glow hover:shadow-soft-lg transition-all"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

function getLanguageEmoji(code: Language): string {
  const emojis: Record<Language, string> = {
    en: '🇬🇧',
    hi: '🇮🇳',
    gu: '🇮🇳',
    mr: '🇮🇳',
    pa: '🇮🇳',
    te: '🇮🇳',
  };
  return emojis[code];
}
