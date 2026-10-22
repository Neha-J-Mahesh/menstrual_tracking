import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../src/theme';
import { useI18n } from '../../src/i18n/I18nProvider';
import { useProfile } from '../../src/context/ProfileProvider';
import { Button } from '../../src/components/Button';
import { classifyHb, hbReferenceMatrix, nfhs5RuralBenchmarks } from '../../src/data/medical';
import { getTodayStr } from '../../src/utils/cycle';
import type { RiskLevel } from '../../src/data/types';

export default function StepHbScreen() {
  const { t } = useI18n();
  const { activeProfile } = useProfile();
  const params = useLocalSearchParams<{ symptomScore: string; pallorScore: string; hasSevere: string; answers: string }>();
  const [hbValue, setHbValue] = useState('');
  const [testSource, setTestSource] = useState<'lab' | 'point_of_care'>('lab');
  const [notes, setNotes] = useState('');

  const isPregnant = activeProfile?.pregnancy_status === 'pregnant';
  const hbNum = parseFloat(hbValue);
  const hasValue = !isNaN(hbNum) && hbNum > 0;
  const category = hasValue ? classifyHb(hbNum, isPregnant) : null;
  const matrix = isPregnant ? hbReferenceMatrix.pregnant : hbReferenceMatrix.nonPregnant;

  const handleNext = async () => {
    if (!activeProfile) return;

    const symptomScore = parseFloat(params.symptomScore || '0');
    const pallorScore = parseFloat(params.pallorScore || '0');
    const hasSevereSymptoms = params.hasSevere === 'true';

    // Determine final risk level
    let riskLevel: RiskLevel = 'low';
    let finalHbCategory = 'not_tested';
    let summary = '';

    if (hasValue) {
      finalHbCategory = category?.label ?? 'Normal';
      await import('../../src/db/database').then(({ addHbTestLog }) =>
        addHbTestLog(activeProfile.id, getTodayStr(), hbNum, testSource, notes.trim() || null)
      );
    }

    // Severe conditions
    if (hasSevereSymptoms || (hasValue && hbNum < (isPregnant ? 7.0 : 8.0))) {
      riskLevel = 'severe';
    } else if (hasValue && hbNum < (isPregnant ? 10.0 : 11.0)) {
      riskLevel = 'moderate';
    } else if (hasValue && hbNum < (isPregnant ? 11.0 : 12.0)) {
      riskLevel = 'mild';
    } else if (symptomScore > 0.5 || pallorScore > 0.33) {
      riskLevel = 'mild';
    }

    // Generate summary
    const parts: string[] = [];
    if (hasValue) parts.push(`Hb: ${hbNum} g/dL (${category?.label})`);
    if (symptomScore > 0) parts.push(`Symptom risk: ${(symptomScore * 100).toFixed(0)}%`);
    if (pallorScore > 0) parts.push(`Pallor score: ${(pallorScore * 100).toFixed(0)}%`);
    if (hasSevereSymptoms) parts.push('Severe symptoms detected');
    summary = parts.join(' | ') || 'No significant risk factors identified';

    // Save screening result
    const { addScreeningResult } = await import('../../src/db/database');
    const resultId = await addScreeningResult(
      activeProfile.id,
      getTodayStr(),
      symptomScore,
      pallorScore,
      finalHbCategory,
      riskLevel,
      summary
    );

    router.replace(`/screening/results?id=${resultId}`);
  };

  // Find position for benchmark bar (0-100%)
  const hbPercent = hasValue ? Math.min(Math.max((hbNum / 15) * 100, 0), 100) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.gray[700]} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('enterHbValue')}</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '100%' }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.stepLabel}>{t('stepHb')} - 3 of 3</Text>

        <View style={styles.inputCard}>
          <Text style={styles.label}>{t('hbInGdl')}</Text>
          <TextInput
            style={styles.hbInput}
            value={hbValue}
            onChangeText={setHbValue}
            placeholder="e.g. 11.5"
            placeholderTextColor={colors.gray[400]}
            keyboardType="numeric"
            maxLength={5}
          />

          <Text style={styles.label}>{t('testSource')}</Text>
          <View style={styles.sourceRow}>
            <Pressable
              style={({ pressed }) => [styles.sourceBtn, testSource === 'lab' && styles.sourceBtnActive, pressed && { opacity: 0.8 }]}
              onPress={() => setTestSource('lab')}
            >
              <Text style={[styles.sourceText, testSource === 'lab' && styles.sourceTextActive]}>{t('lab')}</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.sourceBtn, testSource === 'point_of_care' && styles.sourceBtnActive, pressed && { opacity: 0.8 }]}
              onPress={() => setTestSource('point_of_care')}
            >
              <Text style={[styles.sourceText, testSource === 'point_of_care' && styles.sourceTextActive]}>{t('pointOfCare')}</Text>
            </Pressable>
          </View>
        </View>

        {/* Hb Category Chart */}
        {hasValue && category && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>{t('yourHbLevel')}</Text>
            <View style={styles.chartContainer}>
              {matrix.slice().reverse().map((cat, i) => {
                const isCurrent = cat.label === category.label;
                return (
                  <View
                    key={i}
                    style={[
                      styles.chartBar,
                      { backgroundColor: cat.color + (isCurrent ? 'FF' : '40'), height: isCurrent ? 80 : 50 },
                    ]}
                  >
                    <Text style={[styles.chartLabel, { color: isCurrent ? colors.white : colors.gray[700] }]}>
                      {cat.label}
                    </Text>
                    <Text style={[styles.chartRange, { color: isCurrent ? colors.white : colors.gray[500] }]}>
                      {cat.min.toFixed(1)}-{cat.max.toFixed(1)}
                    </Text>
                  </View>
                );
              })}
            </View>
            {/* Position marker */}
            <View style={styles.positionContainer}>
              <View style={styles.positionBar} />
              <View style={[styles.positionMarker, { left: `${hbPercent}%` }]}>
                <View style={styles.positionDot} />
                <Text style={styles.positionLabel}>{hbNum} g/dL</Text>
              </View>
            </View>
          </View>
        )}

        {/* NFHS-5 Benchmark Comparison */}
        <View style={styles.benchmarkCard}>
          <Text style={styles.benchmarkTitle}>{t('compareBenchmarks')}</Text>
          <View style={styles.benchmarkRow}>
            <View style={styles.benchmarkItem}>
              <Text style={styles.benchmarkLabel}>{t('ruralPrevalence')}</Text>
              <Text style={styles.benchmarkValue}>{nfhs5RuralBenchmarks.overall.rural}%</Text>
            </View>
            <View style={styles.benchmarkDivider} />
            <View style={styles.benchmarkItem}>
              <Text style={styles.benchmarkLabel}>Urban</Text>
              <Text style={styles.benchmarkValue}>{nfhs5RuralBenchmarks.overall.urban}%</Text>
            </View>
          </View>
          <Text style={styles.benchmarkDesc}>
            Anaemia prevalence among rural women aged 15-49 in India
          </Text>
          <Text style={styles.benchmarkSource}>{t('nfhsSource')}</Text>
        </View>

        <View style={{ marginTop: spacing.md }}>
          <Button label={t('viewResults')} onPress={handleNext} size="lg" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
  inputCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
  label: { fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.body, color: colors.gray[700], marginBottom: spacing.xs, marginTop: spacing.sm },
  hbInput: { backgroundColor: colors.gray[50], borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: Platform.OS === 'web' ? spacing.sm : spacing.md, fontSize: typography.fontSize.heading, fontFamily: typography.fontFamily.bold, color: colors.gray[800], borderWidth: 1.5, borderColor: colors.gray[200], minHeight: 56, textAlign: 'center' },
  sourceRow: { flexDirection: 'row', gap: spacing.sm },
  sourceBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, backgroundColor: colors.gray[100], alignItems: 'center', minHeight: 48 },
  sourceBtnActive: { backgroundColor: colors.teal[50], borderWidth: 2, borderColor: colors.teal[500] },
  sourceText: { fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.body, color: colors.gray[500] },
  sourceTextActive: { fontFamily: typography.fontFamily.bold, color: colors.teal[600] },
  chartCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
  chartTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.subtitle, color: colors.gray[800], marginBottom: spacing.md },
  chartContainer: { flexDirection: 'row', gap: spacing.xs, alignItems: 'flex-end', height: 90, marginBottom: spacing.lg },
  chartBar: { flex: 1, borderRadius: radius.sm, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  chartLabel: { fontFamily: typography.fontFamily.bold, fontSize: 10, textAlign: 'center' },
  chartRange: { fontFamily: typography.fontFamily.regular, fontSize: 9, textAlign: 'center', marginTop: 2 },
  positionContainer: { position: 'relative', height: 24, marginBottom: spacing.xs },
  positionBar: { position: 'absolute', top: '50%', left: 0, right: 0, height: 2, backgroundColor: colors.gray[200] },
  positionMarker: { position: 'absolute', top: 0, transform: [{ translateX: -30 }] },
  positionDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.teal[500], borderWidth: 3, borderColor: colors.white, elevation: 3 },
  positionLabel: { fontFamily: typography.fontFamily.bold, fontSize: 12, color: colors.teal[600], marginTop: 2, textAlign: 'center' },
  benchmarkCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
  benchmarkTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.subtitle, color: colors.gray[800], marginBottom: spacing.md },
  benchmarkRow: { flexDirection: 'row', alignItems: 'center' },
  benchmarkItem: { flex: 1, alignItems: 'center' },
  benchmarkLabel: { fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption, color: colors.gray[500] },
  benchmarkValue: { fontFamily: typography.fontFamily.extraBold, fontSize: typography.fontSize.title, color: colors.teal[500] },
  benchmarkDivider: { width: 1, height: 40, backgroundColor: colors.gray[200] },
  benchmarkDesc: { fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption, color: colors.gray[500], textAlign: 'center', marginTop: spacing.sm, lineHeight: 18 },
  benchmarkSource: { fontFamily: typography.fontFamily.regular, fontSize: 11, color: colors.gray[400], textAlign: 'center', marginTop: spacing.xs },
});
