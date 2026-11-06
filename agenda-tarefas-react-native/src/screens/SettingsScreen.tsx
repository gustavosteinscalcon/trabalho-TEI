import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { UserProfile, AppTheme } from '../types';
import { Palette } from '../theme';
import { AppButton, SectionTitle } from '../components/ui';

interface Props {
  user: UserProfile;
  palette: Palette;
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  onLogout: () => void;
}

export function SettingsScreen({ user, palette, theme, onThemeChange, onLogout }: Props) {
  return (
    <View style={styles.container}>
      <SectionTitle title="Configurações" subtitle="Personalize a aparência e consulte as informações da conta." palette={palette} />

      <View style={[styles.panel, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Text style={[styles.panelTitle, { color: palette.text }]}>Aparência da interface</Text>
        <Text style={[styles.description, { color: palette.muted }]}>Escolha o tema utilizado nas telas do aplicativo.</Text>
        <View style={styles.themeRow}>
          <Pressable onPress={() => onThemeChange('light')} style={[styles.themeChoice, { borderColor: theme === 'light' ? palette.primary : palette.border, backgroundColor: theme === 'light' ? palette.primarySoft : palette.surfaceSecondary }]}>
            <Text style={[styles.themeChoiceTitle, { color: theme === 'light' ? palette.primary : palette.text }]}>Claro</Text>
            <Text style={[styles.themeChoiceSub, { color: palette.muted }]}>Fundo claro</Text>
          </Pressable>
          <Pressable onPress={() => onThemeChange('dark')} style={[styles.themeChoice, { borderColor: theme === 'dark' ? palette.primary : palette.border, backgroundColor: theme === 'dark' ? palette.primarySoft : palette.surfaceSecondary }]}>
            <Text style={[styles.themeChoiceTitle, { color: theme === 'dark' ? palette.primary : palette.text }]}>Escuro</Text>
            <Text style={[styles.themeChoiceSub, { color: palette.muted }]}>Fundo escuro</Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.panel, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Text style={[styles.panelTitle, { color: palette.text }]}>Conta</Text>
        <View style={styles.infoLine}>
          <Text style={[styles.infoLabel, { color: palette.muted }]}>Nome</Text>
          <Text style={[styles.infoValue, { color: palette.text }]}>{user.name}</Text>
        </View>
        <View style={[styles.infoLine, { borderTopColor: palette.border, borderTopWidth: 1, paddingTop: 13, marginTop: 13 }]}>
          <Text style={[styles.infoLabel, { color: palette.muted }]}>E-mail</Text>
          <Text style={[styles.infoValue, { color: palette.text }]}>{user.email}</Text>
        </View>
      </View>

      <View style={[styles.note, { backgroundColor: palette.surfaceSecondary }]}>
        <Text style={[styles.noteTitle, { color: palette.text }]}>Sobre esta versão</Text>
        <Text style={[styles.noteText, { color: palette.muted }]}>A personalização da interface está limitada aos temas claro e escuro. Os dados ficam salvos neste aparelho; contas e compartilhamentos ainda não são sincronizados pela internet.</Text>
      </View>

      <View style={{ marginTop: 'auto' }}>
        <AppButton label="Sair da conta" palette={palette} variant="outline" onPress={onLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, paddingBottom: 28 },
  panel: { borderWidth: 1, borderRadius: 15, padding: 16, marginBottom: 12 },
  panelTitle: { fontSize: 15, fontWeight: '800' },
  description: { fontSize: 12, lineHeight: 18, marginTop: 5 },
  themeRow: { flexDirection: 'row', gap: 10, marginTop: 15 },
  themeChoice: { flex: 1, borderWidth: 1, borderRadius: 11, padding: 13 },
  themeChoiceTitle: { fontSize: 13, fontWeight: '800' },
  themeChoiceSub: { fontSize: 10, marginTop: 4 },
  infoLine: { marginTop: 15, gap: 5 },
  infoLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  infoValue: { fontSize: 14, fontWeight: '600' },
  note: { padding: 15, borderRadius: 13, marginTop: 4 },
  noteTitle: { fontSize: 12, fontWeight: '800' },
  noteText: { fontSize: 11, lineHeight: 17, marginTop: 5 },
});
