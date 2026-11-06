import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { Palette } from '../theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  palette: Palette;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  compact?: boolean;
};

export function AppButton({
  label, onPress, palette, variant = 'primary', disabled = false, loading = false, compact = false,
}: ButtonProps) {
  const backgroundColor = variant === 'primary' ? palette.primary
    : variant === 'danger' ? palette.danger
      : variant === 'secondary' ? palette.surfaceSecondary : 'transparent';
  const color = variant === 'primary' || variant === 'danger' ? '#FFFFFF' : palette.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        compact && styles.buttonCompact,
        { backgroundColor, borderColor: palette.border, opacity: disabled ? 0.5 : pressed ? 0.82 : 1 },
        variant === 'outline' && styles.outline,
      ]}
    >
      {loading ? <ActivityIndicator color={color} /> : <Text style={[styles.buttonText, { color }]}>{label}</Text>}
    </Pressable>
  );
}

type FieldProps = TextInputProps & {
  label: string;
  palette: Palette;
};

export function Field({ label, palette, style, ...props }: FieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
      <TextInput
        placeholderTextColor={palette.muted}
        selectionColor={palette.primary}
        style={[
          styles.input,
          { backgroundColor: palette.input, borderColor: palette.border, color: palette.text },
          style,
        ]}
        {...props}
      />
    </View>
  );
}

export function SectionTitle({ title, palette, subtitle }: { title: string; palette: Palette; subtitle?: string }) {
  return (
    <View style={styles.sectionTitleWrap}>
      <Text style={[styles.sectionTitle, { color: palette.text }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: palette.muted }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  buttonCompact: { minHeight: 38, paddingHorizontal: 12, borderRadius: 10 },
  buttonText: { fontSize: 14, fontWeight: '700' },
  outline: { borderWidth: 1 },
  fieldWrap: { gap: 7, marginBottom: 15 },
  label: { fontSize: 13, fontWeight: '700' },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 10,
    fontSize: 15,
  },
  sectionTitleWrap: { gap: 4, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 13, lineHeight: 19 },
});
