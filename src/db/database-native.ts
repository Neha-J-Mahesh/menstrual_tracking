import * as SQLite from 'expo-sqlite';
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

const DB_NAME = 'rural_health.db';

let db: SQLite.SQLiteDatabase | null = null;

async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
    await initSchema(db);
  }
  return db;
}

async function initSchema(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nickname TEXT NOT NULL,
      age INTEGER NOT NULL,
      pregnancy_status TEXT NOT NULL DEFAULT 'not_pregnant',
      typical_cycle_len INTEGER NOT NULL DEFAULT 28,
      typical_period_len INTEGER NOT NULL DEFAULT 5,
      pin_hash TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS period_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profile_id INTEGER NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      flow_intensity TEXT NOT NULL DEFAULT 'moderate',
      notes TEXT,
      FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS symptom_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profile_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      fatigue INTEGER NOT NULL DEFAULT 0,
      dizziness INTEGER NOT NULL DEFAULT 0,
      nausea INTEGER NOT NULL DEFAULT 0,
      headache INTEGER NOT NULL DEFAULT 0,
      breathlessness INTEGER NOT NULL DEFAULT 0,
      cramps INTEGER NOT NULL DEFAULT 0,
      mood TEXT,
      pale_skin INTEGER NOT NULL DEFAULT 0,
      heavy_bleeding INTEGER NOT NULL DEFAULT 0,
      notes TEXT,
      FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS hb_test_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profile_id INTEGER NOT NULL,
      test_date TEXT NOT NULL,
      hb_value_g_dl REAL NOT NULL,
      test_source TEXT NOT NULL DEFAULT 'lab',
      notes TEXT,
      FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS screening_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profile_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      symptom_score REAL NOT NULL DEFAULT 0,
      pallor_score REAL NOT NULL DEFAULT 0,
      final_hb_category TEXT NOT NULL DEFAULT 'normal',
      risk_level TEXT NOT NULL DEFAULT 'low',
      summary TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_period_profile ON period_logs(profile_id);
    CREATE INDEX IF NOT EXISTS idx_symptom_profile ON symptom_logs(profile_id);
    CREATE INDEX IF NOT EXISTS idx_hb_profile ON hb_test_logs(profile_id);
    CREATE INDEX IF NOT EXISTS idx_screening_profile ON screening_results(profile_id);
  `);
}

export async function createProfile(
  nickname: string,
  age: number,
  pregnancyStatus: PregnancyStatus,
  typicalCycleLen: number,
  typicalPeriodLen: number,
  pinHash: string | null = null
): Promise<number> {
  const database = await getDB();
  const result = await database.runAsync(
    'INSERT INTO profiles (nickname, age, pregnancy_status, typical_cycle_len, typical_period_len, pin_hash) VALUES (?, ?, ?, ?, ?, ?)',
    [nickname, age, pregnancyStatus, typicalCycleLen, typicalPeriodLen, pinHash]
  );
  return result.lastInsertRowId as number;
}

export async function updateProfile(
  id: number,
  nickname: string,
  age: number,
  pregnancyStatus: PregnancyStatus,
  typicalCycleLen: number,
  typicalPeriodLen: number
): Promise<void> {
  const database = await getDB();
  await database.runAsync(
    'UPDATE profiles SET nickname = ?, age = ?, pregnancy_status = ?, typical_cycle_len = ?, typical_period_len = ? WHERE id = ?',
    [nickname, age, pregnancyStatus, typicalCycleLen, typicalPeriodLen, id]
  );
}

export async function getAllProfiles(): Promise<Profile[]> {
  const database = await getDB();
  return database.getAllAsync<Profile>('SELECT * FROM profiles ORDER BY created_at DESC');
}

export async function getProfile(id: number): Promise<Profile | null> {
  const database = await getDB();
  return database.getFirstAsync<Profile>('SELECT * FROM profiles WHERE id = ?', [id]);
}

export async function deleteProfile(id: number): Promise<void> {
  const database = await getDB();
  await database.runAsync('DELETE FROM screening_results WHERE profile_id = ?', [id]);
  await database.runAsync('DELETE FROM hb_test_logs WHERE profile_id = ?', [id]);
  await database.runAsync('DELETE FROM symptom_logs WHERE profile_id = ?', [id]);
  await database.runAsync('DELETE FROM period_logs WHERE profile_id = ?', [id]);
  await database.runAsync('DELETE FROM profiles WHERE id = ?', [id]);
}

export async function addPeriodLog(
  profileId: number,
  startDate: string,
  endDate: string | null,
  flowIntensity: FlowIntensity,
  notes: string | null = null
): Promise<void> {
  const database = await getDB();
  await database.runAsync(
    'INSERT INTO period_logs (profile_id, start_date, end_date, flow_intensity, notes) VALUES (?, ?, ?, ?, ?)',
    [profileId, startDate, endDate, flowIntensity, notes]
  );
}

export async function getPeriodLogs(profileId: number): Promise<PeriodLog[]> {
  const database = await getDB();
  return database.getAllAsync<PeriodLog>(
    'SELECT * FROM period_logs WHERE profile_id = ? ORDER BY start_date DESC',
    [profileId]
  );
}

export async function getLatestPeriod(profileId: number): Promise<PeriodLog | null> {
  const database = await getDB();
  return database.getFirstAsync<PeriodLog>(
    'SELECT * FROM period_logs WHERE profile_id = ? ORDER BY start_date DESC LIMIT 1',
    [profileId]
  );
}

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
  const database = await getDB();
  await database.runAsync(
    `INSERT INTO symptom_logs (profile_id, date, fatigue, dizziness, nausea, headache, breathlessness, cramps, mood, pale_skin, heavy_bleeding, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      profileId, date,
      symptoms.fatigue, symptoms.dizziness, symptoms.nausea,
      symptoms.headache, symptoms.breathlessness, symptoms.cramps,
      mood, symptoms.paleSkin, symptoms.heavyBleeding, notes,
    ]
  );
}

