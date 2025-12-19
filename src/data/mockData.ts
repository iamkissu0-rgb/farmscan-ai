import { ScanResult, AnimalType, HealthStatus } from '@/types/livestock';

const BREEDS = [
  { name: 'Gir', origin: 'Gujarat' },
  { name: 'Sahiwal', origin: 'Punjab' },
  { name: 'Red Sindhi', origin: 'Sindh' },
  { name: 'Tharparkar', origin: 'Rajasthan' },
  { name: 'Murrah Buffalo', origin: 'Haryana' },
  { name: 'Jaffarabadi', origin: 'Gujarat' },
  { name: 'Ongole', origin: 'Andhra Pradesh' },
  { name: 'Kankrej', origin: 'Gujarat' },
];

const FEED_RECOMMENDATIONS = [
  'Green fodder: 25-30 kg/day',
  'Dry fodder: 5-6 kg/day',
  'Concentrate feed: 2-3 kg/day',
  'Mineral mixture: 50g/day',
  'Clean drinking water: 40-50 liters/day',
];

const HEALTH_NOTES: Record<HealthStatus, string[]> = {
  good: [
    'Coat appears shiny and healthy',
    'Good body condition score',
    'Alert and active behavior',
    'No visible signs of disease',
  ],
  moderate: [
    'Slight dullness in coat',
    'Body condition could improve',
    'Consider deworming schedule',
    'Monitor feeding patterns',
  ],
  poor: [
    'Coat appears rough and dull',
    'Underweight for breed standard',
    'Consult veterinarian recommended',
    'Check for parasites',
  ],
};

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMockResult(imageUrl?: string): ScanResult {
  const breed = randomFromArray(BREEDS);
  const animalTypes: AnimalType[] = ['cow', 'buffalo', 'bull', 'calf'];
  const animalType = randomFromArray(animalTypes);
  
  const healthScore = randomInRange(40, 100);
  const healthStatus: HealthStatus = 
    healthScore >= 80 ? 'good' : 
    healthScore >= 60 ? 'moderate' : 'poor';
  
  const baseWeight = animalType === 'calf' ? randomInRange(80, 150) :
                     animalType === 'bull' ? randomInRange(500, 800) :
                     randomInRange(300, 500);
  
  const basePrice = baseWeight * randomInRange(80, 150);

  return {
    id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    imageUrl: imageUrl || '/placeholder.svg',
    timestamp: new Date(),
    breed: {
      name: breed.name,
      confidence: randomInRange(85, 99),
    },
    animalType,
    health: {
      score: healthScore,
      status: healthStatus,
      notes: HEALTH_NOTES[healthStatus].slice(0, randomInRange(2, 4)),
    },
    weight: {
      estimated: baseWeight,
      range: {
        min: baseWeight - randomInRange(10, 30),
        max: baseWeight + randomInRange(10, 30),
      },
    },
    price: {
      estimated: basePrice,
      range: {
        min: basePrice - randomInRange(3000, 8000),
        max: basePrice + randomInRange(3000, 8000),
      },
    },
    feed: {
      daily: `${randomInRange(20, 35)}kg green fodder + ${randomInRange(2, 4)}kg concentrate`,
      recommendations: FEED_RECOMMENDATIONS.slice(0, randomInRange(3, 5)),
    },
  };
}

export function generateSampleHistory(): ScanResult[] {
  const samples: ScanResult[] = [];
  const now = Date.now();
  
  for (let i = 0; i < 5; i++) {
    const result = generateMockResult();
    result.timestamp = new Date(now - i * 24 * 60 * 60 * 1000 - randomInRange(0, 12) * 60 * 60 * 1000);
    samples.push(result);
  }
  
  return samples;
}
