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
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radii, spacing, typography } from '@/design/tokens';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SmoothPressable({
  children,
  style,
  disabled,
  onPressIn,
  onPressOut,
  ...props
}: Omit<ComponentProps<typeof Pressable>, 'style'> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const reducedMotion = useReducedMotion();
  const pressed = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - pressed.value * 0.08,
    transform: [{ scale: 1 - pressed.value * 0.012 }],
  }));

  return (
    <AnimatedPressable
      {...props}
      disabled={disabled}
      onPressIn={(event) => {
        pressed.value = withTiming(1, { duration: reducedMotion ? 0 : 80 });
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        pressed.value = withTiming(0, { duration: reducedMotion ? 0 : 150 });
        onPressOut?.(event);
      }}
      style={[style, animatedStyle]}>
      {children}
    </AnimatedPressable>
  );
}

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
  const insets = useSafeAreaInsets();
  const content = <View style={[styles.content, contentStyle]}>{children}</View>;
  const phone = (
    <SafeAreaView style={[styles.phone, !scroll && styles.phoneStatic]} edges={['top', 'right', 'left']}>
      <View style={[styles.contentFrame, { paddingBottom: Math.max(32, insets.bottom + 20) }]}>{content}</View>
    </SafeAreaView>
  );
  return (
    <View style={styles.canvas} testID={testID}>
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          accessibilityLabel="画面コンテンツ"
          tabIndex={0}
          showsVerticalScrollIndicator
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="never">
          {phone}
        </ScrollView>
      ) : (
        <View style={styles.staticViewport}>{phone}</View>
      )}
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
    <SmoothPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      testID={testID}
      style={[styles.primaryButton, (disabled || loading) && styles.disabled]}>
      {loading ? <ActivityIndicator color={colors.onAccent} /> : null}
      {!loading && icon ? <MaterialCommunityIcons name={icon} size={22} color={colors.onAccent} /> : null}
      {!loading ? <Text style={styles.primaryLabel}>{label}</Text> : null}
    </SmoothPressable>
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
    <SmoothPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[
        styles.iconButton,
        { width: size, height: size, borderRadius: size / 2 },
        accent && styles.iconButtonAccent,
      ]}>
      <MaterialCommunityIcons name={icon} size={size * 0.46} color={accent ? colors.onAccent : colors.textPrimary} />
    </SmoothPressable>
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
    <SmoothPressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.pill, selected && styles.pillSelected]}>
      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{label}</Text>
    </SmoothPressable>
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
    <SmoothPressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={subtitle ? `${title}、${subtitle}` : title}
      onPress={onPress}
      style={[styles.selectionCard, selected && styles.selectionSelected]}>
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
    </SmoothPressable>
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
  canvas: { flex: 1, width: '100%', backgroundColor: colors.canvas },
  phone: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: colors.bg,
  },
  phoneStatic: { flex: 1 },
  staticViewport: { flex: 1, width: '100%', alignItems: 'center' },
  scroll: { flex: 1, width: '100%' },
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  contentFrame: { flexGrow: 1, width: '100%' },
  content: { flexGrow: 1, paddingHorizontal: 20 },
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
