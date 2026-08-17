import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, typography } from '@/design/tokens';

export function OfflineBanner() {
  return (
    <View accessibilityLiveRegion="polite" style={styles.root}>
      <MaterialCommunityIcons name="cloud-off-outline" size={18} color={colors.textSecondary} />
      <Text style={styles.text}>オフラインでも記録を続けられます</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { minHeight: 40, borderRadius: radii.compact, backgroundColor: colors.surface, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { ...typography.caption, color: colors.textSecondary },
});
