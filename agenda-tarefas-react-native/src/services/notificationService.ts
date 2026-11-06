import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AgendaRecord } from '../types';
import { parseLocalDate } from '../utils/date';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function configureNotifications(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('agenda-default', {
      name: 'Alertas com som',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    });
    await Notifications.setNotificationChannelAsync('agenda-silent', {
      name: 'Alertas silenciosos',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0],
      sound: null,
    });
  }
}

export async function cancelRecordNotification(record: AgendaRecord): Promise<void> {
  if (record.notificationId) {
    await Notifications.cancelScheduledNotificationAsync(record.notificationId).catch(() => undefined);
  }
}

export async function scheduleRecordNotification(record: AgendaRecord): Promise<string | undefined> {
  if (!record.alertEnabled) return undefined;

  const date = parseLocalDate(record.date, record.time);
  if (Number.isNaN(date.getTime()) || date.getTime() <= Date.now()) return undefined;

  const current = await Notifications.getPermissionsAsync();
  const permission = current.granted ? current : await Notifications.requestPermissionsAsync();
  const authorized = permission.granted ||
    permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  if (!authorized) return undefined;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: record.title,
      body: record.description || `Está na hora do seu ${record.type.toLowerCase()}.`,
      sound: record.sound === 'none' ? false : 'default',
      data: { recordId: record.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
      ...(Platform.OS === 'android' ? { channelId: record.sound === 'none' ? 'agenda-silent' : 'agenda-default' } : {}),
    },
  });
}
