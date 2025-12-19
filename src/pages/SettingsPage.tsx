import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Volume2, Info, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { MainLayout } from '@/components/layout/MainLayout';
import { useApp } from '@/context/AppContext';
import { LANGUAGES } from '@/types/livestock';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { settings, setLanguage, setVoiceEnabled } = useApp();

  const currentLanguage = LANGUAGES.find(l => l.code === settings.language);

  return (
    <MainLayout>
      <div className="min-h-full natural-gradient p-6 lg:p-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/home')}
              className="rounded-xl lg:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Customize your experience</p>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Language Section */}
            <div className="result-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Language</h2>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getLanguageEmoji(settings.language)}</span>
                      <div className="text-left">
                        <p className="font-medium text-foreground">{currentLanguage?.name}</p>
                        <p className="text-sm text-muted-foreground">{currentLanguage?.nativeName}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Language</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={cn(
                          "p-4 rounded-xl border-2 text-left transition-all",
                          settings.language === lang.code
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <span className="text-2xl mb-2 block">{getLanguageEmoji(lang.code)}</span>
                        <p className="font-medium text-foreground">{lang.name}</p>
                        <p className="text-sm text-muted-foreground">{lang.nativeName}</p>
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Voice Section */}
            <div className="result-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Voice Output</h2>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Enable Voice</p>
                  <p className="text-sm text-muted-foreground">Read results aloud</p>
                </div>
                <Switch
                  checked={settings.voiceEnabled}
                  onCheckedChange={setVoiceEnabled}
                />
              </div>
            </div>

            {/* About Section */}
            <div className="result-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">About</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <span className="text-muted-foreground">App Name</span>
                  <span className="font-medium text-foreground">AI Livestock Scanner</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium text-foreground">1.0.0</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <span className="text-muted-foreground">Developer</span>
                  <span className="font-medium text-foreground">AgriTech Solutions</span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm text-muted-foreground text-center">
                  🐄 Smart AI for Your Cattle 🐄
                </p>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Powered by advanced machine learning technology
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function getLanguageEmoji(code: string): string {
  const emojis: Record<string, string> = {
    en: '🇬🇧',
    hi: '🇮🇳',
    gu: '🇮🇳',
    mr: '🇮🇳',
    pa: '🇮🇳',
    te: '🇮🇳',
  };
  return emojis[code] || '🌐';
}
