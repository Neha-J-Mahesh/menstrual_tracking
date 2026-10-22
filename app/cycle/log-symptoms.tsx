import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../src/theme';
import { useI18n } from '../../src/i18n/I18nProvider';
import { useProfile } from '../../src/context/ProfileProvider';
import { Button } from '../../src/components/Button';
import { addSymptomLog } from '../../src/db/database';
import { getTodayStr } from '../../src/utils/cycle';

type Severity = 0 | 1 | 2 | 3;

interface SymptomItem {
  key: string;
  labelKey: 'fatigue' | 'dizziness' | 'nausea' | 'headache' | 'breathlessness' | 'cramps' | 'paleSkin' | 'heavyBleeding';
  icon: string;
}

const symptomItems: SymptomItem[] = [
  { key: 'fatigue', labelKey: 'fatigue', icon: '😴' },
  { key: 'dizziness', labelKey: 'dizziness', icon: '😵' },
  { key: 'nausea', labelKey: 'nausea', icon: '🤢' },
  { key: 'headache', labelKey: 'headache', icon: '🤕' },
  { key: 'breathlessness', labelKey: 'breathlessness', icon: '💨' },
  { key: 'cramps', labelKey: 'cramps', icon: '🔥' },
  { key: 'paleSkin', labelKey: 'paleSkin', icon: '🧊' },
  { key: 'heavyBleeding', labelKey: 'heavyBleeding', icon: '🩸' },
];

const severityLabels: ('none' | 'mild_s' | 'moderate_s' | 'severe_s')[] = ['none', 'mild_s', 'moderate_s', 'severe_s'];

export default function LogSymptomsScreen() {
  const { t } = useI18n();
  const { activeProfile } = useProfile();
  const [symptoms, setSymptoms] = useState<Record<string, Severity>>(
    Object.fromEntries(symptomItems.map((s) => [s.key, 0]))
  );
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [date] = useState(getTodayStr());

  const handleSave = async () => {
    if (!activeProfile) return;
    await addSymptomLog(
      activeProfile.id,
      date,
      {
        fatigue: symptoms.fatigue,
        dizziness: symptoms.dizziness,
        nausea: symptoms.nausea,
        headache: symptoms.headache,
        breathlessness: symptoms.breathlessness,
        cramps: symptoms.cramps,
        paleSkin: symptoms.paleSkin,
        heavyBleeding: symptoms.heavyBleeding,
      },
      mood.trim() || null,
      notes.trim() || null
    );
    setSaved(true);
    setTimeout(() => router.back(), 800);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.gray[700]} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('logSymptoms')}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {saved && (
          <View style={styles.savedBox}>
            <Check size={20} color={colors.success[600]} />
            <Text style={styles.savedText}>{t('symptomsSaved')}</Text>
          </View>
        )}

        <Text style={styles.dateLabel}>Today: {date}</Text>

        {symptomItems.map((item) => (
          <View key={item.key} style={styles.symptomRow}>
            <View style={styles.symptomLabel}>
              <Text style={styles.symptomIcon}>{item.icon}</Text>
              <Text style={styles.symptomName}>{t(item.labelKey)}</Text>
            </View>
            <View style={styles.severityRow}>
              {severityLabels.map((sev, idx) => (
                <Pressable
                  key={idx}
                  style={({ pressed }) => [
                    styles.severityBtn,
                    symptoms[item.key] === idx && styles.severityBtnActive,
                    { backgroundColor: symptoms[item.key] === idx ? severityColor(idx) : colors.gray[100] },
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => setSymptoms((prev) => ({ ...prev, [item.key]: idx as Severity }))}
                >
                  <Text style={[styles.severityText, { color: symptoms[item.key] === idx ? colors.white : colors.gray[500] }]}>
                    {idx === 0 ? t('none') : idx === 1 ? t('mild_s') : idx === 2 ? t('moderate_s') : t('severe_s')}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.label}>{t('mood')}</Text>
        <View style={styles.moodRow}>
          {['😞', '😐', '😊', '😄'].map((m, i) => (
            <Pressable
              key={i}
              style={({ pressed }) => [styles.moodBtn, mood === m && styles.moodBtnActive, pressed && { opacity: 0.8 }]}
              onPress={() => setMood(m)}
            >
              <Text style={styles.moodEmoji}>{m}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add notes (optional)"
          placeholderTextColor={colors.gray[400]}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <View style={{ marginTop: spacing.md }}>
          <Button label={t('saveSymptoms')} onPress={handleSave} size="lg" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function severityColor(level: number): string {
  switch (level) {
    case 0: return colors.gray[400];
    case 1: return colors.warning[500];
    case 2: return '#F5A623';
    case 3: return colors.error[500];
    default: return colors.gray[400];
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.title,
    color: colors.gray[800],
  },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  savedBox: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.success[50], borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.success[100],
  },
  savedText: {
    fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.body,
    color: colors.success[600],
  },
  dateLabel: {
    fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.body,
    color: colors.gray[500], marginBottom: spacing.md,
  },
  symptomRow: { marginBottom: spacing.md },
  symptomLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  symptomIcon: { fontSize: 24 },
  symptomName: {
    fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.body,
    color: colors.gray[800],
  },
  severityRow: { flexDirection: 'row', gap: spacing.xs },
  severityBtn: {
    flex: 1, paddingVertical: spacing.sm, borderRadius: radius.sm, alignItems: 'center',
    minHeight: 44,
  },
  severityBtnActive: {},
  severityText: {
    fontFamily: typography.fontFamily.semibold, fontSize: 12,
  },
  label: {
    fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.body,
    color: colors.gray[700], marginBottom: spacing.sm, marginTop: spacing.md,
  },
  moodRow: { flexDirection: 'row', gap: spacing.sm },
  moodBtn: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.gray[100],
    alignItems: 'center', justifyContent: 'center',
  },
  moodBtnActive: { backgroundColor: colors.teal[50], borderWidth: 2, borderColor: colors.teal[500] },
  moodEmoji: { fontSize: 28 },
  notesInput: {
    backgroundColor: colors.white, borderRadius: radius.md, paddingHorizontal: spacing.md,
    paddingVertical: spacing.md, fontSize: typography.fontSize.body,
    fontFamily: typography.fontFamily.regular, color: colors.gray[800],
    borderWidth: 1.5, borderColor: colors.gray[200], minHeight: 80,
  },
});
