import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../src/theme';
import { useI18n } from '../../src/i18n/I18nProvider';
import { useProfile } from '../../src/context/ProfileProvider';
import { Button } from '../../src/components/Button';
import { addPeriodLog } from '../../src/db/database';
import { getTodayStr, formatDate } from '../../src/utils/cycle';
import type { FlowIntensity } from '../../src/data/types';

const flowOptions: { value: FlowIntensity; labelKey: 'spotting' | 'light' | 'moderate' | 'heavy' }[] = [
  { value: 'spotting', labelKey: 'spotting' },
  { value: 'light', labelKey: 'light' },
  { value: 'moderate', labelKey: 'moderate' },
  { value: 'heavy', labelKey: 'heavy' },
];

const flowColors: Record<FlowIntensity, string> = {
  spotting: colors.pink[200],
  light: colors.pink[300],
  moderate: colors.pink[500],
  heavy: colors.error[500],
};

export default function LogPeriodScreen() {
  const { t } = useI18n();
  const { activeProfile } = useProfile();
  const [startDate, setStartDate] = useState(getTodayStr());
  const [endDate, setEndDate] = useState('');
  const [flow, setFlow] = useState<FlowIntensity>('moderate');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!activeProfile) return;
    await addPeriodLog(
      activeProfile.id,
      startDate,
      endDate || null,
      flow,
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
        <Text style={styles.headerTitle}>{t('logPeriod')}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {saved && (
          <View style={styles.savedBox}>
            <Check size={20} color={colors.success[600]} />
            <Text style={styles.savedText}>{t('periodSaved')}</Text>
          </View>
        )}

        <Text style={styles.label}>{t('startDate')}</Text>
        <TextInput
          style={styles.dateInput}
          value={startDate}
          onChangeText={setStartDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.gray[400]}
        />
        {Platform.OS === 'web' && (
          <Text style={styles.hintText}>Format: YYYY-MM-DD (e.g., {getTodayStr()})</Text>
        )}

        <Text style={styles.label}>{t('endDate')}</Text>
        <TextInput
          style={styles.dateInput}
          value={endDate}
          onChangeText={setEndDate}
          placeholder="YYYY-MM-DD (optional)"
          placeholderTextColor={colors.gray[400]}
        />

        <Text style={styles.label}>{t('flowIntensity')}</Text>
        <View style={styles.flowRow}>
          {flowOptions.map((opt) => (
            <Pressable
              key={opt.value}
              style={({ pressed }) => [
                styles.flowPill,
                { borderColor: flow === opt.value ? flowColors[opt.value] : colors.gray[200] },
                flow === opt.value && { backgroundColor: flowColors[opt.value] + '20' },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setFlow(opt.value)}
            >
              <View style={[styles.flowDot, { backgroundColor: flowColors[opt.value] }]} />
              <Text style={[styles.flowPillText, flow === opt.value && { color: flowColors[opt.value], fontFamily: typography.fontFamily.bold }]}>
                {t(opt.labelKey)}
              </Text>
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
          <Button label={t('save')} onPress={handleSave} size="lg" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
  label: {
    fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.body,
    color: colors.gray[700], marginBottom: spacing.xs, marginTop: spacing.md,
  },
  dateInput: {
    backgroundColor: colors.white, borderRadius: radius.md, paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'web' ? spacing.sm : spacing.md,
    fontSize: typography.fontSize.body, fontFamily: typography.fontFamily.regular,
    color: colors.gray[800], borderWidth: 1.5, borderColor: colors.gray[200], minHeight: 48,
  },
  hintText: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[400], marginTop: spacing.xs,
  },
  flowRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  flowPill: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2,
    borderRadius: radius.full, borderWidth: 1.5, backgroundColor: colors.white,
    minHeight: 48,
  },
  flowDot: { width: 12, height: 12, borderRadius: 6 },
  flowPillText: {
    fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.body,
    color: colors.gray[600],
  },
  notesInput: {
    backgroundColor: colors.white, borderRadius: radius.md, paddingHorizontal: spacing.md,
    paddingVertical: spacing.md, fontSize: typography.fontSize.body,
    fontFamily: typography.fontFamily.regular, color: colors.gray[800],
    borderWidth: 1.5, borderColor: colors.gray[200], minHeight: 80,
  },
});
