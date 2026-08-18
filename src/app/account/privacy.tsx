import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomSheet, IconButton, PrimaryButton, Screen, SmoothPressable, TopBar } from '@/components/primitives';
import { colors, radii, spacing, typography } from '@/design/tokens';
import { deleteCloudAccount } from '@/services/supabase';
import { useAppStore } from '@/state/app-store';

export default function PrivacyScreen() {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const resetAll = useAppStore((state) => state.resetAll);
  const remove = async () => {
    await deleteCloudAccount().catch(() => undefined);
    resetAll();
    await useAppStore.persist.clearStorage();
    setDeleteOpen(false);
    router.replace('/(onboarding)/welcome');
  };
  return (
    <Screen>
      <TopBar left={<IconButton icon="arrow-left" label="戻る" onPress={() => router.back()} />} title="プライバシー" />
      <Text style={styles.title}>データとプライバシー</Text>
      <Text style={styles.subtitle}>NXTSETは、ルート作成と記録に必要な情報だけを扱います。</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>保存するもの</Text>
        <Text style={styles.cardText}>目標、ジムの器具状態、トレーニング結果、難易度、追加したプロテイン記録、表示設定。</Text>
        <Text style={styles.cardTitle}>保存しないもの</Text>
        <Text style={styles.cardText}>全食事、カメラ映像、正確な総タンパク質量、医療診断、公開プロフィール。</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>外部の実演動画</Text>
        <Text style={styles.cardText}>「実演を見る」を押したときだけYouTubeプレイヤーを読み込みます。読み込み後は、Google / YouTubeへ端末・再生に関する情報が送信される場合があります。</Text>
        <SmoothPressable accessibilityRole="link" onPress={() => Linking.openURL('https://www.youtube.com/t/terms')} style={styles.policyLink}>
          <Text style={styles.policyLinkText}>YouTube 利用規約</Text>
        </SmoothPressable>
        <SmoothPressable accessibilityRole="link" onPress={() => Linking.openURL('https://policies.google.com/privacy')} style={styles.policyLink}>
          <Text style={styles.policyLinkText}>Google プライバシーポリシー</Text>
        </SmoothPressable>
      </View>
      <Pressable accessibilityRole="button" onPress={() => setDeleteOpen(true)} style={styles.deleteButton}><Text style={styles.deleteText}>この端末のデータを削除</Text></Pressable>
      <BottomSheet visible={deleteOpen} title="データを削除しますか？" onClose={() => setDeleteOpen(false)}>
        <Text style={styles.warning}>トレーニング、進捗、プロテイン、ジム情報を削除します。連携していないデモデータは復元できません。</Text>
        <PrimaryButton label="すべて削除する" onPress={remove} />
        <Pressable accessibilityRole="button" onPress={() => setDeleteOpen(false)} style={styles.cancel}><Text style={styles.cancelText}>やめる</Text></Pressable>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.displayL, color: colors.textPrimary, marginTop: spacing.section },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 10 },
  card: { marginTop: spacing.section, borderRadius: radii.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 18, gap: 8 },
  cardTitle: { ...typography.label, color: colors.textPrimary, marginTop: 6 },
  cardText: { ...typography.body, color: colors.textSecondary },
  policyLink: { minHeight: 44, justifyContent: 'center', borderTopWidth: 1, borderTopColor: colors.border },
  policyLinkText: { ...typography.label, color: colors.accent },
  deleteButton: { minHeight: 56, marginTop: spacing.major, borderRadius: 999, borderWidth: 1, borderColor: colors.danger, alignItems: 'center', justifyContent: 'center' },
  deleteText: { ...typography.label, color: colors.danger },
  warning: { ...typography.body, color: colors.textSecondary, marginBottom: 20 },
  cancel: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  cancelText: { ...typography.label, color: colors.textSecondary },
});
