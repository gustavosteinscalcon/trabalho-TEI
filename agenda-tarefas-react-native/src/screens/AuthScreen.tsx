import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Palette } from '../theme';
import { AppButton, Field } from '../components/ui';

interface Props {
  palette: Palette;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
}

export function AuthScreen({ palette, onLogin, onRegister }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await onLogin(email, password);
      else await onRegister(name, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível realizar a operação.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: palette.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.brandMark, { backgroundColor: palette.primarySoft }]}>
          <Text style={[styles.brandLetter, { color: palette.primary }]}>A</Text>
        </View>
        <Text style={[styles.brand, { color: palette.text }]}>Agenda de Tarefas</Text>
        <Text style={[styles.tagline, { color: palette.muted }]}>Organize compromissos, tarefas e lembretes em um só lugar.</Text>

        <View style={[styles.panel, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.heading, { color: palette.text }]}>{mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}</Text>
          <Text style={[styles.helper, { color: palette.muted }]}>
            {mode === 'login' ? 'Entre para visualizar sua agenda.' : 'Preencha os dados para começar a usar a agenda.'}
          </Text>

          {mode === 'register' ? (
            <Field label="Nome" palette={palette} value={name} onChangeText={setName} placeholder="Seu nome" autoCapitalize="words" />
          ) : null}
          <Field label="E-mail" palette={palette} value={email} onChangeText={setEmail} placeholder="voce@exemplo.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
          <Field label="Senha" palette={palette} value={password} onChangeText={setPassword} placeholder="Sua senha" secureTextEntry autoCapitalize="none" />

          {error ? <Text style={[styles.error, { color: palette.danger }]}>{error}</Text> : null}
          <AppButton
            label={mode === 'login' ? 'Entrar' : 'Cadastrar'}
            palette={palette}
            onPress={submit}
            loading={loading}
          />
          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: palette.muted }]}>
              {mode === 'login' ? 'Ainda não possui uma conta?' : 'Já possui uma conta?'}
            </Text>
            <Text
              onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              style={[styles.switchAction, { color: palette.primary }]}
            >
              {mode === 'login' ? 'Cadastre-se' : 'Fazer login'}
            </Text>
          </View>
        </View>
        <Text style={[styles.disclaimer, { color: palette.muted }]}>Versão demonstrativa: os dados desta instalação ficam armazenados no próprio aparelho.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, paddingTop: 45, paddingBottom: 36 },
  brandMark: { width: 58, height: 58, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  brandLetter: { fontSize: 28, fontWeight: '900' },
  brand: { fontSize: 25, fontWeight: '900', letterSpacing: -0.7 },
  tagline: { fontSize: 13, lineHeight: 20, textAlign: 'center', maxWidth: 280, marginTop: 8, marginBottom: 28 },
  panel: { width: '100%', maxWidth: 440, borderRadius: 20, borderWidth: 1, padding: 22 },
  heading: { fontSize: 21, fontWeight: '800' },
  helper: { fontSize: 13, lineHeight: 19, marginTop: 6, marginBottom: 22 },
  error: { fontSize: 12, marginBottom: 13, lineHeight: 18 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 5, marginTop: 20 },
  switchText: { fontSize: 12 },
  switchAction: { fontSize: 12, fontWeight: '800' },
  disclaimer: { maxWidth: 340, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 24 },
});
