import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '../types';

const DATABASE_KEY = '@agenda-tarefas/database/v1';

const emptyDatabase: Database = {
  users: [],
  records: [],
  sharedConfigurations: [],
  themeByUser: {},
};

export async function readDatabase(): Promise<Database> {
  const raw = await AsyncStorage.getItem(DATABASE_KEY);
  if (!raw) return emptyDatabase;

  try {
    const parsed = JSON.parse(raw) as Partial<Database>;
    return {
      users: parsed.users ?? [],
      records: parsed.records ?? [],
      sharedConfigurations: parsed.sharedConfigurations ?? [],
      themeByUser: parsed.themeByUser ?? {},
    };
  } catch {
    throw new Error('Não foi possível ler os dados salvos no aparelho.');
  }
}

export async function writeDatabase(database: Database): Promise<void> {
  await AsyncStorage.setItem(DATABASE_KEY, JSON.stringify(database));
}

export async function updateDatabase<T>(
  updater: (database: Database) => { database: Database; result: T },
): Promise<T> {
  const current = await readDatabase();
  const updated = updater(current);
  await writeDatabase(updated.database);
  return updated.result;
}
