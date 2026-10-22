import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, radius, typography } from '../src/theme';
import { useI18n } from '../src/i18n/I18nProvider';
import { Button } from '../src/components/Button';
import { ScreenHeader } from '../src/components/RiskBadge';
import { createProfile } from '../src/db/database';
import { useProfile } from '../src/context/ProfileProvider';
import type { PregnancyStatus } from '../src/data/types';

const pregnancyOptions: { value: PregnancyStatus; labelKey: 'notPregnant' | 'pregnant' | 'postMenopause' | 'unsure' }[] = [
  { value: 'not_pregnant', labelKey: 'notPregnant' },
  { value: 'pregnant', labelKey: 'pregnant' },
  { value: 'post_menopause', labelKey: 'postMenopause' },
  { value: 'unsure', labelKey: 'unsure' },
];

export default function CreateProfileScreen() {
  const { t } = useI18n();
  const { setActiveProfileId, refreshProfiles } = useProfile();
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [pregnancyStatus, setPregnancyStatus] = useState<PregnancyStatus>('not_pregnant');
  const [cycleLen, setCycleLen] = useState('28');
  const [periodLen, setPeriodLen] = useState('5');
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!nickname.trim()) {
      setError(t('nickname'));
      return;
    }
    const ageNum = parseInt(age, 10);
    if (!ageNum || ageNum < 10 || ageNum > 70) {
      setError(t('age'));
      return;
    }
    const cycleNum = parseInt(cycleLen, 10) || 28;
    const periodNum = parseInt(periodLen, 10) || 5;

    try {
      const id = await createProfile(
        nickname.trim(),
        ageNum,
        pregnancyStatus,
        cycleNum,
        periodNum
      );
      await refreshProfiles();
      await setActiveProfileId(id);
      router.replace('/(tabs)');
    } catch {
      setError('Failed to create profile');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <ScreenHeader title={t('createProfile')} />

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.formContainer}>
          <Text style={styles.label}>{t('nickname')}</Text>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder={t('nickname')}
            placeholderTextColor={colors.gray[400]}
          />

          <Text style={styles.label}>{t('age')}</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder={t('age')}
            placeholderTextColor={colors.gray[400]}
            keyboardType="numeric"
            maxLength={3}
          />

          <Text style={styles.label}>{t('pregnancyStatus')}</Text>
          <View style={styles.optionsRow}>
            {pregnancyOptions.map((opt) => (
              <Pill
                key={opt.value}
                label={t(opt.labelKey)}
                selected={pregnancyStatus === opt.value}
                onPress={() => setPregnancyStatus(opt.value)}
              />
            ))}
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>{t('typicalCycleLen')}</Text>
              <View style={styles.numberRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={cycleLen}
                  onChangeText={setCycleLen}
                  keyboardType="numeric"
                  maxLength={3}
                  placeholderTextColor={colors.gray[400]}
                />
                <Text style={styles.unitLabel}>{t('days')}</Text>
              </View>
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>{t('typicalPeriodLen')}</Text>
              <View style={styles.numberRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={periodLen}
                  onChangeText={setPeriodLen}
                  keyboardType="numeric"
                  maxLength={3}
                  placeholderTextColor={colors.gray[400]}
                />
                <Text style={styles.unitLabel}>{t('days')}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomBar}>
          <Button label={t('save')} onPress={handleSave} size="lg" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Pill({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <PillButton label={label} selected={selected} onPress={onPress} />
  );
}

function PillButton({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        selected && styles.pillSelected,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollContent: {
    flexGrow: 1,
  },
  errorBox: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.error[50],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.error[100],
  },
  errorText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.body,
    color: colors.error[700],
  },
  formContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  label: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.body,
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'web' ? spacing.sm : spacing.md,
    fontSize: typography.fontSize.body,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[800],
    borderWidth: 1.5,
    borderColor: colors.gray[200],
    minHeight: 48,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pill: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
    minHeight: 48,
    justifyContent: 'center',
  },
  pillSelected: {
    borderColor: colors.teal[500],
    backgroundColor: colors.teal[50],
  },
  pillText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.body,
    color: colors.gray[600],
  },
  pillTextSelected: {
    color: colors.teal[600],
    fontFamily: typography.fontFamily.bold,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    color: colors.gray[500],
    marginLeft: spacing.sm,
  },
  bottomBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    marginTop: 'auto',
  },
});
