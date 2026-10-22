// WHO / Anemia Mukt Bharat Haemoglobin Cutoff Matrix (g/dL)
export interface HbCategory {
  label: string;
  min: number;
  max: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  color: string;
}

export interface HbReferenceMatrix {
  nonPregnant: HbCategory[];
  pregnant: HbCategory[];
}

export const hbReferenceMatrix: HbReferenceMatrix = {
  nonPregnant: [
    { label: 'Severe Anaemia', min: 0, max: 7.9, severity: 'severe', color: '#E03838' },
    { label: 'Moderate Anaemia', min: 8.0, max: 10.9, severity: 'moderate', color: '#F5A623' },
    { label: 'Mild Anaemia', min: 11.0, max: 11.9, severity: 'mild', color: '#F5C842' },
    { label: 'Normal', min: 12.0, max: 30, severity: 'normal', color: '#2DBA4F' },
  ],
  pregnant: [
    { label: 'Severe Anaemia', min: 0, max: 6.9, severity: 'severe', color: '#E03838' },
    { label: 'Moderate Anaemia', min: 7.0, max: 9.9, severity: 'moderate', color: '#F5A623' },
    { label: 'Mild Anaemia', min: 10.0, max: 10.9, severity: 'mild', color: '#F5C842' },
    { label: 'Normal', min: 11.0, max: 30, severity: 'normal', color: '#2DBA4F' },
  ],
};

export function classifyHb(hbValue: number, isPregnant: boolean): HbCategory {
  const matrix = isPregnant ? hbReferenceMatrix.pregnant : hbReferenceMatrix.nonPregnant;
  return matrix.find((cat) => hbValue >= cat.min && hbValue <= cat.max) ?? matrix[matrix.length - 1];
}

// NFHS-5 Rural Anaemia Prevalence Benchmarks
export const nfhs5RuralBenchmarks = {
  ageGroups: [
    { group: '15-19', rural: 59.6, urban: 53.8 },
    { group: '20-29', rural: 57.0, urban: 51.4 },
    { group: '30-39', rural: 55.3, urban: 49.7 },
    { group: '40-49', rural: 52.8, urban: 47.1 },
  ],
  overall: { rural: 57.0, urban: 51.3 },
  source: 'NFHS-5 (2019-21), India',
};

// Symptom Risk Weighting
export interface SymptomWeight {
  key: string;
  weight: number;
}

export const symptomWeights: SymptomWeight[] = [
  { key: 'nausea', weight: 1 },
  { key: 'dizziness', weight: 2 },
  { key: 'fatigue', weight: 2 },
  { key: 'paleSkin', weight: 2 },
  { key: 'breathlessness', weight: 3 },
  { key: 'heavyBleeding', weight: 2 },
];

export const severeSymptoms = ['chestPain', 'fainting', 'extremeBreathlessness'];

export const maxSymptomScore = symptomWeights.reduce((s, w) => s + w.weight, 0); // 12

// Pallor Colorimetry Thresholds (derived from CP-AnemiC / Eyes-Defy-Anemia baselines)
export const pallorThresholds = {
  // R_Ratio = R / (R + G + B)
  // Normal tissue: R_Ratio > 0.40
  // Mild pallor: 0.37 - 0.40
  // Moderate pallor: 0.34 - 0.37
  // Severe pallor: < 0.34
  normal: 0.40,
  mild: 0.37,
  moderate: 0.34,
  // Average saturation (HSV) thresholds
  saturationNormal: 0.30,
  saturationMild: 0.22,
  saturationModerate: 0.15,
};

// Iron-rich Nutrition Sources (locally accessible in rural India)
export interface NutritionItem {
  name: string;
  localName: string;
  description: string;
  ironContent: string;
  emoji: string;
}

export const nutritionTips: NutritionItem[] = [
  { name: 'Spinach', localName: 'Palak', description: 'Rich in iron and folic acid', ironContent: '2.7 mg / 100g', emoji: '🥬' },
  { name: 'Jaggery', localName: 'Gud', description: 'Traditional iron-rich sweetener', ironContent: '11 mg / 100g', emoji: '🟫' },
  { name: 'Chickpeas', localName: 'Chana', description: 'High in plant-based iron', ironContent: '4.8 mg / 100g', emoji: '🌰' },
  { name: 'Lentils', localName: 'Dal', description: 'Daily staple rich in iron', ironContent: '3.3 mg / 100g', emoji: '🍲' },
  { name: 'Guava', localName: 'Amrud', description: 'Vitamin C boosts iron absorption', ironContent: '0.4 mg / 100g', emoji: '🟢' },
  { name: 'Indian Gooseberry', localName: 'Amla', description: 'Very high Vitamin C for iron absorption', ironContent: '0.3 mg / 100g', emoji: '🟩' },
];

// Yoga Poses for Menstrual Cramp Relief
export interface YogaPose {
  name: string;
  sanskritName: string;
  description: string;
  steps: string[];
  duration: string;
  iconKey: string;
}

export const yogaPoses: YogaPose[] = [
  {
    name: 'Butterfly Pose',
    sanskritName: 'Baddha Konasana',
    description: 'Opens hips and relieves menstrual discomfort',
    steps: [
      'Sit with spine straight, legs extended forward',
      'Bend both knees and bring soles of feet together',
      'Hold feet with both hands, elbows on thighs',
      'Gently press knees toward the floor',
      'Hold for 1-2 minutes, breathing slowly',
    ],
    duration: '1-2 min',
    iconKey: 'butterfly',
  },
  {
    name: 'Cat-Cow Stretch',
    sanskritName: 'Marjaryasana-Bitilasana',
    description: 'Eases lower back pain and cramps',
    steps: [
      'Start on hands and knees, spine neutral',
      'Inhale: arch back down, lift head and tail (Cow)',
      'Exhale: round back up, tuck chin to chest (Cat)',
      'Repeat slowly for 8-10 breaths',
      'Keep movements gentle and rhythmic',
    ],
    duration: '2-3 min',
    iconKey: 'catcow',
  },
  {
    name: 'Child\'s Pose',
    sanskritName: 'Balasana',
    description: 'Calms the body and soothes pelvic cramps',
    steps: [
      'Kneel on the floor with big toes touching',
      'Knees apart, sit back on heels',
      'Fold torso forward, forehead to floor',
      'Arms extended forward or beside body',
      'Hold for 3-5 minutes, breathe deeply',
    ],
    duration: '3-5 min',
    iconKey: 'child',
  },
];
