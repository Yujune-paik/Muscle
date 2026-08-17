import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/primitives';
import { colors, spacing, typography } from '@/design/tokens';

export function OnboardingShell({
  step,
  title,
  eyebrow,
  children,
  footer,
  onBack,
}: {
  step?: number;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  footer: ReactNode;
  onBack?: () => void;
}) {
  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.header}>
        {onBack ? (
          <Pressable accessibilityRole="button" accessibilityLabel="前へ戻る" onPress={onBack} style={styles.back}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
          </Pressable>
        ) : (
          <View style={styles.back} />
        )}
        {step ? (
          <View style={styles.progressWrap}>
            <Text style={styles.progressText}>{step} / 5</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${step * 20}%` }]} />
            </View>
          </View>
        ) : null}
      </View>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.body}>{children}</View>
      <View style={styles.footer}>{footer}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { minHeight: 760 },
  header: { minHeight: 64, flexDirection: 'row', alignItems: 'center' },
  back: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  progressWrap: { flex: 1, alignItems: 'flex-end', gap: 8 },
  progressText: { ...typography.caption, color: colors.textSecondary },
  progressTrack: { width: 112, height: 3, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.accent },
  copy: { marginTop: spacing.section },
  eyebrow: { ...typography.caption, color: colors.accent, letterSpacing: 1.4, marginBottom: 8 },
  title: { ...typography.displayL, color: colors.textPrimary },
  body: { marginTop: spacing.major, gap: spacing.related },
  footer: { marginTop: 'auto', paddingTop: spacing.major },
});

