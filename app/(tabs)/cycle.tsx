import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CalendarHeart, Activity, BookOpen, Apple, ChevronRight, Plus } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../src/theme';
import { useI18n } from '../../src/i18n/I18nProvider';
import { useProfile } from '../../src/context/ProfileProvider';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { getPeriodLogs, getLatestPeriod } from '../../src/db/database';
import { calculateCyclePhases, formatDate } from '../../src/utils/cycle';
import { yogaPoses, nutritionTips } from '../../src/data/medical';
import type { PeriodLog } from '../../src/data/types';

export default function CycleScreen() {
  const { t } = useI18n();
  const { activeProfile } = useProfile();
  const [periods, setPeriods] = useState<PeriodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showYoga, setShowYoga] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);

  useEffect(() => {
    if (!activeProfile) { setLoading(false); return; }
    let active = true;
    (async () => {
      const logs = await getPeriodLogs(activeProfile.id);
      if (!active) return;
      setPeriods(logs);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [activeProfile]);

  const latestPeriod = periods[0] ?? null;
  const cycleInfo = latestPeriod && activeProfile
    ? calculateCyclePhases(
        latestPeriod.start_date, latestPeriod.end_date,
        activeProfile.typical_cycle_len, activeProfile.typical_period_len
      )
    : null;

  const phaseColors: Record<string, string> = {
    Menstrual: colors.pink[500],
    Follicular: colors.teal[300],
    Ovulation: colors.teal[500],
    Luteal: colors.pink[300],
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ActivityIndicator size="large" color={colors.teal[500]} style={{ marginTop: spacing.xxxl }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>{t('phaseTracker')}</Text>

        {/* Phase Visual */}
        {cycleInfo ? (
          <Card style={styles.phaseCard}>
            <Text style={styles.cardTitle}>{t('cycleDay')}</Text>
            <View style={styles.phaseTimeline}>
              {cycleInfo.phases.map((phase, i) => {
                const isActive = cycleInfo.currentPhase?.name === phase.name;
                const color = phaseColors[phase.name] || colors.teal[500];
                return (
                  <View key={i} style={[styles.phaseBar, { opacity: isActive ? 1 : 0.4 }]}>
                    <View style={[styles.phaseDot, { backgroundColor: color, width: isActive ? 16 : 10, height: isActive ? 16 : 10 }]} />
                    <Text style={[styles.phaseName, { color: isActive ? colors.gray[800] : colors.gray[500] }]}>
                      {phase.name === 'Menstrual' ? t('menstrualPhase') :
                       phase.name === 'Follicular' ? t('follicularPhase') :
                       phase.name === 'Ovulation' ? t('ovulationPhase') :
                       t('lutealPhase')}
                    </Text>
                    <Text style={styles.phaseDays}>{phase.dayCount} {t('days')}</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>{cycleInfo.currentDay}</Text>
              <Text style={styles.dayBadgeLabel}>{t('dayOfCycle')}</Text>
            </View>
            <Text style={styles.ovulationInfo}>
              {t('ovulationWindow')}: {formatDate(cycleInfo.ovulationStart).split(',')[0]} - {formatDate(cycleInfo.ovulationEnd).split(',')[0]}
            </Text>
            <Text style={styles.ovulationInfo}>
              {t('nextPeriod')}: {formatDate(cycleInfo.nextPeriodStart)}
            </Text>
            <Pressable onPress={() => router.push('/cycle/phase-detail')} style={styles.detailLink}>
              <Text style={styles.detailLinkText}>{t('phaseInfo')}</Text>
              <ChevronRight size={18} color={colors.teal[500]} />
            </Pressable>
          </Card>
        ) : (
          <Card style={styles.phaseCard}>
            <Text style={styles.cardTitle}>{t('noPeriodsLogged')}</Text>
            <Text style={styles.subText}>Start tracking your cycle to see phase predictions and ovulation windows.</Text>
            <View style={{ marginTop: spacing.md }}>
              <Button label={t('logPeriod')} onPress={() => router.push('/cycle/log-period')} />
            </View>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Pressable style={styles.actionBtn} onPress={() => router.push('/cycle/log-period')}>
            <View style={[styles.actionIconBox, { backgroundColor: colors.pink[200] }]}>
              <Plus color={colors.pink[800]} size={24} />
            </View>
            <Text style={styles.actionText}>{t('logPeriod')}</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => router.push('/cycle/log-symptoms')}>
            <View style={[styles.actionIconBox, { backgroundColor: colors.teal[50] }]}>
              <Activity color={colors.teal[500]} size={24} />
            </View>
            <Text style={styles.actionText}>{t('logSymptoms')}</Text>
          </Pressable>
        </View>

        {/* Period History */}
        {periods.length > 0 && (
          <Card style={styles.historyCard}>
            <Text style={styles.cardTitle}>{t('periodHistory')}</Text>
            {periods.slice(0, 5).map((p, i) => (
              <View key={p.id} style={styles.historyRow}>
                <View style={[styles.flowDot, { backgroundColor: flowColor(p.flow_intensity) }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyDate}>{formatDate(p.start_date)}</Text>
                  <Text style={styles.historyFlow}>{flowLabel(p.flow_intensity, t)}</Text>
                </View>
                {i === 0 && (
                  <View style={styles.latestBadge}>
                    <Text style={styles.latestText}>Latest</Text>
                  </View>
                )}
              </View>
            ))}
          </Card>
        )}

        {/* Yoga Section */}
        <Card style={styles.expandableCard}>
          <Pressable style={styles.expandHeader} onPress={() => setShowYoga(!showYoga)}>
            <View style={styles.expandTitleRow}>
              <View style={[styles.expandIcon, { backgroundColor: colors.pink[200] }]}>
                <BookOpen color={colors.pink[800]} size={22} />
              </View>
              <Text style={styles.expandTitle}>{t('yogaExercises')}</Text>
            </View>
            <ChevronRight size={20} color={colors.gray[400]} style={{ transform: [{ rotate: showYoga ? '90deg' : '0deg' }] }} />
          </Pressable>
          {showYoga && (
            <View style={styles.expandBody}>
              {yogaPoses.map((pose, i) => (
                <View key={i} style={styles.poseCard}>
                  <Text style={styles.poseName}>{pose.name}</Text>
                  <Text style={styles.poseSanskrit}>{pose.sanskritName}</Text>
                  <Text style={styles.poseDesc}>{pose.description}</Text>
                  {pose.steps.map((step, j) => (
                    <Text key={j} style={styles.poseStep}>{j + 1}. {step}</Text>
                  ))}
                  <Text style={styles.poseDuration}>{pose.duration}</Text>
                </View>
              ))}
            </View>
          )}
        </Card>

        {/* Nutrition Section */}
        <Card style={styles.expandableCard}>
          <Pressable style={styles.expandHeader} onPress={() => setShowNutrition(!showNutrition)}>
            <View style={styles.expandTitleRow}>
              <View style={[styles.expandIcon, { backgroundColor: colors.success[50] }]}>
                <Apple color={colors.success[500]} size={22} />
              </View>
              <Text style={styles.expandTitle}>{t('nutritionTips')}</Text>
            </View>
            <ChevronRight size={20} color={colors.gray[400]} style={{ transform: [{ rotate: showNutrition ? '90deg' : '0deg' }] }} />
          </Pressable>
          {showNutrition && (
            <View style={styles.expandBody}>
              {nutritionTips.map((item, i) => (
                <View key={i} style={styles.nutritionRow}>
                  <Text style={styles.nutritionEmoji}>{item.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.nutritionName}>{item.name} ({item.localName})</Text>
                    <Text style={styles.nutritionDesc}>{item.description}</Text>
                    <Text style={styles.nutritionIron}>Iron: {item.ironContent}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </Card>

        {/* Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>{t('notForContraception')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function flowColor(intensity: string): string {
  switch (intensity) {
    case 'spotting': return colors.pink[200];
    case 'light': return colors.pink[300];
    case 'moderate': return colors.pink[500];
    case 'heavy': return colors.error[500];
    default: return colors.pink[300];
  }
}

function flowLabel(intensity: string, t: (k: any) => string): string {
  switch (intensity) {
    case 'spotting': return t('spotting');
    case 'light': return t('light');
    case 'moderate': return t('moderate');
    case 'heavy': return t('heavy');
    default: return t('moderate');
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  screenTitle: {
    fontFamily: typography.fontFamily.extraBold, fontSize: typography.fontSize.heading,
    color: colors.gray[800], paddingTop: spacing.lg, paddingBottom: spacing.md,
  },
  phaseCard: { marginBottom: spacing.md },
  cardTitle: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.subtitle,
    color: colors.gray[800], marginBottom: spacing.sm,
  },
  subText: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.body,
    color: colors.gray[500], lineHeight: 22,
  },
  phaseTimeline: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.md },
  phaseBar: { flex: 1, alignItems: 'center', gap: 4 },
  phaseDot: { borderRadius: 8, marginBottom: 4 },
  phaseName: {
    fontFamily: typography.fontFamily.semibold, fontSize: 10,
    textAlign: 'center',
  },
  phaseDays: {
    fontFamily: typography.fontFamily.regular, fontSize: 10,
    color: colors.gray[400],
  },
  dayBadge: { alignItems: 'center', marginBottom: spacing.md },
  dayBadgeText: {
    fontFamily: typography.fontFamily.extraBold, fontSize: typography.fontSize.display,
    color: colors.teal[500],
  },
  dayBadgeLabel: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[500],
  },
  ovulationInfo: {
    fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.body,
    color: colors.gray[600], marginBottom: 4,
  },
  detailLink: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  detailLinkText: {
    fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.body,
    color: colors.teal[500],
  },
  actionRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  actionBtn: { flex: 1, alignItems: 'center', gap: spacing.sm },
  actionIconBox: {
    width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center',
  },
  actionText: {
    fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.caption,
    color: colors.gray[700], textAlign: 'center',
  },
  historyCard: { marginBottom: spacing.md },
  historyRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.gray[100],
  },
  flowDot: { width: 12, height: 12, borderRadius: 6 },
  historyDate: {
    fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.body,
    color: colors.gray[800],
  },
  historyFlow: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[500],
  },
  latestBadge: { backgroundColor: colors.teal[50], paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.full },
  latestText: { fontFamily: typography.fontFamily.bold, fontSize: 10, color: colors.teal[600] },
  expandableCard: { marginBottom: spacing.md },
  expandHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expandTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  expandIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  expandTitle: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.subtitle,
    color: colors.gray[800],
  },
  expandBody: { marginTop: spacing.md, gap: spacing.md },
  poseCard: { backgroundColor: colors.pink[50], borderRadius: radius.md, padding: spacing.md },
  poseName: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.body,
    color: colors.gray[800],
  },
  poseSanskrit: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[500], fontStyle: 'italic', marginBottom: 4,
  },
  poseDesc: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.body,
    color: colors.gray[600], marginBottom: spacing.sm,
  },
  poseStep: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[700], lineHeight: 20, marginBottom: 2,
  },
  poseDuration: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.caption,
    color: colors.teal[500], marginTop: 4,
  },
  nutritionRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  nutritionEmoji: { fontSize: 32 },
  nutritionName: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.body,
    color: colors.gray[800],
  },
  nutritionDesc: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[500], marginBottom: 2,
  },
  nutritionIron: {
    fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.caption,
    color: colors.teal[500],
  },
  disclaimerBox: {
    backgroundColor: colors.warning[50], borderRadius: radius.md, padding: spacing.md,
    marginTop: spacing.sm, marginBottom: spacing.xl,
  },
  disclaimerText: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.warning[700], textAlign: 'center', lineHeight: 18,
  },
});