export async function getSymptomLogs(profileId: number): Promise<SymptomLog[]> {
  const database = await getDB();
  return database.getAllAsync<SymptomLog>(
    'SELECT * FROM symptom_logs WHERE profile_id = ? ORDER BY date DESC',
    [profileId]
  );
}

export async function addHbTestLog(
  profileId: number,
  testDate: string,
  hbValue: number,
  testSource: TestSource,
  notes: string | null = null
): Promise<void> {
  const database = await getDB();
  await database.runAsync(
    'INSERT INTO hb_test_logs (profile_id, test_date, hb_value_g_dl, test_source, notes) VALUES (?, ?, ?, ?, ?)',
    [profileId, testDate, hbValue, testSource, notes]
  );
}

export async function getHbTestLogs(profileId: number): Promise<HbTestLog[]> {
  const database = await getDB();
  return database.getAllAsync<HbTestLog>(
    'SELECT * FROM hb_test_logs WHERE profile_id = ? ORDER BY test_date DESC',
    [profileId]
  );
}

export async function addScreeningResult(
  profileId: number,
  date: string,
  symptomScore: number,
  pallorScore: number,
  finalHbCategory: string,
  riskLevel: RiskLevel,
  summary: string
): Promise<number> {
  const database = await getDB();
  const result = await database.runAsync(
    'INSERT INTO screening_results (profile_id, date, symptom_score, pallor_score, final_hb_category, risk_level, summary) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [profileId, date, symptomScore, pallorScore, finalHbCategory, riskLevel, summary]
  );
  return result.lastInsertRowId as number;
}

export async function getScreeningResults(profileId: number): Promise<ScreeningResult[]> {
  const database = await getDB();
  return database.getAllAsync<ScreeningResult>(
    'SELECT * FROM screening_results WHERE profile_id = ? ORDER BY date DESC',
    [profileId]
  );
}

export async function getLatestScreeningResult(profileId: number): Promise<ScreeningResult | null> {
  const database = await getDB();
  return database.getFirstAsync<ScreeningResult>(
    'SELECT * FROM screening_results WHERE profile_id = ? ORDER BY date DESC LIMIT 1',
    [profileId]
  );
}

export async function getScreeningResult(id: number): Promise<ScreeningResult | null> {
  const database = await getDB();
  return database.getFirstAsync<ScreeningResult>(
    'SELECT * FROM screening_results WHERE id = ?',
    [id]
  );
}
