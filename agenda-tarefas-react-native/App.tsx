import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppScreen, AppTheme, AgendaRecord, RecordDraft, SharedConfiguration, UserProfile } from './src/types';
import { palettes } from './src/theme';
import { AuthScreen } from './src/screens/AuthScreen';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { RecordFormScreen } from './src/screens/RecordFormScreen';
import { SharedScreen } from './src/screens/SharedScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { DrawerMenu } from './src/components/DrawerMenu';
import { configureNotifications, cancelRecordNotification, scheduleRecordNotification } from './src/services/notificationService';
import { getCurrentUser, loginUser, logoutUser, registerUser } from './src/services/authService';
import {
  createRecord,
  deleteRecord,
  getSharedConfigurations,
  getUserRecords,
  getUserTheme,
  saveUserTheme,
  setRecordNotificationId,
  shareRecord,
  updateRecord,
  useSharedConfiguration,
} from './src/services/recordsService';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [records, setRecords] = useState<AgendaRecord[]>([]);
  const [sharedConfigurations, setSharedConfigurations] = useState<SharedConfiguration[]>([]);
  const [theme, setTheme] = useState<AppTheme>('light');
  const [activeScreen, setActiveScreen] = useState<AppScreen>('calendar');
  const [editingRecord, setEditingRecord] = useState<AgendaRecord | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [booting, setBooting] = useState(true);

  const palette = useMemo(() => palettes[theme], [theme]);

  useEffect(() => {
    let mounted = true;
    async function initialize() {
      try {
        await configureNotifications();
        const current = await getCurrentUser();
        if (!mounted) return;
        if (current) {
          setUser(current);
          const [savedRecords, savedTheme] = await Promise.all([
            getUserRecords(current.id),
            getUserTheme(current.id),
          ]);
          if (!mounted) return;
          setRecords(savedRecords);
          setTheme(savedTheme);
          setSharedConfigurations(await getSharedConfigurations(current.id));
        }
      } catch (error) {
        Alert.alert('Erro ao iniciar', error instanceof Error ? error.message : 'Não foi possível carregar os dados.');
      } finally {
        if (mounted) setBooting(false);
      }
    }
    void initialize();
    return () => { mounted = false; };
  }, []);

  const refreshRecords = useCallback(async () => {
    if (!user) return;
    setRecords(await getUserRecords(user.id));
  }, [user]);

  const refreshShared = useCallback(async () => {
    if (!user) return;
    setSharedConfigurations(await getSharedConfigurations(user.id));
  }, [user]);

  async function authenticate(nextUser: UserProfile) {
    setUser(nextUser);
    setRecords(await getUserRecords(nextUser.id));
    setSharedConfigurations(await getSharedConfigurations(nextUser.id));
    const savedTheme = await getUserTheme(nextUser.id);
    setTheme(savedTheme);
    setActiveScreen('calendar');
  }

  async function handleLogin(email: string, password: string): Promise<void> {
    const loggedUser = await loginUser(email, password);
    await authenticate(loggedUser);
  }

  async function handleRegister(name: string, email: string, password: string): Promise<void> {
    const newUser = await registerUser(name, email, password);
    await authenticate(newUser);
  }

  function openCreate() {
    setEditingRecord(null);
    setActiveScreen('create');
    setDrawerVisible(false);
  }

  function openEdit(record: AgendaRecord) {
    setEditingRecord(record);
    setActiveScreen('create');
  }

  async function saveNotification(record: AgendaRecord): Promise<void> {
    if (!user) return;
    let notificationId: string | undefined;
    try {
      notificationId = await scheduleRecordNotification(record);
    } catch (error) {
      Alert.alert(
        'Registro salvo',
        `O registro foi salvo, mas não foi possível programar a notificação. ${error instanceof Error ? error.message : ''}`,
      );
    }
    await setRecordNotificationId(user.id, record.id, notificationId);
    if (record.alertEnabled && !notificationId) {
      Alert.alert(
        'Notificação não programada',
        'Confira se a data e o horário estão no futuro e se o aplicativo tem permissão para enviar notificações.',
      );
    }
  }

  async function handleSaveRecord(draft: RecordDraft): Promise<void> {
    if (!user) throw new Error('É necessário entrar na conta.');
    let saved: AgendaRecord;
    if (editingRecord) {
      await cancelRecordNotification(editingRecord);
      saved = await updateRecord(user.id, editingRecord.id, draft);
    } else {
      saved = await createRecord(user.id, draft);
    }
    await saveNotification(saved);
    await refreshRecords();
    setEditingRecord(null);
    setActiveScreen('calendar');
  }

  async function handleDeleteRecord(record: AgendaRecord): Promise<void> {
    if (!user) return;
    await cancelRecordNotification(record);
    await deleteRecord(user.id, record.id);
    await refreshRecords();
    setEditingRecord(null);
    setActiveScreen('calendar');
  }

  async function handleShare(record: AgendaRecord): Promise<void> {
    if (!user) return;
    try {
      await shareRecord(user.id, record.id);
      await refreshRecords();
      await refreshShared();
      Alert.alert('Configuração compartilhada', 'A configuração foi disponibilizada para as outras contas cadastradas nesta instalação.');
    } catch (error) {
      Alert.alert('Não foi possível compartilhar', error instanceof Error ? error.message : 'Tente novamente.');
    }
  }

  async function handleUseShared(configuration: SharedConfiguration): Promise<void> {
    if (!user) return;
    const created = await useSharedConfiguration(user.id, configuration.id);
    await saveNotification(created);
    await refreshRecords();
    setActiveScreen('calendar');
    Alert.alert('Configuração adicionada', 'Uma cópia da configuração foi adicionada à sua agenda. Confira a data e o horário no calendário.');
  }

  async function changeTheme(nextTheme: AppTheme): Promise<void> {
    setTheme(nextTheme);
    if (user) await saveUserTheme(user.id, nextTheme);
  }

  async function handleLogout(): Promise<void> {
    await logoutUser();
    setUser(null);
    setRecords([]);
    setSharedConfigurations([]);
    setEditingRecord(null);
    setActiveScreen('calendar');
  }

  function navigate(screen: AppScreen) {
    if (screen === 'create') setEditingRecord(null);
    setActiveScreen(screen);
    setDrawerVisible(false);
    if (screen === 'shared') void refreshShared();
  }

  if (booting) {
    return (
      <SafeAreaView style={[styles.loading, { backgroundColor: palette.background }]}>
        <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={{ color: palette.muted, marginTop: 12, fontSize: 12 }}>Carregando agenda...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <>
        <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
        <AuthScreen palette={palette} onLogin={handleLogin} onRegister={handleRegister} />
      </>
    );
  }

  const screenTitle = activeScreen === 'calendar' ? 'Agenda'
    : activeScreen === 'create' ? (editingRecord ? 'Editar registro' : 'Novo registro')
      : activeScreen === 'shared' ? 'Compartilhados' : 'Configurações';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={palette.background} />
      <View style={[styles.header, { backgroundColor: palette.surface, borderBottomColor: palette.border }]}>
        <Pressable onPress={() => setDrawerVisible(true)} style={[styles.menuButton, { backgroundColor: palette.surfaceSecondary }]}>
          <Text style={[styles.menuButtonText, { color: palette.text }]}>Menu</Text>
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: palette.text }]}>{screenTitle}</Text>
          <Text style={[styles.headerSubtitle, { color: palette.muted }]} numberOfLines={1}>Olá, {user.name.split(' ')[0]}</Text>
        </View>
        <Pressable onPress={openCreate} style={[styles.addButton, { backgroundColor: palette.primary }]}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1 }}>
        {activeScreen === 'calendar' ? (
          <CalendarScreen records={records} palette={palette} onCreate={openCreate} onEdit={openEdit} onShare={handleShare} />
        ) : null}
        {activeScreen === 'create' ? (
          <RecordFormScreen
            key={editingRecord?.id ?? 'new-record'}
            palette={palette}
            record={editingRecord}
            onSave={handleSaveRecord}
            onDelete={editingRecord ? handleDeleteRecord : undefined}
            onCancel={() => { setEditingRecord(null); setActiveScreen('calendar'); }}
          />
        ) : null}
        {activeScreen === 'shared' ? (
          <SharedScreen
            palette={palette}
            configurations={sharedConfigurations}
            onRefresh={refreshShared}
            onUse={handleUseShared}
          />
        ) : null}
        {activeScreen === 'settings' ? (
          <SettingsScreen user={user} palette={palette} theme={theme} onThemeChange={changeTheme} onLogout={() => { void handleLogout(); }} />
        ) : null}
      </View>

      <DrawerMenu
        visible={drawerVisible}
        activeScreen={activeScreen}
        user={user}
        palette={palette}
        onClose={() => setDrawerVisible(false)}
        onNavigate={navigate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { height: 68, borderBottomWidth: 1, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', gap: 11 },
  menuButton: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 10 },
  menuButtonText: { fontSize: 11, fontWeight: '800' },
  headerTitleWrap: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '900' },
  headerSubtitle: { fontSize: 10, marginTop: 3 },
  addButton: { width: 37, height: 37, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { fontSize: 25, lineHeight: 28, color: '#FFFFFF', fontWeight: '400' },
});
