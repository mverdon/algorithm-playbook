// Visualization configuration type definitions

export enum ThemeType {
  Light = 'light',
  Dark = 'dark',
  Colorful = 'colorful'
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface VisualizationConfig {
  speed: number;
  size: number;
  theme: ThemeType;
}
