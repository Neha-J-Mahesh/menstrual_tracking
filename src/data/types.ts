// Core types shared across the app

export type FlowIntensity = 'spotting' | 'light' | 'moderate' | 'heavy';

export type TestSource = 'lab' | 'point_of_care';

export type PregnancyStatus = 'not_pregnant' | 'pregnant' | 'post_menopause' | 'unsure';

export type Language = 'en' | 'kn' | 'te';

export type RiskLevel = 'severe' | 'moderate' | 'mild' | 'low';

export interface Profile {
  id: number;
  nickname: string;
  age: number;
  pregnancy_status: PregnancyStatus;
  typical_cycle_len: number;
  typical_period_len: number;
  pin_hash: string | null;
  created_at: string;
}

export interface PeriodLog {
  id: number;
  profile_id: number;
  start_date: string;
  end_date: string | null;
  flow_intensity: FlowIntensity;
  notes: string | null;
}

export interface SymptomLog {
  id: number;
  profile_id: number;
  date: string;
  fatigue: number; // 0-3
  dizziness: number;
  nausea: number;
  headache: number;
  breathlessness: number;
  cramps: number;
  mood: string | null;
  pale_skin: number;
  heavy_bleeding: number;
  notes: string | null;
}

export interface HbTestLog {
  id: number;
  profile_id: number;
  test_date: string;
  hb_value_g_dl: number;
  test_source: TestSource;
  notes: string | null;
}

export interface ScreeningResult {
  id: number;
  profile_id: number;
  date: string;
  symptom_score: number;
  pallor_score: number;
  final_hb_category: string;
  risk_level: RiskLevel;
  summary: string;
}

export interface CyclePhase {
  name: string;
  startDate: string;
  endDate: string;
  dayCount: number;
}

export interface PallorAnalysis {
  redRatio: number;
  avgSaturation: number;
  avgBrightness: number;
  totalPixels: number;
  pallorLevel: 'normal' | 'mild' | 'moderate' | 'severe';
  rednessIndex: number;
  resultText: string;
}
