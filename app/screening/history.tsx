import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../src/theme';
import { useI18n } from '../../src/i18n/I18nProvider';
import { useProfile } from '../../src/context/ProfileProvider';
import { Card } from '../../src/components/Card';
import { getScreeningResults } from '../../src/db/database';
import { formatDate } from '../../src/utils/cycle';
import type { ScreeningResult, RiskLevel } from '../../src/data/types';

const riskMeta: Record<RiskLevel, { color: string; bg: string }> = {
  severe: { color: colors.error[500], bg: colors.error[50] },
  moderate: { color: colors.warning[500], bg: colors.warning[50] },
  mild: { color: '#F5C842', bg: '#FEF9E7' },
  low: { color: colors.success[500], bg: colors.success[50] },
};

export default function HistoryScreen() {
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
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.gray[700]} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('screeningHistoryLabel')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.teal[500]} style={{ marginTop: spacing.xxxl }} />
        ) : results.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('noResultsYet')}</Text>
          </View>
        ) : (
          results.map((r) => {
            const meta = riskMeta[r.risk_level];
            return (
              <Pressable key={r.id} onPress={() => router.push(`/screening/results?id=${r.id}`)}>
                <Card style={styles.resultCard}>
                  <View style={styles.resultTop}>
                    <View style={[styles.riskBar, { backgroundColor: meta.color }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.resultDate}>{formatDate(r.date)}</Text>
                      <Text style={styles.resultCategory}>{r.final_hb_category}</Text>
                    </View>
                    <View style={[styles.riskPill, { backgroundColor: meta.bg }]}>
                      <Text style={[styles.riskPillText, { color: meta.color }]}>
                        {riskLabel(r.risk_level, t)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.resultSummary} numberOfLines={2}>{r.summary}</Text>
                  <View style={styles.resultMetrics}>
                    <View style={styles.metricBox}>
                      <Text style={styles.metricNum}>{(r.symptom_score * 100).toFixed(0)}%</Text>
                      <Text style={styles.metricLbl}>{t('symptomRiskIndex')}</Text>
                    </View>
                    <View style={styles.metricBox}>
                      <Text style={styles.metricNum}>{(r.pallor_score * 100).toFixed(0)}%</Text>
                      <Text style={styles.metricLbl}>{t('pallorScore')}</Text>
                    </View>
                  </View>
                </Card>
              </Pressable>
            );
          })
        )}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.title, color: colors.gray[800] },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  emptyContainer: { alignItems: 'center', marginTop: spacing.xxxl },
  emptyText: { fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.body, color: colors.gray[400] },
  resultCard: { marginBottom: spacing.md },
  resultTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  riskBar: { width: 4, height: 40, borderRadius: 2 },
  resultDate: { fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.body, color: colors.gray[800] },
  resultCategory: { fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption, color: colors.gray[500] },
  riskPill: { paddingHorizontal: spacing.sm + 2, paddingVertical: spacing.xs, borderRadius: radius.full },
  riskPillText: { fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.caption },
  resultSummary: { fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption, color: colors.gray[500], lineHeight: 18, marginBottom: spacing.sm },
  resultMetrics: { flexDirection: 'row', gap: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.gray[100] },
  metricBox: { flex: 1, alignItems: 'center' },
  metricNum: { fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.body, color: colors.teal[500] },
  metricLbl: { fontFamily: typography.fontFamily.regular, fontSize: 11, color: colors.gray[400] },
});
