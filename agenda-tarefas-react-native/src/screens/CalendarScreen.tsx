import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AgendaRecord } from '../types';
import { Palette } from '../theme';
import { dateToKey, formatDateLong, monthLabel, todayKey } from '../utils/date';
import { AppButton, SectionTitle } from '../components/ui';
import { RecordCard } from '../components/RecordCard';

interface Props {
  records: AgendaRecord[];
  palette: Palette;
  onCreate: () => void;
  onEdit: (record: AgendaRecord) => void;
  onShare: (record: AgendaRecord) => void;
}

export function CalendarScreen({ records, palette, onCreate, onEdit, onShare }: Props) {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(todayKey());

  const days = useMemo(() => {
    const firstWeekday = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: firstWeekday }, () => null as null | number),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [month]);

  const selectedRecords = records.filter(record => record.date === selectedDate);
  const todayCount = records.filter(record => record.date === todayKey()).length;

  function changeMonth(offset: number) {
    const updated = new Date(month.getFullYear(), month.getMonth() + offset, 1);
    setMonth(updated);
    setSelectedDate(dateToKey(new Date(updated.getFullYear(), updated.getMonth(), 1)));
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <View style={styles.headingRow}>
        <View style={{ flex: 1 }}>
          <SectionTitle title="Sua agenda" subtitle="Acompanhe seus registros por data." palette={palette} />
        </View>
        <AppButton label="+ Criar" palette={palette} onPress={onCreate} compact />
      </View>

      <View style={[styles.summary, { backgroundColor: palette.primarySoft }]}>
        <View>
          <Text style={[styles.summaryLabel, { color: palette.primary }]}>HOJE</Text>
          <Text style={[styles.summaryNumber, { color: palette.text }]}>{todayCount}</Text>
          <Text style={[styles.summaryCaption, { color: palette.muted }]}>{todayCount === 1 ? 'registro agendado' : 'registros agendados'}</Text>
        </View>
        <View style={[styles.summaryDivider, { backgroundColor: palette.border }]} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.summaryMessage, { color: palette.text }]}>Mantenha suas atividades organizadas e não perca seus horários.</Text>
        </View>
      </View>

      <View style={[styles.calendarPanel, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.monthHeader}>
          <Pressable onPress={() => changeMonth(-1)} style={[styles.monthButton, { backgroundColor: palette.surfaceSecondary }]}>
            <Text style={[styles.monthButtonText, { color: palette.text }]}>‹</Text>
          </Pressable>
          <Text style={[styles.monthTitle, { color: palette.text }]}>{monthLabel(month)}</Text>
          <Pressable onPress={() => changeMonth(1)} style={[styles.monthButton, { backgroundColor: palette.surfaceSecondary }]}>
            <Text style={[styles.monthButtonText, { color: palette.text }]}>›</Text>
          </Pressable>
        </View>
        <View style={styles.weekRow}>
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
            <Text key={`${day}-${index}`} style={[styles.weekDay, { color: palette.muted }]}>{day}</Text>
          ))}
        </View>
        <View style={styles.daysGrid}>
          {days.map((day, index) => {
            if (day === null) return <View key={`empty-${index}`} style={styles.dayCell} />;
            const key = dateToKey(new Date(month.getFullYear(), month.getMonth(), day));
            const count = records.filter(record => record.date === key).length;
            const selected = key === selectedDate;
            const today = key === todayKey();
            return (
              <Pressable key={key} onPress={() => setSelectedDate(key)} style={styles.dayCell}>
                <View style={[
                  styles.dayCircle,
                  selected && { backgroundColor: palette.primary },
                  !selected && today && { borderWidth: 1, borderColor: palette.primary },
                ]}>
                  <Text style={[styles.dayNumber, { color: selected ? '#FFFFFF' : palette.text }]}>{day}</Text>
                </View>
                <View style={styles.dotsRow}>
                  {count > 0 ? <View style={[styles.dayDot, { backgroundColor: selected ? palette.primary : palette.primary }]} /> : null}
                  {count > 1 ? <View style={[styles.dayDot, { backgroundColor: '#E58A30' }]} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={[styles.legend, { borderTopColor: palette.border }]}>
          <View style={[styles.legendDot, { backgroundColor: palette.primary }]} />
          <Text style={[styles.legendText, { color: palette.muted }]}>Data com registros</Text>
        </View>
      </View>

      <View style={styles.listHeading}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.selectedTitle, { color: palette.text }]}>{formatDateLong(selectedDate)}</Text>
          <Text style={[styles.selectedSubtitle, { color: palette.muted }]}>{selectedRecords.length} {selectedRecords.length === 1 ? 'registro' : 'registros'}</Text>
        </View>
      </View>

      {selectedRecords.length > 0 ? selectedRecords.map(record => (
        <RecordCard key={record.id} record={record} palette={palette} onEdit={onEdit} onShare={onShare} />
      )) : (
        <View style={[styles.empty, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.emptyTitle, { color: palette.text }]}>Nenhum registro nesta data</Text>
          <Text style={[styles.emptyText, { color: palette.muted }]}>Adicione uma tarefa, um lembrete ou um alerta para organizar seu dia.</Text>
          <AppButton label="Criar registro" compact palette={palette} onPress={onCreate} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, paddingBottom: 40 },
  headingRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  summary: { flexDirection: 'row', alignItems: 'center', borderRadius: 17, padding: 17, marginBottom: 18 },
  summaryLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  summaryNumber: { fontSize: 28, fontWeight: '900', marginTop: 4 },
  summaryCaption: { fontSize: 10 },
  summaryDivider: { width: 1, height: 48, marginHorizontal: 18 },
  summaryMessage: { fontSize: 12, lineHeight: 18, fontWeight: '600' },
  calendarPanel: { borderWidth: 1, borderRadius: 17, padding: 14 },
  monthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 17 },
  monthButton: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  monthButtonText: { fontSize: 24, lineHeight: 27 },
  monthTitle: { fontSize: 16, fontWeight: '800' },
  weekRow: { flexDirection: 'row', marginBottom: 9 },
  weekDay: { width: `${100 / 7}%`, textAlign: 'center', fontSize: 11, fontWeight: '800' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: `${100 / 7}%`, minHeight: 47, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 2 },
  dayCircle: { width: 31, height: 31, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  dayNumber: { fontSize: 12, fontWeight: '700' },
  dotsRow: { flexDirection: 'row', gap: 3, height: 8, alignItems: 'center' },
  dayDot: { width: 4, height: 4, borderRadius: 2 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 7, borderTopWidth: 1, marginTop: 8, paddingTop: 11 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendText: { fontSize: 10 },
  listHeading: { flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 12 },
  selectedTitle: { fontSize: 16, fontWeight: '800', textTransform: 'capitalize' },
  selectedSubtitle: { fontSize: 11, marginTop: 4 },
  empty: { borderWidth: 1, borderRadius: 15, padding: 19, gap: 9, alignItems: 'flex-start' },
  emptyTitle: { fontSize: 14, fontWeight: '800' },
  emptyText: { fontSize: 12, lineHeight: 18, marginBottom: 5 },
});
