import { ThemeEnum } from "@/enums/ThemeEnum";

const COLOR_PATTERN = /^#[\da-f]{6}$/i;

function hexToRgb(hex: string): [number, number, number] {
  const bigint = Number.parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function mixColor(hex: string, target: 0 | 255, weight: number): string {
  const rgb = hexToRgb(hex);
  const mixed = rgb.map((value) =>
    Math.round(value + (target - value) * weight)
  ) as [number, number, number];
  return rgbToHex(...mixed);
}

export function generateThemeColors(primary: string) {
  const safePrimary = COLOR_PATTERN.test(primary) ? primary : "#315EFB";
  const colors: Record<string, string> = {
    primary: safePrimary,
  };

  for (let i = 1; i <= 9; i++) {
    colors[`primary-light-${i}`] = mixColor(safePrimary, 255, i * 0.1);
  }

  colors["primary-dark-2"] = mixColor(safePrimary, 0, 0.2);

  return colors;
}

export function applyTheme(colors: Record<string, string>) {
  const el = document.documentElement;

  el.style.setProperty("--app-primary", colors.primary);

  Object.entries(colors).forEach(([key, value]) => {
    el.style.setProperty(`--el-color-${key}`, value);
  });
}

export function isDarkTheme(theme: string, systemPrefersDark: boolean) {
  return (
    theme === ThemeEnum.DARK || (theme === ThemeEnum.AUTO && systemPrefersDark)
  );
}

export function toggleDarkMode(isDark: boolean) {
  const root = document.documentElement;
  root.classList.toggle("dark", isDark);
  root.dataset.theme = isDark ? ThemeEnum.DARK : ThemeEnum.LIGHT;
}
