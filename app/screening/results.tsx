import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Share, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Share as ShareIcon, Phone, MapPin, Heart, AlertTriangle, CheckCircle, Apple } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../src/theme';
import { useI18n } from '../../src/i18n/I18nProvider';
import { Button } from '../../src/components/Button';
import { getScreeningResult } from '../../src/db/database';
import type { ScreeningResult, RiskLevel } from '../../src/data/types';

const riskConfig: Record<RiskLevel, {
  color: string;
  bgColor: string;
  icon: 'alert' | 'warning' | 'info' | 'check';
  titleKey: 'severeRisk' | 'moderateRisk' | 'mildRisk' | 'lowRisk';
  subtitleKey: 'urgentCareNeeded' | 'medicalEvalRecommended' | 'dietaryCheckSuggested' | 'healthMaintenanceAdvice';
}> = {
  severe: { color: colors.error[500], bgColor: colors.error[50], icon: 'alert', titleKey: 'severeRisk', subtitleKey: 'urgentCareNeeded' },
  moderate: { color: colors.warning[500], bgColor: colors.warning[50], icon: 'warning', titleKey: 'moderateRisk', subtitleKey: 'medicalEvalRecommended' },
  mild: { color: '#F5C842', bgColor: '#FEF9E7', icon: 'info', titleKey: 'mildRisk', subtitleKey: 'dietaryCheckSuggested' },
  low: { color: colors.success[500], bgColor: colors.success[50], icon: 'check', titleKey: 'lowRisk', subtitleKey: 'healthMaintenanceAdvice' },
};

