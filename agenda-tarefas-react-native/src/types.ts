export type RecordType = 'Tarefa' | 'Lembrete' | 'Alerta';
export type RecordFormat = 'card' | 'compact' | 'highlight';
export type AppTheme = 'light' | 'dark';
export type AppScreen = 'calendar' | 'create' | 'shared' | 'settings';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  passwordSalt: string;
  createdAt: string;
}

export interface AgendaRecord {
  id: string;
  ownerId: string;
  type: RecordType;
  title: string;
  description: string;
  color: string;
  format: RecordFormat;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  sound: 'default' | 'none';
  alertEnabled: boolean;
  notificationId?: string;
  isShared: boolean;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SharedConfiguration {
  id: string;
  sourceRecordId: string;
  ownerId: string;
  ownerName: string;
  type: RecordType;
  title: string;
  description: string;
  color: string;
  format: RecordFormat;
  date: string;
  time: string;
  sound: 'default' | 'none';
  alertEnabled: boolean;
  sharedAt: string;
}

export interface Database {
  users: UserProfile[];
  records: AgendaRecord[];
  sharedConfigurations: SharedConfiguration[];
  themeByUser: Record<string, AppTheme>;
}

export interface RecordDraft {
  type: RecordType;
  title: string;
  description: string;
  color: string;
  format: RecordFormat;
  date: string;
  time: string;
  sound: 'default' | 'none';
  alertEnabled: boolean;
  templateId?: string;
}
