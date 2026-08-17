import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomSheet, IconButton, PillButton, PrimaryButton, Screen, TopBar } from '@/components/primitives';
import { DifficultyChoice } from '@/components/workout';
import { colors, radii, spacing, typography } from '@/design/tokens';
import { completionHaptic } from '@/services/haptics';
import { useAppStore } from '@/state/app-store';
import type { Difficulty } from '@/types';

export default function FeedbackScreen() {
  const { sessionId, itemId } = useLocalSearchParams<{ sessionId: string; itemId: string }>();
  const session = useAppStore((state) => state.activeSession);
  const submitFeedback = useAppStore((state) => state.submitFeedback);
  const [painOpen, setPainOpen] = useState(false);
  const [painLocation, setPainLocation] = useState<string>();
  const [painSeverity, setPainSeverity] = useState<'mild' | 'persistent' | 'severe'>('mild');
  if (!session || session.id !== sessionId) return <Redirect href="/(tabs)/today" />;
  const index = session.items.findIndex((item) => item.id === itemId);
  const nextItem = session.items[index + 1];
  const isLast = !nextItem;

  const select = (difficulty: Difficulty) => {
    submitFeedback(itemId, difficulty, { reported: Boolean(painLocation), location: painLocation, severity: painLocation ? painSeverity : undefined });
    if (isLast) {
      completionHaptic().catch(() => undefined);
      router.replace(`/workout/${session.id}/complete`);
    } else {
      router.replace(`/workout/${session.id}/exercise/${nextItem.id}`);
    }
  };

  return (
    <Screen contentStyle={styles.content} testID="feedback-screen">
      <TopBar left={<IconButton icon="arrow-left" label="種目へ戻る" onPress={() => router.back()} />} title={`${index + 1} / ${session.items.length}`} />
      <View style={styles.icon}><MaterialCommunityIcons name="signal" size={28} color={colors.accent} /></View>
      <Text style={styles.title}>この種目、{`\n`}どうでしたか？</Text>
      <Text style={styles.subtitle}>一度だけ答えると、次回の重さと回数を調整します。</Text>
      {painLocation ? (
        <View style={styles.painSaved}>
          <MaterialCommunityIcons name="alert-outline" size={19} color={colors.warning} />
          <Text style={styles.painSavedText}>{painLocation}の違和感を記録しました。次回は負荷を上げません。</Text>
        </View>
      ) : null}
      <View style={styles.choices}>
        {(['easy', 'good', 'hard'] as const).map((difficulty) => <DifficultyChoice key={difficulty} value={difficulty} onPress={select} />)}
      </View>
      <Pressable accessibilityRole="button" onPress={() => setPainOpen(true)} style={styles.painButton}>
        <MaterialCommunityIcons name="alert-circle-outline" size={19} color={colors.warning} />
        <Text style={styles.painText}>痛み・違和感があった</Text>
      </Pressable>

      <BottomSheet visible={painOpen} title="痛み・違和感" onClose={() => setPainOpen(false)}>
        <Text style={styles.sheetLabel}>場所</Text>
        <View style={styles.pills}>
          {['肩', '胸', '背中', '腰', '膝', 'その他'].map((location) => (
            <PillButton key={location} label={location} selected={painLocation === location} onPress={() => setPainLocation(location)} />
          ))}
        </View>
        <Text style={styles.sheetLabel}>程度</Text>
        <View style={styles.pills}>
          {([
            ['mild', '軽い'],
            ['persistent', '続く'],
            ['severe', '強い'],
          ] as const).map(([value, label]) => <PillButton key={value} label={label} selected={painSeverity === value} onPress={() => setPainSeverity(value)} />)}
        </View>
        <Text style={styles.safety}>胸の痛み、失神、強い息切れ、急なけががある場合は運動を中止し、緊急性に応じた医療相談を利用してください。</Text>
        <PrimaryButton label="記録して戻る" disabled={!painLocation} onPress={() => setPainOpen(false)} />
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { minHeight: 790 },
  icon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#282E1D', alignItems: 'center', justifyContent: 'center', marginTop: spacing.section },
  title: { ...typography.displayL, color: colors.textPrimary, marginTop: spacing.section },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 10 },
  painSaved: { marginTop: 18, borderRadius: radii.compact, backgroundColor: '#2B251A', padding: 12, flexDirection: 'row', alignItems: 'center', gap: 9 },
  painSavedText: { ...typography.caption, color: colors.textPrimary, flex: 1 },
  choices: { marginTop: spacing.major, gap: 10 },
  painButton: { minHeight: 52, marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  painText: { ...typography.label, color: colors.textSecondary },
  sheetLabel: { ...typography.label, color: colors.textSecondary, marginTop: 10, marginBottom: 10 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  safety: { ...typography.caption, color: colors.warning, marginVertical: 20 },
});

