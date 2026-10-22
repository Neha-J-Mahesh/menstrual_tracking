import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../src/theme';
import { useI18n } from '../../src/i18n/I18nProvider';
import { useProfile } from '../../src/context/ProfileProvider';
import { getLatestPeriod } from '../../src/db/database';
import { calculateCyclePhases, formatDate, getTodayStr } from '../../src/utils/cycle';

const phaseColors: Record<string, string> = {
  Menstrual: colors.pink[500],
  Follicular: colors.teal[300],
  Ovulation: colors.teal[500],
  Luteal: colors.pink[300],
};

export default function PhaseDetailScreen() {
  const { t } = useI18n();
  const { activeProfile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [cycleInfo, setCycleInfo] = useState<ReturnType<typeof calculateCyclePhases> | null>(null);

  useEffect(() => {
    if (!activeProfile) { setLoading(false); return; }
    let active = true;
    (async () => {
      const period = await getLatestPeriod(activeProfile.id);
      if (!active || !period) { setLoading(false); return; }
      setCycleInfo(calculateCyclePhases(
        period.start_date, period.end_date,
        activeProfile.typical_cycle_len, activeProfile.typical_period_len
      ));
      setLoading(false);
    })();
    return () => { active = false; };
  }, [activeProfile]);

  const phaseDescriptions: Record<string, string> = {
    Menstrual: 'Shedding of uterine lining. Rest, stay hydrated, eat iron-rich foods.',
    Follicular: 'Body prepares a new egg. Energy levels typically rise.',
    Ovulation: 'Egg is released. This is the fertile window.',
    Luteal: 'Body prepares for potential pregnancy. PMS symptoms may occur.',
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.gray[700]} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('phaseInfo')}</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={colors.teal[500]} style={{ marginTop: spacing.xxxl }} />
      ) : !cycleInfo ? (
        <Text style={styles.emptyText}>{t('noPeriodsLogged')}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Day of cycle */}
          <View style={styles.dayCard}>
            <Text style={styles.dayBigNum}>{cycleInfo.currentDay}</Text>
            <Text style={styles.dayLabel}>{t('cycleDay')}</Text>
          </View>

          {/* Phase cards */}
          <Text style={styles.sectionTitle}>{t('phaseTracker')}</Text>
          {cycleInfo.phases.map((phase, i) => {
            const isActive = cycleInfo.currentPhase?.name === phase.name;
            const color = phaseColors[phase.name] || colors.teal[500];
            return (
              <View key={i} style={[styles.phaseCard, { borderLeftColor: color, borderLeftWidth: 4, opacity: isActive ? 1 : 0.6 }]}>
                <View style={styles.phaseHeader}>
                  <View style={[styles.phaseDot, { backgroundColor: color }]} />
                  <Text style={styles.phaseName}>
                    {phase.name === 'Menstrual' ? t('menstrualPhase') :
                     phase.name === 'Follicular' ? t('follicularPhase') :
                     phase.name === 'Ovulation' ? t('ovulationPhase') :
                     t('lutealPhase')}
                  </Text>
                  {isActive && <View style={[styles.activeBadge, { backgroundColor: color + '20' }]}>
                    <Text style={[styles.activeText, { color }]}>Now</Text>
                  </View>}
                </View>
                <Text style={styles.phaseDate}>{formatDate(phase.startDate)} - {formatDate(phase.endDate)}</Text>
                <Text style={styles.phaseDays}>{phase.dayCount} {t('days')}</Text>
                <Text style={styles.phaseDesc}>{phaseDescriptions[phase.name] ?? ''}</Text>
              </View>
            );
          })}

          {/* Ovulation & Fertile Window */}
          <View style={styles.windowCard}>
            <Text style={styles.windowTitle}>{t('ovulationWindow')}</Text>
            <Text style={styles.windowDate}>
              {formatDate(cycleInfo.ovulationStart)} - {formatDate(cycleInfo.ovulationEnd)}
            </Text>
            <View style={styles.windowSeparator} />
            <Text style={styles.windowTitle}>{t('fertileWindow')}</Text>
            <Text style={styles.windowDate}>
              {formatDate(cycleInfo.fertileStart)} - {formatDate(cycleInfo.fertileEnd)}
            </Text>
            <View style={styles.windowSeparator} />
            <Text style={styles.windowTitle}>{t('nextPeriod')}</Text>
            <Text style={styles.windowDate}>{formatDate(cycleInfo.nextPeriodStart)}</Text>
          </View>

          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>{t('notForContraception')}</Text>
          </View>
        </ScrollView>
      )}
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
  emptyText: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.body,
    color: colors.gray[400], textAlign: 'center', marginTop: spacing.xxxl,
  },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  dayCard: {
    alignItems: 'center', backgroundColor: colors.teal[500], borderRadius: radius.xl,
    padding: spacing.xl, marginBottom: spacing.lg,
  },
  dayBigNum: {
    fontFamily: typography.fontFamily.extraBold, fontSize: 72, color: colors.white,
  },
  dayLabel: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.body,
    color: colors.teal[50], marginTop: spacing.xs,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.subtitle,
    color: colors.gray[800], marginBottom: spacing.md,
  },
  phaseCard: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md,
    marginBottom: spacing.md, shadowColor: colors.gray[700], shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  phaseHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  phaseDot: { width: 14, height: 14, borderRadius: 7 },
  phaseName: {
    flex: 1, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.body,
    color: colors.gray[800],
  },
  activeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.full },
  activeText: { fontFamily: typography.fontFamily.bold, fontSize: 12 },
  phaseDate: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[500],
  },
  phaseDays: {
    fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.caption,
    color: colors.teal[500], marginBottom: 4,
  },
  phaseDesc: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[600], lineHeight: 18,
  },
  windowCard: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg,
    marginBottom: spacing.md,
  },
  windowTitle: {
    fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.body,
    color: colors.gray[700],
  },
  windowDate: {
    fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.body,
    color: colors.teal[500], marginBottom: 4,
  },
  windowSeparator: { height: 1, backgroundColor: colors.gray[100], marginVertical: spacing.md },
  disclaimerBox: {
    backgroundColor: colors.warning[50], borderRadius: radius.md, padding: spacing.md,
  },
  disclaimerText: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.warning[700], textAlign: 'center', lineHeight: 18,
  },
});
