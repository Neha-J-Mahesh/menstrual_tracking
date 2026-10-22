import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Activity, Stethoscope } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../src/theme';
import { useI18n } from '../src/i18n/I18nProvider';
import { Button } from '../src/components/Button';
import { useProfile } from '../src/context/ProfileProvider';

export default function OnboardingScreen() {
  const { t } = useI18n();
  const { profiles } = useProfile();

  const handleGetStarted = () => {
    if (profiles.length === 0) {
      router.replace('/create-profile');
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Heart color={colors.white} size={40} fill={colors.white} />
          </View>
        </View>

        <Text style={styles.appName}>{t('appName')}</Text>
        <Text style={styles.tagline}>{t('tagline')}</Text>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Heart color={colors.teal[500]} size={28} />
            </View>
            <Text style={styles.featureText}>Menstrual Cycle Tracking</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Activity color={colors.teal[500]} size={28} />
            </View>
            <Text style={styles.featureText}>Multi-Modal Anaemia Screening</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Stethoscope color={colors.teal[500]} size={28} />
            </View>
            <Text style={styles.featureText}>Clinical Risk Assessment</Text>
          </View>
        </View>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>{t('fullDisclaimer')}</Text>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <Button label={t('getStarted')} onPress={handleGetStarted} size="lg" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pink[200],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.lg,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.teal[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: typography.fontSize.display,
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },
  tagline: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.subtitle,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  featuresContainer: {
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.teal[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.body,
    color: colors.gray[700],
    flex: 1,
  },
  disclaimerBox: {
    backgroundColor: colors.white + 'AA',
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.xl,
  },
  disclaimerText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomBar: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
