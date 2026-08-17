import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { IconButton, Screen, TopBar } from '@/components/primitives';
import { colors, radii, spacing, typography } from '@/design/tokens';

export default function HelpScreen() {
  return (
    <Screen>
      <TopBar left={<IconButton icon="arrow-left" label="戻る" onPress={() => router.back()} />} title="ヘルプ" />
      <Text style={styles.title}>安全に使うために</Text>
      <Text style={styles.subtitle}>NXTSETは一般的なフィットネス案内であり、医療上の診断や治療ではありません。</Text>
      <View style={styles.alert}>
        <MaterialCommunityIcons name="alert-outline" size={24} color={colors.warning} />
        <Text style={styles.alertText}>胸の痛み、失神、強い息切れ、急なけががある場合は運動を中止し、緊急性に応じた医療相談を利用してください。</Text>
      </View>
      {[['痛みがあるとき', 'その種目を中止し「痛み・違和感」を記録してください。次回の負荷は上げません。'], ['持病・けが・妊娠中', '開始前に、資格を持つ医療・運動の専門家へ相談してください。'], ['器具が分からないとき', '無理に使わず、ジムスタッフへ確認するか「この器具が使えない」から代替へ進んでください。']].map(([title, body]) => (
        <View key={title} style={styles.item}><Text style={styles.itemTitle}>{title}</Text><Text style={styles.itemBody}>{body}</Text></View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.displayL, color: colors.textPrimary, marginTop: spacing.section },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 10 },
  alert: { marginTop: spacing.section, borderRadius: radii.card, backgroundColor: '#2A2318', borderWidth: 1, borderColor: '#5B4727', padding: 16, flexDirection: 'row', gap: 12 },
  alertText: { ...typography.body, color: colors.textPrimary, flex: 1 },
  item: { paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  itemTitle: { ...typography.heading, color: colors.textPrimary },
  itemBody: { ...typography.body, color: colors.textSecondary, marginTop: 7 },
});

