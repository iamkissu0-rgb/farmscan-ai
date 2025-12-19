export type Language = 'en' | 'hi' | 'gu' | 'mr' | 'pa' | 'te';

export type HealthStatus = 'good' | 'moderate' | 'poor';

export type AnimalType = 'cow' | 'buffalo' | 'bull' | 'calf';

export interface ScanResult {
  id: string;
  imageUrl: string;
  timestamp: Date;
  breed: {
    name: string;
    confidence: number;
  };
  animalType: AnimalType;
  health: {
    score: number;
    status: HealthStatus;
    notes: string[];
  };
  weight: {
    estimated: number;
    range: { min: number; max: number };
  };
  price: {
    estimated: number;
    range: { min: number; max: number };
  };
  feed: {
    daily: string;
    recommendations: string[];
  };
}

export interface AppSettings {
  language: Language;
  voiceEnabled: boolean;
}

export const LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
];

export const ANIMAL_TYPE_LABELS: Record<AnimalType, string> = {
  cow: 'Cow',
  buffalo: 'Buffalo',
  bull: 'Bull',
  calf: 'Calf',
};
