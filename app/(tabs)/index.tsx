import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CalendarHeart, Activity, ChevronRight, Stethoscope, Heart } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../src/theme';
import { useI18n } from '../../src/i18n/I18nProvider';
import { useProfile } from '../../src/context/ProfileProvider';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { getLatestPeriod, getLatestScreeningResult, getPeriodLogs } from '../../src/db/database';
import { calculateCyclePhases, formatDate, getTodayStr } from '../../src/utils/cycle';
import type { PeriodLog, ScreeningResult } from '../../src/data/types';

export default function HomeScreen() {
  const { t } = useI18n();
  const { activeProfile } = useProfile();
  const [latestPeriod, setLatestPeriod] = useState<PeriodLog | null>(null);
  const [latestResult, setLatestResult] = useState<ScreeningResult | null>(null);
  const [periodCount, setPeriodCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeProfile) {
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      const [period, result, logs] = await Promise.all([
        getLatestPeriod(activeProfile.id),
        getLatestScreeningResult(activeProfile.id),
        getPeriodLogs(activeProfile.id),
      ]);
      if (!active) return;
      setLatestPeriod(period);
      setLatestResult(result);
      setPeriodCount(logs.length);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [activeProfile]);

  if (!activeProfile) {
    return (
      <SafeAreaView style={styles.emptyContainer} edges={['top']}>
        <View style={styles.emptyContent}>
          <View style={styles.emptyIcon}>
            <Heart color={colors.teal[500]} size={48} />
          </View>
          <Text style={styles.emptyText}>{t('noProfiles')}</Text>
          <Button label={t('createProfile')} onPress={() => router.push('/create-profile')} size="lg" />
        </View>
      </SafeAreaView>
    );
  }

  const cycleInfo = latestPeriod
    ? calculateCyclePhases(
        latestPeriod.start_date,
        latestPeriod.end_date,
        activeProfile.typical_cycle_len,
        activeProfile.typical_period_len
      )
    : null;

  const phaseColors: Record<string, string> = {
    Menstrual: colors.pink[500],
    Follicular: colors.teal[300],
    Ovulation: colors.teal[500],
    Luteal: colors.pink[300],
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>{t('welcomeBack')}</Text>
            <Text style={styles.nameText}>{activeProfile.nickname}</Text>
          </View>
          <View style={[styles.avatar, { backgroundColor: cycleInfo ? phaseColors[cycleInfo.currentPhase?.name ?? 'Menstrual'] || colors.teal[500] : colors.teal[500] }]}>
            <Text style={styles.avatarText}>{activeProfile.nickname.charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.teal[500]} style={{ marginTop: spacing.xl }} />
        ) : (
          <>
            {/* Current Cycle Status */}
            {cycleInfo ? (
              <Card style={styles.cycleCard}>
                <View style={styles.cycleHeader}>
                  <View style={styles.cycleIconBox}>
                    <CalendarHeart color={colors.white} size={24} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cycleLabel}>{t('currentPhase')}</Text>
                    <Text style={styles.cyclePhaseName}>
                      {cycleInfo.currentPhase?.name === 'Menstrual' ? t('menstrualPhase') :
                       cycleInfo.currentPhase?.name === 'Follicular' ? t('follicularPhase') :
                       cycleInfo.currentPhase?.name === 'Ovulation' ? t('ovulationPhase') :
                       t('lutealPhase')}
                    </Text>
                  </View>
                </View>
                <View style={styles.cycleDayRow}>
                  <View style={styles.cycleDayBox}>
                    <Text style={styles.cycleDayNum}>{cycleInfo.currentDay}</Text>
                    <Text style={styles.cycleDayLabel}>{t('dayOfCycle')}</Text>
                  </View>
                  <View style={styles.cycleDayBox}>
                    <Text style={styles.cycleDayNum}>{formatDate(cycleInfo.nextPeriodStart).split(',')[0]}</Text>
                    <Text style={styles.cycleDayLabel}>{t('nextPeriod')}</Text>
                  </View>
                </View>
                <Pressable onPress={() => router.push('/cycle/phase-detail')} style={styles.detailLink}>
                  <Text style={styles.detailLinkText}>{t('phaseInfo')}</Text>
                  <ChevronRight size={18} color={colors.teal[500]} />
                </Pressable>
              </Card>
            ) : (
              <Card style={styles.cycleCard}>
                <View style={styles.cycleHeader}>
                  <View style={styles.cycleIconBox}>
                    <CalendarHeart color={colors.white} size={24} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cycleLabel}>{t('noPeriodsLogged')}</Text>
                  </View>
                </View>
                <Button label={t('logPeriod')} onPress={() => router.push('/cycle/log-period')} />
              </Card>
            )}

            {/* Quick Actions */}
            <View style={styles.actionsRow}>
              <Pressable style={styles.actionCard} onPress={() => router.push('/cycle/log-period')}>
                <View style={[styles.actionIcon, { backgroundColor: colors.pink[200] }]}>
                  <CalendarHeart color={colors.pink[800]} size={26} />
                </View>
                <Text style={styles.actionLabel}>{t('logPeriod')}</Text>
              </Pressable>
              <Pressable style={styles.actionCard} onPress={() => router.push('/cycle/log-symptoms')}>
                <View style={[styles.actionIcon, { backgroundColor: colors.teal[50] }]}>
                  <Activity color={colors.teal[500]} size={26} />
                </View>
                <Text style={styles.actionLabel}>{t('logSymptoms')}</Text>
              </Pressable>
              <Pressable style={styles.actionCard} onPress={() => router.push('/screening/step-symptoms')}>
                <View style={[styles.actionIcon, { backgroundColor: colors.warning[50] }]}>
                  <Stethoscope color={colors.warning[600]} size={26} />
                </View>
                <Text style={styles.actionLabel}>{t('startScreening')}</Text>
              </Pressable>
            </View>

            {/* Last Screening Result */}
            {latestResult ? (
              <Card style={styles.resultCard} onPress={() => router.push('/screening/history')}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>{t('lastResult')}</Text>
                  <ChevronRight size={18} color={colors.gray[400]} />
                </View>
                <View style={styles.resultBody}>
                  <View style={[styles.resultBadge, { backgroundColor: riskColor(latestResult.risk_level) + '20' }]}>
                    <Text style={[styles.resultBadgeText, { color: riskColor(latestResult.risk_level) }]}>
                      {riskLabel(latestResult.risk_level, t)}
                    </Text>
                  </View>
                  <Text style={styles.resultSummary}>{latestResult.summary}</Text>
                </View>
              </Card>
            ) : (
              <Card style={styles.resultCard}>
                <Text style={styles.resultTitle}>{t('recentResults')}</Text>
                <Text style={styles.noResultText}>{t('noResultsYet')}</Text>
                <View style={{ marginTop: spacing.md }}>
                  <Button label={t('newScreening')} onPress={() => router.push('/screening/step-symptoms')} />
                </View>
              </Card>
            )}

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>{periodCount}</Text>
                <Text style={styles.statLabel}>{t('periodHistory')}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>{activeProfile.typical_cycle_len}</Text>
                <Text style={styles.statLabel}>{t('cycleLength')}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>{activeProfile.age}</Text>
                <Text style={styles.statLabel}>{t('age')}</Text>
              </View>
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimerBox}>
              <Text style={styles.disclaimerText}>{t('disclaimer')}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function riskColor(level: string): string {
  switch (level) {
    case 'severe': return colors.error[500];
    case 'moderate': return colors.warning[500];
    case 'mild': return '#F5C842';
    default: return colors.success[500];
  }
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
  emptyContainer: { flex: 1, backgroundColor: colors.gray[50], justifyContent: 'center', alignItems: 'center' },
  emptyContent: { alignItems: 'center', padding: spacing.xl, gap: spacing.lg },
  emptyIcon: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: colors.teal[50],
    alignItems: 'center', justifyContent: 'center',
  },
  emptyText: {
    fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.subtitle,
    color: colors.gray[600], textAlign: 'center', marginBottom: spacing.md,
  },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: spacing.lg, paddingBottom: spacing.lg,
  },
  welcomeText: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.body,
    color: colors.gray[500],
  },
  nameText: {
    fontFamily: typography.fontFamily.extraBold, fontSize: typography.fontSize.heading,
    color: colors.gray[800],
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.subtitle,
    color: colors.white,
  },
  cycleCard: { marginBottom: spacing.md },
  cycleHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  cycleIconBox: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: colors.teal[500],
    alignItems: 'center', justifyContent: 'center',
  },
  cycleLabel: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[500],
  },
  cyclePhaseName: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.subtitle,
    color: colors.gray[800],
  },
  cycleDayRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  cycleDayBox: { flex: 1, backgroundColor: colors.gray[50], borderRadius: radius.md, padding: spacing.md },
  cycleDayNum: {
    fontFamily: typography.fontFamily.extraBold, fontSize: typography.fontSize.title,
    color: colors.teal[600],
  },
  cycleDayLabel: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[500],
  },
  detailLink: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  detailLinkText: {
    fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.body,
    color: colors.teal[500],
  },
  actionsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  actionCard: { flex: 1, alignItems: 'center', gap: spacing.sm },
  actionIcon: {
    width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: {
    fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.caption,
    color: colors.gray[700], textAlign: 'center',
  },
  resultCard: { marginBottom: spacing.md },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  resultTitle: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.subtitle,
    color: colors.gray[800],
  },
  resultBody: { gap: spacing.sm },
  resultBadge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, alignSelf: 'flex-start' },
  resultBadgeText: { fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.body },
  resultSummary: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.body,
    color: colors.gray[600], lineHeight: 22,
  },
  noResultText: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.body,
    color: colors.gray[400],
  },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  statBox: {
    flex: 1, backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md,
    alignItems: 'center', shadowColor: colors.gray[700], shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  statNum: {
    fontFamily: typography.fontFamily.extraBold, fontSize: typography.fontSize.title,
    color: colors.teal[500],
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[500],
  },
  disclaimerBox: {
    backgroundColor: colors.gray[100], borderRadius: radius.md, padding: spacing.md,
    marginTop: spacing.sm,
  },
  disclaimerText: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[500], textAlign: 'center', lineHeight: 18,
  },
});
