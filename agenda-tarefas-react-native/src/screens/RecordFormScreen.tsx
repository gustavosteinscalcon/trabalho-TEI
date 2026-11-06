import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { AgendaRecord, RecordDraft, RecordFormat, RecordType } from '../types';
import { Palette, RECORD_COLORS } from '../theme';
import { isValidDateKey, isValidTime, todayKey } from '../utils/date';
import { AppButton, Field, SectionTitle } from '../components/ui';

interface Props {
  palette: Palette;
  record?: AgendaRecord | null;
  onSave: (draft: RecordDraft) => Promise<void>;
  onDelete?: (record: AgendaRecord) => Promise<void>;
  onCancel: () => void;
}

const presets = [
  {
    id: 'water',
    title: 'Ingestão de água',
    description: 'Lembrete para beber água e manter a hidratação ao longo do dia.',
    color: '#16A085',
    type: 'Lembrete' as RecordType,
  },
  {
    id: 'exercise',
    title: 'Exercício físico',
    description: 'Lembrete para realizar uma atividade física.',
    color: '#E58A30',
    type: 'Lembrete' as RecordType,
  },
];

export function RecordFormScreen({ palette, record, onSave, onDelete, onCancel }: Props) {
  const [type, setType] = useState<RecordType>(record?.type ?? 'Tarefa');
  const [title, setTitle] = useState(record?.title ?? '');
  const [description, setDescription] = useState(record?.description ?? '');
  const [color, setColor] = useState(record?.color ?? RECORD_COLORS[0]);
  const [format, setFormat] = useState<RecordFormat>(record?.format ?? 'card');
  const [date, setDate] = useState(record?.date ?? todayKey());
  const [time, setTime] = useState(record?.time ?? '09:00');
  const [sound, setSound] = useState<'default' | 'none'>(record?.sound ?? 'default');
  const [alertEnabled, setAlertEnabled] = useState(record?.alertEnabled ?? true);
  const [templateId, setTemplateId] = useState<string | undefined>(record?.templateId);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!record) return;
    setType(record.type);
    setTitle(record.title);
    setDescription(record.description);
    setColor(record.color);
    setFormat(record.format);
    setDate(record.date);
    setTime(record.time);
    setSound(record.sound);
    setAlertEnabled(record.alertEnabled);
    setTemplateId(record.templateId);
  }, [record]);

  function applyPreset(presetId: string) {
    const preset = presets.find(item => item.id === presetId);
    if (!preset) return;
    setTemplateId(preset.id);
    setType(preset.type);
    setTitle(preset.title);
    setDescription(preset.description);
    setColor(preset.color);
    setFormat('card');
    setAlertEnabled(true);
  }

  async function submit() {
    setError('');
    if (!title.trim()) return setError('Informe o nome do registro.');
    if (!isValidDateKey(date)) return setError('Informe uma data válida no formato AAAA-MM-DD.');
    if (!isValidTime(time)) return setError('Informe um horário válido no formato HH:MM.');
    setLoading(true);
    try {
      await onSave({ type, title: title.trim(), description: description.trim(), color, format, date, time, sound, alertEnabled, templateId });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar o registro.');
    } finally {
      setLoading(false);
    }
  }

  function confirmDelete() {
    if (!record || !onDelete) return;
    Alert.alert('Excluir registro', 'Tem certeza de que deseja excluir este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { void onDelete(record); } },
    ]);
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <SectionTitle
        title={record ? 'Editar registro' : 'Novo registro'}
        subtitle={record ? 'Altere as informações e salve as modificações.' : 'Escolha o tipo e personalize os detalhes.'}
        palette={palette}
      />

      {!record ? (
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: palette.text }]}>COMEÇAR COM UMA CONFIGURAÇÃO</Text>
          <View style={styles.presetRow}>
            {presets.map(preset => (
              <Pressable
                key={preset.id}
                onPress={() => applyPreset(preset.id)}
                style={[styles.preset, { backgroundColor: palette.surface, borderColor: templateId === preset.id ? palette.primary : palette.border }]}
              >
                <View style={[styles.presetDot, { backgroundColor: preset.color }]} />
                <Text style={[styles.presetTitle, { color: palette.text }]}>{preset.title}</Text>
                <Text style={[styles.presetAction, { color: palette.primary }]}>{templateId === preset.id ? 'Selecionado' : 'Usar modelo'}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <View style={[styles.formPanel, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Text style={[styles.sectionLabel, { color: palette.text }]}>INFORMAÇÕES DO REGISTRO</Text>
        <View style={styles.choiceGroup}>
          {(['Tarefa', 'Lembrete', 'Alerta'] as RecordType[]).map(option => (
            <Pressable key={option} onPress={() => setType(option)} style={[styles.choice, { backgroundColor: type === option ? palette.primarySoft : palette.surfaceSecondary }]}>
              <Text style={[styles.choiceText, { color: type === option ? palette.primary : palette.text }]}>{option}</Text>
            </Pressable>
          ))}
        </View>

        <Field label="Nome do registro *" palette={palette} value={title} onChangeText={setTitle} placeholder="Ex.: Estudar biologia" maxLength={70} />
        <Field label="Descrição" palette={palette} value={description} onChangeText={setDescription} placeholder="Adicione detalhes (opcional)" multiline numberOfLines={3} style={styles.textArea} />

        <View style={styles.twoColumns}>
          <View style={{ flex: 1 }}>
            <Field label="Data (AAAA-MM-DD) *" palette={palette} value={date} onChangeText={setDate} placeholder="2026-11-06" autoCapitalize="none" />
          </View>
          <View style={{ width: 100 }}>
            <Field label="Horário *" palette={palette} value={time} onChangeText={setTime} placeholder="09:00" keyboardType="numbers-and-punctuation" />
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: palette.text }]}>COR</Text>
        <View style={styles.colorRow}>
          {RECORD_COLORS.map(option => (
            <Pressable key={option} onPress={() => setColor(option)} style={[styles.colorOption, { backgroundColor: option }, color === option && styles.colorSelected]} />
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: palette.text, marginTop: 18 }]}>FORMATO DE EXIBIÇÃO</Text>
        <View style={styles.formatRow}>
          {([
            ['card', 'Cartão'], ['compact', 'Compacto'], ['highlight', 'Destaque'],
          ] as [RecordFormat, string][]).map(([value, label]) => (
            <Pressable key={value} onPress={() => setFormat(value)} style={[styles.formatChoice, { borderColor: format === value ? palette.primary : palette.border, backgroundColor: format === value ? palette.primarySoft : 'transparent' }]}>
              <Text style={[styles.formatText, { color: format === value ? palette.primary : palette.text }]}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.formPanel, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Text style={[styles.sectionLabel, { color: palette.text }]}>ALERTA E NOTIFICAÇÃO</Text>
        <View style={styles.settingRow}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[styles.settingTitle, { color: palette.text }]}>Emitir notificação</Text>
            <Text style={[styles.settingDescription, { color: palette.muted }]}>Solicita uma notificação ao chegar a data e o horário definidos.</Text>
          </View>
          <Switch value={alertEnabled} onValueChange={setAlertEnabled} trackColor={{ false: palette.border, true: palette.primary }} thumbColor="#FFFFFF" />
        </View>
        <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: palette.border, paddingTop: 14, marginTop: 12 }]}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[styles.settingTitle, { color: palette.text }]}>Som da notificação</Text>
            <Text style={[styles.settingDescription, { color: palette.muted }]}>Use o som padrão do dispositivo ou deixe silencioso.</Text>
          </View>
          <View style={styles.soundOptions}>
            <Pressable onPress={() => setSound('default')} style={[styles.soundOption, { backgroundColor: sound === 'default' ? palette.primarySoft : palette.surfaceSecondary }]}>
              <Text style={[styles.soundText, { color: sound === 'default' ? palette.primary : palette.text }]}>Padrão</Text>
            </Pressable>
            <Pressable onPress={() => setSound('none')} style={[styles.soundOption, { backgroundColor: sound === 'none' ? palette.primarySoft : palette.surfaceSecondary }]}>
              <Text style={[styles.soundText, { color: sound === 'none' ? palette.primary : palette.text }]}>Mudo</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {error ? <Text style={[styles.error, { color: palette.danger }]}>{error}</Text> : null}
      <AppButton label={record ? 'Salvar alterações' : 'Criar registro'} palette={palette} onPress={submit} loading={loading} />
      {record && onDelete ? <AppButton label="Excluir registro" palette={palette} variant="danger" onPress={confirmDelete} /> : null}
      <AppButton label="Cancelar" palette={palette} variant="outline" onPress={onCancel} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, paddingBottom: 42, gap: 12 },
  section: { marginBottom: 5 },
  sectionLabel: { fontSize: 10, letterSpacing: 0.9, fontWeight: '900', marginBottom: 12 },
  presetRow: { flexDirection: 'row', gap: 9 },
  preset: { flex: 1, borderRadius: 13, borderWidth: 1, padding: 12, minHeight: 98, justifyContent: 'space-between' },
  presetDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 9 },
  presetTitle: { fontSize: 12, fontWeight: '800' },
  presetAction: { fontSize: 10, fontWeight: '800', marginTop: 8 },
  formPanel: { borderWidth: 1, borderRadius: 16, padding: 15, marginBottom: 3 },
  choiceGroup: { flexDirection: 'row', gap: 7, marginBottom: 17 },
  choice: { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center' },
  choiceText: { fontSize: 12, fontWeight: '800' },
  textArea: { minHeight: 85, textAlignVertical: 'top' },
  twoColumns: { flexDirection: 'row', gap: 10 },
  colorRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 3 },
  colorOption: { width: 31, height: 31, borderRadius: 11, borderWidth: 3, borderColor: 'transparent' },
  colorSelected: { borderColor: '#182230', transform: [{ scale: 1.12 }] },
  formatRow: { flexDirection: 'row', gap: 7 },
  formatChoice: { flex: 1, borderWidth: 1, borderRadius: 9, paddingVertical: 10, alignItems: 'center' },
  formatText: { fontSize: 11, fontWeight: '700' },
  settingRow: { flexDirection: 'row', alignItems: 'center' },
  settingTitle: { fontSize: 13, fontWeight: '800' },
  settingDescription: { fontSize: 11, lineHeight: 16, marginTop: 4 },
  soundOptions: { flexDirection: 'row', gap: 5 },
  soundOption: { paddingHorizontal: 9, paddingVertical: 8, borderRadius: 8 },
  soundText: { fontSize: 10, fontWeight: '800' },
  error: { fontSize: 12, lineHeight: 18, paddingHorizontal: 3 },
});
