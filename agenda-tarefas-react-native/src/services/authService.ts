import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { UserProfile } from '../types';
import { readDatabase, updateDatabase } from './database';

const SESSION_KEY = 'agenda-session-user-id';
const passwordKey = (userId: string) => `agenda-password-hash-${userId}`;

async function hashPassword(salt: string, password: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`,
  );
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<UserProfile> {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanName || !cleanEmail || !password) {
    throw new Error('Preencha nome, e-mail e senha.');
  }
  if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
    throw new Error('Informe um endereço de e-mail válido.');
  }
  if (password.length < 6) {
    throw new Error('A senha deve possuir pelo menos 6 caracteres.');
  }

  const existing = await readDatabase();
  if (existing.users.some(user => user.email === cleanEmail)) {
    throw new Error('Já existe uma conta cadastrada com este e-mail.');
  }

  const user: UserProfile = {
    id: Crypto.randomUUID(),
    name: cleanName,
    email: cleanEmail,
    passwordSalt: Crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const hash = await hashPassword(user.passwordSalt, password);
  await SecureStore.setItemAsync(passwordKey(user.id), hash);
  await updateDatabase(database => ({
    database: { ...database, users: [...database.users, user] },
    result: undefined,
  }));
  await SecureStore.setItemAsync(SESSION_KEY, user.id);
  return user;
}

export async function loginUser(email: string, password: string): Promise<UserProfile> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !password) throw new Error('Informe e-mail e senha.');

  const database = await readDatabase();
  const user = database.users.find(item => item.email === cleanEmail);
  if (!user) throw new Error('E-mail ou senha incorretos.');

  const savedHash = await SecureStore.getItemAsync(passwordKey(user.id));
  const informedHash = await hashPassword(user.passwordSalt, password);
  if (!savedHash || savedHash !== informedHash) {
    throw new Error('E-mail ou senha incorretos.');
  }

  await SecureStore.setItemAsync(SESSION_KEY, user.id);
  return user;
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const userId = await SecureStore.getItemAsync(SESSION_KEY);
  if (!userId) return null;
  const database = await readDatabase();
  return database.users.find(user => user.id === userId) ?? null;
}

export async function logoutUser(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
