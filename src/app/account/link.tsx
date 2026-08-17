import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { IconButton, InlineError, PrimaryButton, Screen, TopBar } from '@/components/primitives';
import { colors, radii, spacing, typography } from '@/design/tokens';
import { isCloudMode, sendMagicLink } from '@/services/supabase';

export default function AccountLinkScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>();
  const valid = /^\S+@\S+\.\S+$/.test(email);
  const submit = async () => {
    if (!valid) return;
    setLoading(true);
    setMessage(undefined);
    try {
      await sendMagicLink(email, Linking.createURL('/'));
      setMessage('確認用のリンクを送りました。メールからNXTSETへ戻ってください。');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '連携を開始できませんでした。');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TopBar left={<IconButton icon="arrow-left" label="戻る" onPress={() => router.back()} />} title="アカウント" />
        <Text style={styles.title}>データを守る</Text>
        <Text style={styles.subtitle}>メールを連携すると、端末を変えてもトレーニング記録を復元できます。</Text>
        {!isCloudMode ? <View style={styles.demoNote}><Text style={styles.demoTitle}>デモモード</Text><Text style={styles.demoText}>連携画面は実装済みです。クラウド用の環境変数を設定すると、Supabaseの匿名アカウントをメールへ連携できます。</Text></View> : null}
        <Text style={styles.label}>メールアドレス</Text>
        <TextInput
          accessibilityLabel="メールアドレス"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        {message ? <InlineError message={message} /> : null}
        <View style={styles.button}><PrimaryButton label="確認リンクを送る" onPress={submit} disabled={!valid || !isCloudMode} loading={loading} /></View>
        <Text style={styles.note}>リンクする前にブラウザデータを消すと、ローカル記録を復元できない場合があります。</Text>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.displayL, color: colors.textPrimary, marginTop: spacing.section },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 10 },
  demoNote: { marginTop: spacing.section, borderRadius: radii.card, padding: 16, backgroundColor: '#20231A', borderWidth: 1, borderColor: '#3C4726' },
  demoTitle: { ...typography.label, color: colors.accent },
  demoText: { ...typography.caption, color: colors.textSecondary, marginTop: 5 },
  label: { ...typography.label, color: colors.textSecondary, marginTop: spacing.major, marginBottom: 8 },
  input: { minHeight: 56, borderRadius: radii.compact, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, color: colors.textPrimary, fontSize: 16, paddingHorizontal: 16 },
  button: { marginTop: 18 },
  note: { ...typography.caption, color: colors.textMuted, marginTop: 14 },
});

