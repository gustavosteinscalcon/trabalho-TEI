import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppScreen, UserProfile } from '../types';
import { Palette } from '../theme';

interface Props {
  visible: boolean;
  activeScreen: AppScreen;
  user: UserProfile;
  palette: Palette;
  onClose: () => void;
  onNavigate: (screen: AppScreen) => void;
}

const menuItems: { id: AppScreen; title: string; description: string }[] = [
  { id: 'calendar', title: 'Calendário', description: 'Tarefas, lembretes e alertas' },
  { id: 'create', title: 'Criar registro', description: 'Adicionar um novo item à agenda' },
  { id: 'shared', title: 'Registros compartilhados', description: 'Configurações de outros usuários' },
  { id: 'settings', title: 'Configurações e conta', description: 'Aparência e dados da conta' },
];

export function DrawerMenu({ visible, activeScreen, user, palette, onClose, onNavigate }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.panel, { backgroundColor: palette.surface }]}>
          <View style={[styles.profile, { borderBottomColor: palette.border }]}>
            <View style={[styles.avatar, { backgroundColor: palette.primarySoft }]}>
              <Text style={[styles.avatarText, { color: palette.primary }]}>{user.name.trim().charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={[styles.name, { color: palette.text }]}>{user.name}</Text>
            <Text style={[styles.email, { color: palette.muted }]}>{user.email}</Text>
          </View>
          <Text style={[styles.menuLabel, { color: palette.muted }]}>MENU PRINCIPAL</Text>
          {menuItems.map(item => {
            const active = activeScreen === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => onNavigate(item.id)}
                style={[styles.menuItem, { backgroundColor: active ? palette.primarySoft : 'transparent' }]}
              >
                <Text style={[styles.menuTitle, { color: active ? palette.primary : palette.text }]}>{item.title}</Text>
                <Text style={[styles.menuDescription, { color: palette.muted }]}>{item.description}</Text>
              </Pressable>
            );
          })}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: palette.muted }]}>Agenda de Tarefas</Text>
            <Text style={[styles.footerText, { color: palette.muted }]}>Versão demonstrativa</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,15,25,0.48)' },
  panel: { width: '82%', maxWidth: 340, height: '100%', paddingTop: 58, paddingHorizontal: 20, paddingBottom: 24 },
  profile: { paddingBottom: 24, borderBottomWidth: 1, marginBottom: 22 },
  avatar: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 21, fontWeight: '800' },
  name: { fontSize: 17, fontWeight: '800' },
  email: { fontSize: 12, marginTop: 4 },
  menuLabel: { fontSize: 10, letterSpacing: 1.1, fontWeight: '800', marginBottom: 10 },
  menuItem: { paddingVertical: 13, paddingHorizontal: 12, borderRadius: 12, marginBottom: 5 },
  menuTitle: { fontSize: 14, fontWeight: '700' },
  menuDescription: { fontSize: 11, marginTop: 4 },
  footer: { marginTop: 'auto', paddingTop: 18 },
  footerText: { fontSize: 11, marginTop: 4 },
});
