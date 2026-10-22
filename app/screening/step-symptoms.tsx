import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../src/theme';
import { useI18n } from '../../src/i18n/I18nProvider';
import { useProfile } from '../../src/context/ProfileProvider';
import { Button } from '../../src/components/Button';
import { calculateSymptomRisk, hasSevereSymptoms, type SymptomAnswers } from '../../src/utils/pallor';

interface SymptomItem {
  key: string;
  labelKey: string;
  icon: string;
  isSevere?: boolean;
  severeKey?: string;
  severeLabelKey?: string;
}

const symptomItems: SymptomItem[] = [
  { key: 'nausea', labelKey: 'nausea', icon: '🤢' },
  { key: 'dizziness', labelKey: 'dizziness', icon: '😵' },
  { key: 'fatigue', labelKey: 'fatigue', icon: '😴' },
  { key: 'paleSkin', labelKey: 'paleSkin', icon: '🧊' },
  { key: 'breathlessness', labelKey: 'breathlessness', icon: '💨' },
  { key: 'heavyBleeding', labelKey: 'heavyBleeding', icon: '🩸' },
];

const severeItems: SymptomItem[] = [
  { key: 'chestPain', labelKey: 'chestPain', icon: '❤️', isSevere: true, severeKey: 'chestPain', severeLabelKey: 'chestPain' },
  { key: 'fainting', labelKey: 'fainting', icon: '🌀', isSevere: true, severeKey: 'fainting', severeLabelKey: 'fainting' },
  { key: 'extremeBreathlessness', labelKey: 'extremeBreathlessness', icon: '🌪️', isSevere: true, severeKey: 'extremeBreathlessness', severeLabelKey: 'extremeBreathlessness' },
];

const severityLabels: ('none' | 'mild_s' | 'moderate_s' | 'severe_s')[] = ['none', 'mild_s', 'moderate_s', 'severe_s'];

export default function StepSymptomsScreen() {
  const { t } = useI18n();
  const { activeProfile } = useProfile();
  const [answers, setAnswers] = useState<SymptomAnswers>({
    nausea: 0, dizziness: 0, fatigue: 0, paleSkin: 0,
    breathlessness: 0, heavyBleeding: 0,
    chestPain: false, fainting: false, extremeBreathlessness: false,
  });
  const [step, setStep] = useState(1);

  const riskScore = calculateSymptomRisk(answers);
  const severe = hasSevereSymptoms(answers);

  const handleNext = () => {
    // Store in router params and go to pallor step
    router.setParams({
      symptomScore: String(riskScore),
      hasSevere: String(severe),
      answers: JSON.stringify(answers),
    });
    router.push('/screening/step-pallor');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.gray[700]} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('symptomQuestionnaire')}</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '33%' }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepLabel}>{t('stepSymptoms')} - 1 of 3</Text>

        {/* Standard symptoms */}
        {symptomItems.map((item) => (
          <View key={item.key} style={styles.symptomCard}>
            <View style={styles.symptomHeader}>
              <Text style={styles.symptomIcon}>{item.icon}</Text>
              <Text style={styles.symptomName}>{t(item.labelKey as any)}</Text>
            </View>
            <View style={styles.severityRow}>
              {severityLabels.map((sev, idx) => (
                <Pressable
                  key={idx}
                  style={({ pressed }) => [
                    styles.sevBtn,
                    { backgroundColor: answers[item.key as keyof SymptomAnswers] === idx ? sevColor(idx) : colors.gray[100] },
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => setAnswers((p) => ({ ...p, [item.key]: idx }))}
                >
                  <Text style={[styles.sevText, { color: answers[item.key as keyof SymptomAnswers] === idx ? colors.white : colors.gray[500] }]}>
                    {idx === 0 ? t('none') : idx === 1 ? t('mild_s') : idx === 2 ? t('moderate_s') : t('severe_s')}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {/* Severe symptoms - checkbox style */}
        <View style={styles.severeSection}>
          <Text style={styles.severeTitle}>Emergency Symptoms</Text>
          {severeItems.map((item) => {
            const checked = answers[item.severeKey as keyof SymptomAnswers] as boolean;
            return (
              <Pressable
                key={item.severeKey}
                style={({ pressed }) => [styles.severeRow, pressed && { opacity: 0.8 }, checked && styles.severeRowActive]}
                onPress={() => {
                  const key = item.severeKey as string;
                  setAnswers((p) => ({ ...p, [key]: !checked }) as SymptomAnswers);
                }}
              >
                <View style={[styles.checkbox, checked && styles.checkboxActive]}>
                  {checked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.severeIcon}>{item.icon}</Text>
                <Text style={styles.severeLabel}>{t(item.severeLabelKey as any)}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Risk Score */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>{t('symptomRiskIndex')}</Text>
          <Text style={styles.scoreValue}>{(riskScore * 100).toFixed(0)}%</Text>
          {severe && (
            <View style={styles.severeWarn}>
              <Text style={styles.severeWarnText}>{t('urgentCareNeeded')}</Text>
            </View>
          )}
        </View>

        <View style={styles.navRow}>
          <Button label={t('back')} onPress={() => router.back()} variant="outline" />
          <Button label={t('next')} onPress={handleNext} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function sevColor(level: number): string {
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
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.title, color: colors.gray[800] },
  progressBar: { height: 4, backgroundColor: colors.gray[200], marginHorizontal: spacing.lg, borderRadius: 2, marginBottom: spacing.md },
  progressFill: { height: '100%', backgroundColor: colors.teal[500], borderRadius: 2 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  stepLabel: { fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.caption, color: colors.teal[500], marginBottom: spacing.md },
  symptomCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md, shadowColor: colors.gray[700], shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  symptomHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  symptomIcon: { fontSize: 24 },
  symptomName: { fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.body, color: colors.gray[800] },
  severityRow: { flexDirection: 'row', gap: spacing.xs },
  sevBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.sm, alignItems: 'center', minHeight: 44 },
  sevText: { fontFamily: typography.fontFamily.semibold, fontSize: 12 },
  severeSection: { backgroundColor: colors.error[50], borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.error[100] },
  severeTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.body, color: colors.error[700], marginBottom: spacing.sm },
  severeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderRadius: radius.md, paddingHorizontal: spacing.sm },
  severeRowActive: { backgroundColor: colors.error[100] },
  checkbox: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: colors.gray[300], alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: colors.error[500], borderColor: colors.error[500] },
  checkmark: { color: colors.white, fontFamily: typography.fontFamily.bold, fontSize: 16 },
  severeIcon: { fontSize: 20 },
  severeLabel: { flex: 1, fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.body, color: colors.gray[700] },
  scoreCard: { backgroundColor: colors.teal[50], borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', marginBottom: spacing.md },
  scoreLabel: { fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.body, color: colors.gray[600] },
  scoreValue: { fontFamily: typography.fontFamily.extraBold, fontSize: typography.fontSize.display, color: colors.teal[500], marginVertical: spacing.xs },
  severeWarn: { backgroundColor: colors.error[500], borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginTop: spacing.sm },
  severeWarnText: { fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.body, color: colors.white, textAlign: 'center' },
  navRow: { flexDirection: 'row', gap: spacing.md },
});