export default function ResultsScreen() {
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    let active = true;
    (async () => {
      const r = await getScreeningResult(parseInt(id, 10));
      if (!active) return;
      setResult(r);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [id]);

  const handleShare = async () => {
    if (!result) return;
    try {
      await Share.share({
        message: `${t('appName')} - ${t('generatedReport')}\n\n${t('riskLevel')}: ${riskLabel(result.risk_level, t)}\n${t('summary')}: ${result.summary}\n\n${t('disclaimer')}`,
      });
    } catch {}
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ActivityIndicator size="large" color={colors.teal[500]} style={{ marginTop: spacing.xxxl }} />
      </SafeAreaView>
    );
  }

  if (!result) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.emptyText}>Result not found</Text>
      </SafeAreaView>
    );
  }

  const config = riskConfig[result.risk_level];

  const iconEl = config.icon === 'alert' ? <AlertTriangle size={40} color={config.color} /> :
    config.icon === 'warning' ? <AlertTriangle size={40} color={config.color} /> :
    config.icon === 'info' ? <Heart size={40} color={config.color} /> :
    <CheckCircle size={40} color={config.color} />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/(tabs)/screening')} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.gray[700]} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('screeningComplete')}</Text>
        <Pressable onPress={handleShare} style={styles.backBtn}>
          <ShareIcon size={22} color={colors.teal[500]} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Risk Banner */}
        <View style={[styles.banner, { backgroundColor: config.bgColor, borderColor: config.color }]}>
          <View style={[styles.bannerIcon, { backgroundColor: config.color }]}>{iconEl}</View>
          <Text style={[styles.bannerTitle, { color: config.color }]}>{t(config.titleKey)}</Text>
          <Text style={[styles.bannerSubtitle, { color: config.color }]}>{t(config.subtitleKey)}</Text>
        </View>

        {/* Risk-specific guidance */}
        {result.risk_level === 'severe' && (
          <View style={styles.guidanceCard}>
            <View style={styles.guidanceHeader}>
              <Phone size={22} color={colors.error[500]} />
              <Text style={styles.guidanceTitle}>Immediate Action Required</Text>
            </View>
            <Text style={styles.guidanceText}>{t('recommendPHC')}</Text>
            <Text style={styles.guidanceText}>{t('visitASHA')}</Text>
            <View style={styles.phcBox}>
              <MapPin size={20} color={colors.error[500]} />
              <Text style={styles.phcText}>Visit your nearest Primary Health Centre (PHC) or contact your ASHA worker immediately for a confirmatory blood test.</Text>
            </View>
          </View>
        )}

        {result.risk_level === 'moderate' && (
          <View style={styles.guidanceCard}>
            <View style={styles.guidanceHeader}>
              <Heart size={22} color={colors.warning[500]} />
              <Text style={styles.guidanceTitle}>Medical Evaluation</Text>
            </View>
            <Text style={styles.guidanceText}>Schedule a visit to a healthcare provider for a complete blood count test.</Text>
            <Text style={styles.guidanceText}>{t('ironRichFoods')}</Text>
          </View>
        )}

        {(result.risk_level === 'mild' || result.risk_level === 'low') && (
          <View style={styles.guidanceCard}>
            <View style={styles.guidanceHeader}>
              <Apple size={22} color={result.risk_level === 'mild' ? '#F5C842' : colors.success[500]} />
              <Text style={styles.guidanceTitle}>{t('ironRichFoods')}</Text>
            </View>
            <Text style={styles.guidanceText}>Include iron-rich foods in your daily diet: Palak (spinach), jaggery, chana, dal, and Vitamin C sources like amla and guava for better iron absorption.</Text>
            {result.risk_level === 'mild' && (
              <Text style={styles.guidanceText}>Monitor your symptoms and consider a routine Hb test at your next health check-up.</Text>
            )}
          </View>
        )}

        {/* Detailed Metrics */}
        <View style={styles.metricsCard}>
          <Text style={styles.metricsTitle}>{t('generatedReport')}</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>{t('symptomRiskIndex')}</Text>
            <Text style={styles.metricValue}>{(result.symptom_score * 100).toFixed(0)}%</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>{t('pallorScore')}</Text>
            <Text style={styles.metricValue}>{(result.pallor_score * 100).toFixed(0)}%</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>{t('hbCategory')}</Text>
            <Text style={styles.metricValue}>{result.final_hb_category}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>{t('riskLevel')}</Text>
            <Text style={styles.metricValue}>{riskLabel(result.risk_level, t)}</Text>
          </View>
          <View style={[styles.metricRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.metricLabel}>{t('summary')}</Text>
          </View>
          <Text style={styles.summaryText}>{result.summary}</Text>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerTitle}>{t('disclaimerTitle')}</Text>
          <Text style={styles.disclaimerText}>{t('fullDisclaimer')}</Text>
        </View>

        <View style={styles.navRow}>
          <Button label={t('newScreening')} onPress={() => router.replace('/screening/step-symptoms')} variant="outline" style={{ flex: 1 }} />
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.title, color: colors.gray[800], flex: 1, textAlign: 'center' },
  emptyText: { fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.body, color: colors.gray[400], textAlign: 'center', marginTop: spacing.xxxl },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  banner: { borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.md, borderWidth: 2 },
  bannerIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  bannerTitle: { fontFamily: typography.fontFamily.extraBold, fontSize: typography.fontSize.heading, textAlign: 'center' },
  bannerSubtitle: { fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.body, textAlign: 'center', marginTop: spacing.xs },
  guidanceCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
  guidanceHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  guidanceTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.subtitle, color: colors.gray[800] },
  guidanceText: { fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.body, color: colors.gray[600], lineHeight: 22, marginBottom: spacing.sm },
  phcBox: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.error[50], borderRadius: radius.md, padding: spacing.md, marginTop: spacing.sm },
  phcText: { flex: 1, fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.body, color: colors.error[700], lineHeight: 22 },
  metricsCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
  metricsTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.subtitle, color: colors.gray[800], marginBottom: spacing.md },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.gray[100] },
  metricLabel: { fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.body, color: colors.gray[600] },
  metricValue: { fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.body, color: colors.gray[800] },
  summaryText: { fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.body, color: colors.gray[600], lineHeight: 22, marginTop: spacing.xs },
  disclaimerCard: { backgroundColor: colors.warning[50], borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.warning[100] },
  disclaimerTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.body, color: colors.warning[700], marginBottom: spacing.xs },
  disclaimerText: { fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption, color: colors.warning[700], lineHeight: 20 },
  navRow: { flexDirection: 'row', gap: spacing.md },
});
