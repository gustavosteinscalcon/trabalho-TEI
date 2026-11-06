import { AppTheme } from './types';

export interface Palette {
  background: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  muted: string;
  border: string;
  primary: string;
  primarySoft: string;
  danger: string;
  success: string;
  input: string;
}

export const palettes: Record<AppTheme, Palette> = {
  light: {
    background: '#F4F6FA',
    surface: '#FFFFFF',
    surfaceSecondary: '#EEF2F8',
    text: '#182230',
    muted: '#748094',
    border: '#E1E6EF',
    primary: '#4459D9',
    primarySoft: '#E9ECFF',
    danger: '#C63D53',
    success: '#168A69',
    input: '#FAFBFD',
  },
  dark: {
    background: '#111722',
    surface: '#1B2432',
    surfaceSecondary: '#263244',
    text: '#F1F4F9',
    muted: '#A0AEC0',
    border: '#344154',
    primary: '#8998FF',
    primarySoft: '#303A68',
    danger: '#FF7186',
    success: '#58C6A0',
    input: '#202B3A',
  },
};

export const RECORD_COLORS = [
  '#4459D9', '#16A085', '#E58A30', '#C65375', '#7A58C7', '#3987B8',
];
