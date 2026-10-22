import { Platform } from 'react-native';
import type {
  Profile,
  PeriodLog,
  SymptomLog,
  HbTestLog,
  ScreeningResult,
  FlowIntensity,
  TestSource,
  PregnancyStatus,
  RiskLevel,
} from '../data/types';

// Web fallback using localStorage (since expo-sqlite's WASM doesn't work in Metro web bundler)
// On native, uses expo-sqlite

export * from '../data/types';

interface WebDB {
  profiles: Profile[];
  period_logs: PeriodLog[];
  symptom_logs: SymptomLog[];
  hb_test_logs: HbTestLog[];
  screening_results: ScreeningResult[];
  _nextId: Record<string, number>;
}

const DB_KEY = '@rural_health_db';

function getWebDB(): WebDB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as WebDB;
  } catch {}
  const fresh: WebDB = {
    profiles: [],
    period_logs: [],
    symptom_logs: [],
    hb_test_logs: [],
    screening_results: [],
    _nextId: {},
  };
  saveWebDB(fresh);
  return fresh;
}

function saveWebDB(db: WebDB): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function nextId(db: WebDB, table: string): number {
  db._nextId[table] = (db._nextId[table] || 0) + 1;
  return db._nextId[table];
}

const isWeb = Platform.OS === 'web';

// ===== Profile Operations =====

export async function createProfile(
  nickname: string,
  age: number,
  pregnancyStatus: PregnancyStatus,
  typicalCycleLen: number,
  typicalPeriodLen: number,
  _pinHash: string | null = null
): Promise<number> {
  if (isWeb) {
    const db = getWebDB();
    const id = nextId(db, 'profiles');
    db.profiles.push({
      id,
      nickname,
      age,
      pregnancy_status: pregnancyStatus,
      typical_cycle_len: typicalCycleLen,
      typical_period_len: typicalPeriodLen,
      pin_hash: _pinHash,
      created_at: new Date().toISOString(),
    });
    saveWebDB(db);
    return id;
  }
  const { createProfile: nativeFn } = await import('./database-native');
  return nativeFn(nickname, age, pregnancyStatus, typicalCycleLen, typicalPeriodLen, _pinHash);
}

export async function updateProfile(
  id: number,
  nickname: string,
  age: number,
  pregnancyStatus: PregnancyStatus,
  typicalCycleLen: number,
  typicalPeriodLen: number
): Promise<void> {
  if (isWeb) {
    const db = getWebDB();
    const p = db.profiles.find((p) => p.id === id);
    if (p) {
      p.nickname = nickname;
      p.age = age;
      p.pregnancy_status = pregnancyStatus;
      p.typical_cycle_len = typicalCycleLen;
      p.typical_period_len = typicalPeriodLen;
      saveWebDB(db);
    }
    return;
  }
  const { updateProfile: nativeFn } = await import('./database-native');
  return nativeFn(id, nickname, age, pregnancyStatus, typicalCycleLen, typicalPeriodLen);
}

export async function getAllProfiles(): Promise<Profile[]> {
  if (isWeb) {
    const db = getWebDB();
    return [...db.profiles].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  }
  const { getAllProfiles: nativeFn } = await import('./database-native');
  return nativeFn();
}

export async function getProfile(id: number): Promise<Profile | null> {
  if (isWeb) {
    const db = getWebDB();
    return db.profiles.find((p) => p.id === id) ?? null;
  }
  const { getProfile: nativeFn } = await import('./database-native');
  return nativeFn(id);
}

export async function deleteProfile(id: number): Promise<void> {
  if (isWeb) {
    const db = getWebDB();
    db.profiles = db.profiles.filter((p) => p.id !== id);
    db.period_logs = db.period_logs.filter((p) => p.profile_id !== id);
    db.symptom_logs = db.symptom_logs.filter((p) => p.profile_id !== id);
    db.hb_test_logs = db.hb_test_logs.filter((p) => p.profile_id !== id);
    db.screening_results = db.screening_results.filter((p) => p.profile_id !== id);
    saveWebDB(db);
    return;
  }
  const { deleteProfile: nativeFn } = await import('./database-native');
  return nativeFn(id);
}

// ===== Period Log Operations =====

export async function addPeriodLog(
  profileId: number,
  startDate: string,
  endDate: string | null,
  flowIntensity: FlowIntensity,
  notes: string | null = null
): Promise<void> {
  if (isWeb) {
    const db = getWebDB();
    const id = nextId(db, 'period_logs');
    db.period_logs.push({
      id,
      profile_id: profileId,
      start_date: startDate,
      end_date: endDate,
      flow_intensity: flowIntensity,
      notes,
    });
    saveWebDB(db);
    return;
  }
  const { addPeriodLog: nativeFn } = await import('./database-native');
  return nativeFn(profileId, startDate, endDate, flowIntensity, notes);
}

export async function getPeriodLogs(profileId: number): Promise<PeriodLog[]> {
  if (isWeb) {
    const db = getWebDB();
    return db.period_logs
      .filter((p) => p.profile_id === profileId)
      .sort((a, b) => b.start_date.localeCompare(a.start_date));
  }
  const { getPeriodLogs: nativeFn } = await import('./database-native');
  return nativeFn(profileId);
}

