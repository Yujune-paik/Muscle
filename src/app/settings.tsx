import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { IconButton, Screen, TopBar } from '@/components/primitives';
import { colors, spacing, typography } from '@/design/tokens';

export default function SettingsScreen() {
  const [haptics, setHaptics] = useState(true);
  const [sound, setSound] = useState(false);
  const rows = [
    { label: '単位', value: 'kg / cm' },
    { label: '言語', value: '日本語' },
  ];
  return (
    <Screen>
      <TopBar left={<IconButton icon="arrow-left" label="戻る" onPress={() => router.back()} />} title="設定" />
      <Text style={styles.title}>表示と通知</Text>
      <Text style={styles.section}>基本</Text>
      {rows.map((row) => <Pressable accessibilityRole="button" key={row.label} style={styles.row}><Text style={styles.rowLabel}>{row.label}</Text><Text style={styles.rowValue}>{row.value}</Text><MaterialCommunityIcons name="chevron-right" size={21} color={colors.textMuted} /></Pressable>)}
      <Text style={styles.section}>トレーニング中</Text>
      <View style={styles.row}><Text style={styles.rowLabel}>触覚フィードバック</Text><Switch value={haptics} onValueChange={setHaptics} trackColor={{ true: colors.accent, false: colors.border }} thumbColor={colors.textPrimary} /></View>
      <View style={styles.row}><Text style={styles.rowLabel}>休憩終了の音</Text><Switch value={sound} onValueChange={setSound} trackColor={{ true: colors.accent, false: colors.border }} thumbColor={colors.textPrimary} /></View>
      <Text style={styles.note}>動きを減らす設定は、端末のアクセシビリティ設定に自動で合わせます。</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.displayL, color: colors.textPrimary, marginTop: spacing.section },
  section: { ...typography.caption, color: colors.textMuted, marginTop: spacing.major, marginBottom: 4 },
  row: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { ...typography.body, color: colors.textPrimary, flex: 1 },
  rowValue: { ...typography.caption, color: colors.textSecondary },
  note: { ...typography.caption, color: colors.textMuted, marginTop: 18 },
});

