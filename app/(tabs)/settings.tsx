import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Globe, User, Info, ChevronRight, Trash2 } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../src/theme';
import { useI18n } from '../../src/i18n/I18nProvider';
import { useProfile } from '../../src/context/ProfileProvider';
import { Card } from '../../src/components/Card';
import type { Language } from '../../src/data/types';
import { deleteProfile } from '../../src/db/database';

export default function SettingsScreen() {
  const { t, lang, setLang } = useI18n();
  const { activeProfile, profiles, setActiveProfileId, refreshProfiles } = useProfile();

  const handleDelete = () => {
    Alert.alert(t('confirmDelete'), t('deleteConfirmMessage'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('deleteProfile'),
        style: 'destructive',
        onPress: async () => {
          if (activeProfile) {
            await deleteProfile(activeProfile.id);
            await refreshProfiles();
            if (profiles.length > 1) {
              const next = profiles.find((p) => p.id !== activeProfile.id);
              if (next) await setActiveProfileId(next.id);
            } else {
              router.replace('/create-profile');
            }
          }
        },
      },
    ]);
  };

  const languages: { value: Language; label: string }[] = [
    { value: 'en', label: t('english') },
    { value: 'kn', label: t('kannada') },
    { value: 'te', label: t('telugu') },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>{t('settings')}</Text>

        {/* Language Section */}
        <Text style={styles.sectionLabel}>{t('language')}</Text>
        <Card style={styles.sectionCard}>
          {languages.map((l, i) => (
            <Pressable
              key={l.value}
              style={({ pressed }) => [
                styles.langRow,
                i < languages.length - 1 && styles.langRowBorder,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => setLang(l.value)}
            >
              <Globe size={22} color={colors.gray[500]} />
              <Text style={styles.langLabel}>{l.label}</Text>
              <View style={[styles.radio, lang === l.value && styles.radioSelected]}>
                {lang === l.value && <View style={styles.radioDot} />}
              </View>
            </Pressable>
          ))}
        </Card>

        {/* Profile Section */}
        <Text style={styles.sectionLabel}>{t('profile')}</Text>
        <Card style={styles.sectionCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>
                {activeProfile?.nickname.charAt(0).toUpperCase() ?? '?'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{activeProfile?.nickname ?? '—'}</Text>
              <Text style={styles.profileInfo}>
                {activeProfile?.age} yrs | {activeProfile?.pregnancy_status === 'pregnant' ? t('pregnant') : t('notPregnant')}
              </Text>
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [styles.menuRow, pressed && { opacity: 0.7 }]}
            onPress={() => router.push('/create-profile?edit=true')}
          >
            <User size={22} color={colors.teal[500]} />
            <Text style={styles.menuLabel}>{t('editProfile')}</Text>
            <ChevronRight size={18} color={colors.gray[300]} />
          </Pressable>
        </Card>

        {/* Profile Switch */}
        {profiles.length > 1 && (
          <Card style={styles.sectionCard}>
            <Text style={styles.switchLabel}>{t('switchProfile')}</Text>
            {profiles.map((p) => (
              <Pressable
                key={p.id}
                style={({ pressed }) => [styles.langRow, pressed && { opacity: 0.7 }]}
                onPress={() => setActiveProfileId(p.id)}
              >
                <View style={styles.profileMini}>
                  <Text style={styles.profileMiniText}>{p.nickname.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.langLabel}>{p.nickname}</Text>
                <View style={[styles.radio, activeProfile?.id === p.id && styles.radioSelected]}>
                  {activeProfile?.id === p.id && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            ))}
          </Card>
        )}

        {/* About */}
        <Text style={styles.sectionLabel}>{t('aboutApp')}</Text>
        <Card style={styles.sectionCard}>
          <View style={styles.aboutRow}>
            <Info size={22} color={colors.gray[500]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.aboutTitle}>{t('appName')}</Text>
              <Text style={styles.aboutVersion}>Version 1.0.0</Text>
              <Text style={styles.aboutDesc}>{t('tagline')}</Text>
            </View>
          </View>
          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>{t('fullDisclaimer')}</Text>
          </View>
        </Card>

        {/* Delete Profile */}
        <Pressable
          style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.8 }]}
          onPress={handleDelete}
        >
          <Trash2 size={20} color={colors.error[500]} />
          <Text style={styles.deleteText}>{t('deleteProfile')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  screenTitle: {
    fontFamily: typography.fontFamily.extraBold, fontSize: typography.fontSize.heading,
    color: colors.gray[800], paddingTop: spacing.lg, paddingBottom: spacing.md,
  },
  sectionLabel: {
    fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.caption,
    color: colors.gray[500], marginBottom: spacing.sm, marginTop: spacing.md, marginLeft: spacing.xs,
  },
  sectionCard: { marginBottom: spacing.md },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  langRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray[100] },
  langLabel: {
    flex: 1, fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.body,
    color: colors.gray[800],
  },
  radio: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.gray[300],
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.teal[500] },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.teal[500] },
  profileHeader: { flexDirection: 'row', gap: spacing.md, alignItems: 'center', marginBottom: spacing.md },
  profileAvatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.teal[500],
    alignItems: 'center', justifyContent: 'center',
  },
  profileAvatarText: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.subtitle,
    color: colors.white,
  },
  profileName: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.subtitle,
    color: colors.gray[800],
  },
  profileInfo: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[500],
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.gray[100],
  },
  menuLabel: {
    flex: 1, fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.body,
    color: colors.gray[800],
  },
  switchLabel: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.body,
    color: colors.gray[800], marginBottom: spacing.sm,
  },
  profileMini: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.pink[200],
    alignItems: 'center', justifyContent: 'center',
  },
  profileMiniText: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.body,
    color: colors.pink[800],
  },
  aboutRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  aboutTitle: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.body,
    color: colors.gray[800],
  },
  aboutVersion: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[400],
  },
  aboutDesc: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[500], marginTop: 4,
  },
  disclaimerBox: {
    backgroundColor: colors.gray[100], borderRadius: radius.md, padding: spacing.md,
  },
  disclaimerText: {
    fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.caption,
    color: colors.gray[500], lineHeight: 18,
  },
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.error[50],
    borderWidth: 1, borderColor: colors.error[100], marginTop: spacing.md,
  },
  deleteText: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.body,
    color: colors.error[500],
  },
});
