import * as Crypto from 'expo-crypto';
import { AgendaRecord, RecordDraft, SharedConfiguration } from '../types';
import { readDatabase, updateDatabase } from './database';

export async function getUserRecords(userId: string): Promise<AgendaRecord[]> {
  const database = await readDatabase();
  return database.records
    .filter(record => record.ownerId === userId)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

export async function createRecord(userId: string, draft: RecordDraft): Promise<AgendaRecord> {
  const now = new Date().toISOString();
  const record: AgendaRecord = {
    ...draft,
    id: Crypto.randomUUID(),
    ownerId: userId,
    isShared: false,
    createdAt: now,
    updatedAt: now,
  };
  await updateDatabase(database => ({
    database: { ...database, records: [...database.records, record] },
    result: undefined,
  }));
  return record;
}

export async function updateRecord(
  userId: string,
  recordId: string,
  draft: RecordDraft,
): Promise<AgendaRecord> {
  return updateDatabase(database => {
    const existing = database.records.find(
      record => record.id === recordId && record.ownerId === userId,
    );
    if (!existing) throw new Error('Registro não encontrado ou sem permissão para editá-lo.');
    const updated: AgendaRecord = {
      ...existing,
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    return {
      database: {
        ...database,
        records: database.records.map(record => record.id === recordId ? updated : record),
      },
      result: updated,
    };
  });
}

export async function deleteRecord(userId: string, recordId: string): Promise<AgendaRecord> {
  return updateDatabase(database => {
    const record = database.records.find(item => item.id === recordId && item.ownerId === userId);
    if (!record) throw new Error('Registro não encontrado ou sem permissão para excluí-lo.');
    return {
      database: { ...database, records: database.records.filter(item => item.id !== recordId) },
      result: record,
    };
  });
}

export async function shareRecord(userId: string, recordId: string): Promise<void> {
  const database = await readDatabase();
  const record = database.records.find(item => item.id === recordId && item.ownerId === userId);
  const owner = database.users.find(item => item.id === userId);
  if (!record || !owner) throw new Error('Não foi possível compartilhar este registro.');
  if (database.sharedConfigurations.some(item => item.sourceRecordId === recordId)) return;

  const shared: SharedConfiguration = {
    id: Crypto.randomUUID(),
    sourceRecordId: record.id,
    ownerId: userId,
    ownerName: owner.name,
    type: record.type,
    title: record.title,
    description: record.description,
    color: record.color,
    format: record.format,
    date: record.date,
    time: record.time,
    sound: record.sound,
    alertEnabled: record.alertEnabled,
    sharedAt: new Date().toISOString(),
  };
  await updateDatabase(current => ({
    database: {
      ...current,
      records: current.records.map(item => item.id === recordId ? { ...item, isShared: true } : item),
      sharedConfigurations: [...current.sharedConfigurations, shared],
    },
    result: undefined,
  }));
}

export async function getSharedConfigurations(userId: string): Promise<SharedConfiguration[]> {
  const database = await readDatabase();
  return database.sharedConfigurations.filter(item => item.ownerId !== userId);
}

export async function useSharedConfiguration(
  userId: string,
  configurationId: string,
): Promise<AgendaRecord> {
  const database = await readDatabase();
  const shared = database.sharedConfigurations.find(item => item.id === configurationId);
  if (!shared) throw new Error('Esta configuração não está mais disponível.');

  const now = new Date().toISOString();
  const copy: AgendaRecord = {
    id: Crypto.randomUUID(),
    ownerId: userId,
    type: shared.type,
    title: shared.title,
    description: shared.description,
    color: shared.color,
    format: shared.format,
    date: shared.date,
    time: shared.time,
    sound: shared.sound,
    alertEnabled: shared.alertEnabled,
    isShared: false,
    createdAt: now,
    updatedAt: now,
  };
  await updateDatabase(current => ({
    database: { ...current, records: [...current.records, copy] },
    result: undefined,
  }));
  return copy;
}

export async function saveUserTheme(userId: string, theme: 'light' | 'dark'): Promise<void> {
  await updateDatabase(database => ({
    database: {
      ...database,
      themeByUser: { ...database.themeByUser, [userId]: theme },
    },
    result: undefined,
  }));
}

export async function getUserTheme(userId: string): Promise<'light' | 'dark'> {
  const database = await readDatabase();
  return database.themeByUser[userId] ?? 'light';
}

export async function setRecordNotificationId(
  userId: string,
  recordId: string,
  notificationId: string | undefined,
): Promise<void> {
  await updateDatabase(database => ({
    database: {
      ...database,
      records: database.records.map(record =>
        record.id === recordId && record.ownerId === userId
          ? { ...record, notificationId }
          : record,
      ),
    },
    result: undefined,
  }));
}
