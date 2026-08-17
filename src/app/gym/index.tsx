import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconButton, Screen, TopBar } from '@/components/primitives';
import { exercises } from '@/content';
import { colors, radii, spacing, typography } from '@/design/tokens';
import { useAppStore } from '@/state/app-store';
import type { EquipmentStatus } from '@/types';

const statusCopy: Record<EquipmentStatus, { label: string; icon: 'check-circle-outline' | 'help-circle-outline' | 'minus-circle-outline' }> = {
  present: { label: '確認済み', icon: 'check-circle-outline' },
  unknown: { label: '未確認', icon: 'help-circle-outline' },
  absent: { label: 'ない', icon: 'minus-circle-outline' },
};

export default function GymScreen() {
  const profile = useAppStore((state) => state.profile);
  const equipment = useAppStore((state) => state.equipment);
  const unique = Array.from(new Map(exercises.map((exercise) => [exercise.equipmentId, exercise.equipmentName])).entries()).slice(0, 12);
  const counts = unique.reduce<Record<EquipmentStatus, number>>((acc, [id]) => {
    acc[equipment[id] ?? 'unknown'] += 1;
    return acc;
  }, { present: 0, unknown: 0, absent: 0 });
  return (
    <Screen>
      <TopBar left={<IconButton icon="arrow-left" label="戻る" onPress={() => router.back()} />} title="ジム" />
      <Text style={styles.title}>{profile.gymName}</Text>
      <Text style={styles.subtitle}>使いながら、器具の情報が育ちます。</Text>
      <View style={styles.summary}>
        {(['present', 'unknown', 'absent'] as const).map((status) => (
          <View key={status} style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{counts[status]}</Text>
            <Text style={styles.summaryLabel}>{statusCopy[status].label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.section}>器具</Text>
      {unique.map(([id, name]) => {
        const status = equipment[id] ?? 'unknown';
        return (
          <Pressable accessibilityRole="button" accessibilityLabel={`${name}、${statusCopy[status].label}`} key={id} style={styles.row}>
            <MaterialCommunityIcons name="dumbbell" size={20} color={colors.textSecondary} />
            <Text style={styles.rowName}>{name}</Text>
            <MaterialCommunityIcons name={statusCopy[status].icon} size={20} color={status === 'present' ? colors.accent : status === 'absent' ? colors.warning : colors.textMuted} />
            <Text style={styles.rowStatus}>{statusCopy[status].label}</Text>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.displayL, color: colors.textPrimary, marginTop: spacing.section },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 8 },
  summary: { minHeight: 112, marginTop: spacing.section, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { ...typography.title, color: colors.textPrimary },
  summaryLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  section: { ...typography.caption, color: colors.textMuted, marginTop: spacing.major, marginBottom: 4 },
  row: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowName: { ...typography.body, color: colors.textPrimary, flex: 1 },
  rowStatus: { ...typography.caption, color: colors.textSecondary },
});

