import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronRight, Stethoscope, Activity, ClipboardList, Camera, FileText } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../src/theme';
import { useI18n } from '../../src/i18n/I18nProvider';
import { useProfile } from '../../src/context/ProfileProvider';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { getScreeningResults } from '../../src/db/database';
import { formatDate } from '../../src/utils/cycle';
import type { ScreeningResult, RiskLevel } from '../../src/data/types';

const riskMeta: Record<RiskLevel, { color: string; bg: string }> = {
  severe: { color: colors.error[700], bg: colors.error[50] },
  moderate: { color: colors.warning[700], bg: colors.warning[50] },
  mild: { color: '#7D6B0A', bg: '#FEF9E7' },
  low: { color: colors.success[700], bg: colors.success[50] },
};

export default function ScreeningScreen() {
  const { t } = useI18n();
  const { activeProfile } = useProfile();
  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeProfile) { setLoading(false); return; }
    let active = true;
    (async () => {
      const r = await getScreeningResults(activeProfile.id);
      if (!active) return;
      setResults(r);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [activeProfile]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>{t('anaemiaScreening')}</Text>

        {/* Screening Steps */}
        <View style={styles.stepsContainer}>
          <ScreeningStep
            icon={<ClipboardList color={colors.white} size={26} />}
            bgColor={colors.teal[500]}
            title={t('stepSymptoms')}
            subtitle={t('symptomQuestionnaire')}
            onPress={() => router.push('/screening/step-symptoms')}
          />
          <ScreeningStep
            icon={<Camera color={colors.white} size={26} />}
            bgColor={colors.teal[400]}
            title={t('stepPallor')}
            subtitle={t('pallorAnalysis')}
            onPress={() => router.push('/screening/step-pallor')}
          />
          <ScreeningStep
            icon={<FileText color={colors.white} size={26} />}
            bgColor={colors.teal[600]}
            title={t('stepHb')}
            subtitle={t('hbInGdl')}
            onPress={() => router.push('/screening/step-hb')}
          />
        </View>

        {/* Start Full Screening */}
        <Card style={styles.startCard}>
          <View style={styles.startCardHeader}>
            <Stethoscope color={colors.teal[500]} size={32} />
            <View style={{ flex: 1 }}>
              <Text style={styles.startCardTitle}>{t('anaemiaScreening')}</Text>
              <Text style={styles.startCardDesc}>
                Complete all 3 steps for a comprehensive screening: Symptoms, Pallor Test, and Hb Report
              </Text>
            </View>
          </View>
          <Button label={t('newScreening')} onPress={() => router.push('/screening/step-symptoms')} size="lg" />
        </Card>

        {/* History */}
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>{t('screeningHistoryLabel')}</Text>
          {results.length > 0 && (
            <Pressable onPress={() => router.push('/screening/history')}>
              <Text style={styles.viewAllText}>{t('viewHistory')}</Text>
            </Pressable>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.teal[500]} style={{ marginTop: spacing.lg }} />
        ) : results.length === 0 ? (
          <Card style={styles.emptyCard}>
            <View style={styles.emptyIconBox}>
              <Activity color={colors.gray[300]} size={40} />
            </View>
            <Text style={styles.emptyText}>{t('noResultsYet')}</Text>
          </Card>
        ) : (
          <View style={{ gap: spacing.md }}>
            {results.slice(0, 5).map((r) => {
              const meta = riskMeta[r.risk_level];
              return (
                <Pressable key={r.id} onPress={() => router.push(`/screening/results?id=${r.id}`)}>
                  <Card style={styles.resultRow}>
                    <View style={styles.resultLeft}>
                      <View style={[styles.riskIndicator, { backgroundColor: meta.color }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.resultDate}>{formatDate(r.date)}</Text>
                        <Text style={styles.resultCategory}>{r.final_hb_category}</Text>
                        <Text style={styles.resultSummary} numberOfLines={1}>{r.summary}</Text>
                      </View>
                    </View>
                    <View style={[styles.riskPill, { backgroundColor: meta.bg }]}>
                      <Text style={[styles.riskPillText, { color: meta.color }]}>
                        {riskLabel(r.risk_level, t)}
                      </Text>
                    </View>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>{t('fullDisclaimer')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function riskLabel(level: string, t: (k: any) => string): string {
  switch (level) {
    case 'severe': return t('severeRisk');
    case 'moderate': return t('moderateRisk');
    case 'mild': return t('mildRisk');
    default: return t('lowRisk');
  }
}

function ScreeningStep({ icon, bgColor, title, subtitle, onPress }: {
  icon: React.ReactNode; bgColor: string; title: string; subtitle: string; onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.stepCard, pressed && { opacity: 0.85 }]} onPress={onPress}>
      <View style={[styles.stepIcon, { backgroundColor: bgColor }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepSubtitle}>{subtitle}</Text>
      </View>
      <ChevronRight size={20} color={colors.gray[300]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  screenTitle: {
    fontFamily: typography.fontFamily.extraBold, fontSize: typography.fontSize.heading,
    color: colors.gray[800], paddingTop: spacing.lg, paddingBottom: spacing.md,
  },
  stepsContainer: { gap: spacing.md, marginBottom: spacing.md },
  stepCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md,
    shadowColor: colors.gray[700], shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  stepIcon: {
    width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center',
  },
  stepTitle: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.body,
    color: colors.gray[800],
  },
  stepSubtitle: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[500],
  },
  startCard: { marginBottom: spacing.md },
  startCardHeader: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  startCardTitle: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.subtitle,
    color: colors.gray[800],
  },
  startCardDesc: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[500], lineHeight: 18,
  },
  historyHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.sm, marginTop: spacing.sm,
  },
  historyTitle: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.subtitle,
    color: colors.gray[800],
  },
  viewAllText: {
    fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.body,
    color: colors.teal[500],
  },
  emptyCard: { alignItems: 'center', padding: spacing.xl },
  emptyIconBox: { marginBottom: spacing.md },
  emptyText: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.body,
    color: colors.gray[400],
  },
  resultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resultLeft: { flexDirection: 'row', gap: spacing.md, flex: 1 },
  riskIndicator: { width: 4, height: 48, borderRadius: 2 },
  resultDate: {
    fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.body,
    color: colors.gray[800],
  },
  resultCategory: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[500],
  },
  resultSummary: {
    fontFamily: typography.fontFamily.regular, fontSize: 12,
    color: colors.gray[400],
  },
  riskPill: { paddingHorizontal: spacing.sm + 2, paddingVertical: spacing.xs, borderRadius: radius.full },
  riskPillText: { fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.caption },
  disclaimerBox: {
    backgroundColor: colors.warning[50], borderRadius: radius.md, padding: spacing.md,
    marginTop: spacing.lg, marginBottom: spacing.xl,
  },
  disclaimerText: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.warning[700], textAlign: 'center', lineHeight: 18,
  },
});
