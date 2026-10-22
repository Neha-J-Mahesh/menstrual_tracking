import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import type { RiskLevel } from '../data/types';

interface RiskBadgeProps {
  level: RiskLevel;
  label: string;
  style?: ViewStyle;
}

const riskColors: Record<RiskLevel, { bg: string; text: string; border: string }> = {
  severe: { bg: colors.error[50], text: colors.error[700], border: colors.error[500] },
  moderate: { bg: colors.warning[50], text: colors.warning[700], border: colors.warning[500] },
  mild: { bg: '#FEF9E7', text: '#7D6B0A', border: '#F5C842' },
  low: { bg: colors.success[50], text: colors.success[700], border: colors.success[500] },
};

export function RiskBadge({ level, label, style }: RiskBadgeProps) {
  const c = riskColors[level];
  return (
    <View style={[styles.container, { backgroundColor: c.bg, borderColor: c.border }, style]}>
      <Text style={[styles.text, { color: c.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.body,
  },
});

interface HeaderProps {
  title: string;
  subtitle?: string;
  titleStyle?: TextStyle;
}

export function ScreenHeader({ title, subtitle, titleStyle }: HeaderProps) {
  return (
    <View style={headerStyles.headerContainer}>
      <Text style={[headerStyles.headerTitle, titleStyle]}>{title}</Text>
      {subtitle ? <Text style={headerStyles.headerSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const headerStyles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: typography.fontSize.heading,
    color: colors.gray[800],
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
});

export { headerStyles };