export async function getLatestPeriod(profileId: number): Promise<PeriodLog | null> {
  if (isWeb) {
    const db = getWebDB();
    const logs = db.period_logs
      .filter((p) => p.profile_id === profileId)
      .sort((a, b) => b.start_date.localeCompare(a.start_date));
    return logs[0] ?? null;
  }
  const { getLatestPeriod: nativeFn } = await import('./database-native');
  return nativeFn(profileId);
}

// ===== Symptom Log Operations =====

export async function addSymptomLog(
  profileId: number,
  date: string,
  symptoms: {
    fatigue: number;
    dizziness: number;
    nausea: number;
    headache: number;
    breathlessness: number;
    cramps: number;
    paleSkin: number;
    heavyBleeding: number;
  },
  mood: string | null = null,
  notes: string | null = null
): Promise<void> {
  if (isWeb) {
    const db = getWebDB();
    const id = nextId(db, 'symptom_logs');
    db.symptom_logs.push({
      id,
      profile_id: profileId,
      date,
      fatigue: symptoms.fatigue,
      dizziness: symptoms.dizziness,
      nausea: symptoms.nausea,
      headache: symptoms.headache,
      breathlessness: symptoms.breathlessness,
      cramps: symptoms.cramps,
      mood,
      pale_skin: symptoms.paleSkin,
      heavy_bleeding: symptoms.heavyBleeding,
      notes,
    });
    saveWebDB(db);
    return;
  }
  const { addSymptomLog: nativeFn } = await import('./database-native');
  return nativeFn(profileId, date, symptoms, mood, notes);
}

export async function getSymptomLogs(profileId: number): Promise<SymptomLog[]> {
  if (isWeb) {
    const db = getWebDB();
    return db.symptom_logs
      .filter((p) => p.profile_id === profileId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }
  const { getSymptomLogs: nativeFn } = await import('./database-native');
  return nativeFn(profileId);
}

// ===== Hb Test Log Operations =====

export async function addHbTestLog(
  profileId: number,
  testDate: string,
  hbValue: number,
  testSource: TestSource,
  notes: string | null = null
): Promise<void> {
  if (isWeb) {
    const db = getWebDB();
    const id = nextId(db, 'hb_test_logs');
    db.hb_test_logs.push({
      id,
      profile_id: profileId,
      test_date: testDate,
      hb_value_g_dl: hbValue,
      test_source: testSource,
      notes,
    });
    saveWebDB(db);
    return;
  }
  const { addHbTestLog: nativeFn } = await import('./database-native');
  return nativeFn(profileId, testDate, hbValue, testSource, notes);
}

export async function getHbTestLogs(profileId: number): Promise<HbTestLog[]> {
  if (isWeb) {
    const db = getWebDB();
    return db.hb_test_logs
      .filter((p) => p.profile_id === profileId)
      .sort((a, b) => b.test_date.localeCompare(a.test_date));
  }
  const { getHbTestLogs: nativeFn } = await import('./database-native');
  return nativeFn(profileId);
}

// ===== Screening Result Operations =====

export async function addScreeningResult(
  profileId: number,
  date: string,
  symptomScore: number,
  pallorScore: number,
  finalHbCategory: string,
  riskLevel: RiskLevel,
  summary: string
): Promise<number> {
  if (isWeb) {
    const db = getWebDB();
    const id = nextId(db, 'screening_results');
    db.screening_results.push({
      id,
      profile_id: profileId,
      date,
      symptom_score: symptomScore,
      pallor_score: pallorScore,
      final_hb_category: finalHbCategory,
      risk_level: riskLevel,
      summary,
    });
    saveWebDB(db);
    return id;
  }
  const { addScreeningResult: nativeFn } = await import('./database-native');
  return nativeFn(profileId, date, symptomScore, pallorScore, finalHbCategory, riskLevel, summary);
}

export async function getScreeningResults(profileId: number): Promise<ScreeningResult[]> {
  if (isWeb) {
    const db = getWebDB();
    return db.screening_results
      .filter((p) => p.profile_id === profileId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }
  const { getScreeningResults: nativeFn } = await import('./database-native');
  return nativeFn(profileId);
}

export async function getLatestScreeningResult(profileId: number): Promise<ScreeningResult | null> {
  if (isWeb) {
    const db = getWebDB();
    const logs = db.screening_results
      .filter((p) => p.profile_id === profileId)
      .sort((a, b) => b.date.localeCompare(a.date));
    return logs[0] ?? null;
  }
  const { getLatestScreeningResult: nativeFn } = await import('./database-native');
  return nativeFn(profileId);
}

export async function getScreeningResult(id: number): Promise<ScreeningResult | null> {
  if (isWeb) {
    const db = getWebDB();
    return db.screening_results.find((p) => p.id === id) ?? null;
  }
  const { getScreeningResult: nativeFn } = await import('./database-native');
  return nativeFn(id);
}
