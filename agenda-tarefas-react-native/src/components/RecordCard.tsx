import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AgendaRecord } from '../types';
import { Palette } from '../theme';
import { AppButton } from './ui';

interface Props {
  record: AgendaRecord;
  palette: Palette;
  onEdit: (record: AgendaRecord) => void;
  onShare?: (record: AgendaRecord) => void;
  compact?: boolean;
}

export function RecordCard({ record, palette, onEdit, onShare, compact = false }: Props) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: palette.surface, borderColor: palette.border },
        record.format === 'highlight' && { borderWidth: 2, borderColor: record.color },
        compact && styles.compact,
      ]}
    >
      <View style={[styles.accent, { backgroundColor: record.color }]} />
      <View style={styles.content}>
        <View style={styles.topLine}>
          <Text style={[styles.time, { color: palette.muted }]}>{record.time}</Text>
          <Text style={[styles.type, { color: record.color }]}>{record.type}</Text>
        </View>
        <Text style={[styles.title, { color: palette.text }]} numberOfLines={1}>{record.title}</Text>
        {!compact && record.description ? (
          <Text style={[styles.description, { color: palette.muted }]} numberOfLines={2}>{record.description}</Text>
        ) : null}
        <View style={styles.bottomLine}>
          <Text style={[styles.status, { color: palette.muted }]}>
            {record.alertEnabled ? 'Notificação ativada' : 'Sem notificação'}{record.isShared ? ' · Compartilhado' : ''}
          </Text>
          <View style={styles.actions}>
            <AppButton label="Editar" compact variant="outline" palette={palette} onPress={() => onEdit(record)} />
            {onShare && !record.isShared ? (
              <AppButton label="Compartilhar" compact variant="outline" palette={palette} onPress={() => onShare(record)} />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', borderWidth: 1, borderRadius: 14, overflow: 'hidden', marginBottom: 10, minHeight: 94 },
  compact: { minHeight: 68 },
  accent: { width: 5 },
  content: { flex: 1, padding: 12 },
  topLine: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  time: { fontSize: 11, fontWeight: '700' },
  type: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  title: { fontSize: 15, fontWeight: '800' },
  description: { fontSize: 12, lineHeight: 17, marginTop: 4 },
  bottomLine: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 10 },
  actions: { flexDirection: 'row', gap: 6 },
  status: { fontSize: 9, flex: 1, minWidth: 85 },
});
