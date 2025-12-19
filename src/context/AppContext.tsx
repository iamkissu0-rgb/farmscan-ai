import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, AppSettings, ScanResult } from '@/types/livestock';

interface AppContextType {
  settings: AppSettings;
  setLanguage: (lang: Language) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  history: ScanResult[];
  addToHistory: (result: ScanResult) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'livestock-scanner-settings',
  HISTORY: 'livestock-scanner-history',
  ONBOARDING: 'livestock-scanner-onboarding',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored ? JSON.parse(stored) : { language: 'en', voiceEnabled: true };
  });

  const [history, setHistory] = useState<ScanResult[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
    }
    return [];
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, String(hasCompletedOnboarding));
  }, [hasCompletedOnboarding]);

  const setLanguage = (lang: Language) => {
    setSettings(prev => ({ ...prev, language: lang }));
  };

  const setVoiceEnabled = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, voiceEnabled: enabled }));
  };

  const addToHistory = (result: ScanResult) => {
    setHistory(prev => [result, ...prev]);
  };

  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        setLanguage,
        setVoiceEnabled,
        history,
        addToHistory,
        removeFromHistory,
        clearHistory,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
