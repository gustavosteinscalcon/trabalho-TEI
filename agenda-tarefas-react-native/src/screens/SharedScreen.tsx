import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SharedConfiguration } from '../types';
import { Palette } from '../theme';
import { AppButton, SectionTitle } from '../components/ui';

interface Props {
  palette: Palette;
  configurations: SharedConfiguration[];
  onRefresh: () => Promise<void>;
  onUse: (configuration: SharedConfiguration) => Promise<void>;
}

export function SharedScreen({ palette, configurations, onRefresh, onUse }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => { void onRefresh(); }, [onRefresh]);

  async function useConfiguration(configuration: SharedConfiguration) {
    setError('');
    setLoadingId(configuration.id);
    try {
      await onUse(configuration);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível utilizar a configuração.');
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <SectionTitle title="Registros compartilhados" subtitle="Utilize configurações que outras pessoas disponibilizaram." palette={palette} />
      {error ? <Text style={[styles.error, { color: palette.danger }]}>{error}</Text> : null}
      {configurations.length === 0 ? (
        <View style={[styles.empty, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.emptyTitle, { color: palette.text }]}>Nenhuma configuração disponível</Text>
          <Text style={[styles.emptyText, { color: palette.muted }]}>Quando outro usuário compartilhar uma configuração, ela aparecerá nesta área.</Text>
          <AppButton label="Atualizar lista" compact variant="outline" palette={palette} onPress={() => { void onRefresh(); }} />
        </View>
      ) : configurations.map(configuration => (
        <View key={configuration.id} style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.colorMark, { backgroundColor: configuration.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: palette.text }]}>{configuration.title}</Text>
              <Text style={[styles.meta, { color: palette.muted }]}>{configuration.type} · compartilhado por {configuration.ownerName}</Text>
            </View>
          </View>
          {configuration.description ? <Text style={[styles.description, { color: palette.muted }]}>{configuration.description}</Text> : null}
          <View style={styles.footer}>
            <Text style={[styles.detail, { color: palette.muted }]}>{configuration.date.split('-').reverse().join('/')} às {configuration.time} · {configuration.alertEnabled ? 'Com notificação' : 'Sem notificação'}</Text>
            <AppButton
              label={loadingId === configuration.id ? 'Adicionando...' : 'Adicionar à agenda'}
              compact
              palette={palette}
              onPress={() => { void useConfiguration(configuration); }}
              disabled={loadingId !== null}
              loading={loadingId === configuration.id}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, paddingBottom: 40 },
  card: { borderWidth: 1, borderRadius: 15, padding: 15, marginBottom: 11 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  colorMark: { width: 9, height: 42, borderRadius: 6 },
  title: { fontSize: 15, fontWeight: '800' },
  meta: { fontSize: 10, marginTop: 4 },
  description: { fontSize: 12, lineHeight: 18, marginTop: 13 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 15 },
  detail: { fontSize: 10, flex: 1 },
  empty: { borderWidth: 1, borderRadius: 15, padding: 19, gap: 9, alignItems: 'flex-start' },
  emptyTitle: { fontSize: 14, fontWeight: '800' },
  emptyText: { fontSize: 12, lineHeight: 18, marginBottom: 5 },
  error: { fontSize: 12, marginBottom: 12 },
});
