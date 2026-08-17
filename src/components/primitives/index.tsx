import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps, ReactNode } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radii, spacing, typography } from '@/design/tokens';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export function Screen({
  children,
  scroll = true,
  contentStyle,
  testID,
}: {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const content = <View style={[styles.content, contentStyle]}>{children}</View>;
  return (
    <View style={styles.canvas} testID={testID}>
      <SafeAreaView style={styles.phone} edges={['top', 'right', 'left']}>
        {scroll ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </SafeAreaView>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  disabled = false,
  loading = false,
  accessibilityLabel,
  testID,
}: {
  label: string;
  onPress: () => void;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.primaryButton,
        pressed && styles.primaryPressed,
        (disabled || loading) && styles.disabled,
      ]}>
      {loading ? <ActivityIndicator color={colors.onAccent} /> : null}
      {!loading && icon ? <MaterialCommunityIcons name={icon} size={22} color={colors.onAccent} /> : null}
      {!loading ? <Text style={styles.primaryLabel}>{label}</Text> : null}
    </Pressable>
  );
}

export function IconButton({
  icon,
  label,
  onPress,
  accent = false,
  size = 48,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  accent?: boolean;
  size?: number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        { width: size, height: size, borderRadius: size / 2 },
        accent && styles.iconButtonAccent,
        pressed && { opacity: 0.72 },
      ]}>
      <MaterialCommunityIcons name={icon} size={size * 0.46} color={accent ? colors.onAccent : colors.textPrimary} />
    </Pressable>
  );
}

export function PillButton({
  label,
  selected = false,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.pill, selected && styles.pillSelected, pressed && { opacity: 0.75 }]}>
      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function SelectionCard({
  title,
  subtitle,
  selected,
  onPress,
  icon,
}: {
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
  icon?: IconName;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={subtitle ? `${title}、${subtitle}` : title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.selectionCard,
        selected && styles.selectionSelected,
        pressed && { transform: [{ scale: 0.99 }] },
      ]}>
      {icon ? (
        <View style={[styles.selectionIcon, selected && styles.selectionIconSelected]}>
          <MaterialCommunityIcons name={icon} size={22} color={selected ? colors.onAccent : colors.textSecondary} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.selectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.selectionSubtitle}>{subtitle}</Text> : null}
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

export function TopBar({
  title,
  left,
  right,
}: {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <View style={styles.topBar}>
      <View style={styles.topSide}>{left}</View>
      {title ? <Text style={styles.topTitle}>{title}</Text> : <View />}
      <View style={[styles.topSide, { alignItems: 'flex-end' }]}>{right}</View>
    </View>
  );
}

export function BottomSheet({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable accessibilityRole="button" accessibilityLabel="閉じる" style={styles.modalBackdrop} onPress={onClose} />
        <SafeAreaView style={styles.sheet} edges={['bottom']}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <IconButton icon="close" label="閉じる" onPress={onClose} size={44} />
          </View>
          {children}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

export function InlineError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View accessibilityRole="alert" style={styles.errorBox}>
      <MaterialCommunityIcons name="alert-circle-outline" size={20} color={colors.warning} />
      <Text style={styles.errorText}>{message}</Text>
      {onRetry ? (
        <Pressable accessibilityRole="button" onPress={onRetry}>
          <Text style={styles.errorAction}>再試行</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { flex: 1, backgroundColor: colors.canvas, alignItems: 'center' },
  phone: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: colors.bg,
    ...(Platform.OS === 'web' ? { minHeight: '100vh' as never } : null),
  },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 32 },
  primaryButton: {
    minHeight: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
  },
  primaryPressed: { backgroundColor: colors.accentPressed, transform: [{ scale: 0.99 }] },
  primaryLabel: { ...typography.body, fontWeight: '700', color: colors.onAccent },
  disabled: { opacity: 0.42 },
  iconButton: {
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconButtonAccent: { backgroundColor: colors.accent, borderColor: colors.accent },
  pill: {
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  pillText: { ...typography.label, color: colors.textSecondary },
  pillTextSelected: { color: colors.onAccent },
  selectionCard: {
    minHeight: 80,
    padding: spacing.standard,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.related,
  },
  selectionSelected: { borderColor: colors.accent, backgroundColor: colors.surfaceRaised },
  selectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
  },
  selectionIconSelected: { backgroundColor: colors.accent },
  selectionTitle: { ...typography.body, fontWeight: '600', color: colors.textPrimary },
  selectionSubtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 3 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.textMuted, padding: 4 },
  radioSelected: { borderColor: colors.accent },
  radioDot: { flex: 1, borderRadius: 8, backgroundColor: colors.accent },
  topBar: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topSide: { width: 72, justifyContent: 'center' },
  topTitle: { ...typography.label, color: colors.textSecondary, textAlign: 'center' },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.72)' },
  sheet: {
    backgroundColor: colors.surfaceRaised,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    paddingHorizontal: 20,
    paddingBottom: 12,
    maxHeight: '86%',
  },
  sheetHandle: { width: 44, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginTop: 10 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 12 },
  sheetTitle: { ...typography.title, color: colors.textPrimary, flex: 1 },
  errorBox: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderRadius: radii.compact,
    backgroundColor: '#2A2318',
    alignItems: 'center',
  },
  errorText: { ...typography.caption, color: colors.textPrimary, flex: 1 },
  errorAction: { ...typography.label, color: colors.accent },
});
