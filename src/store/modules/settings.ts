import defaultSettings from "@/settings";
import { ThemeEnum } from "@/enums/ThemeEnum";
import {
  generateThemeColors,
  applyTheme,
  isDarkTheme,
  toggleDarkMode,
} from "@/utils/theme";

type SettingsValue = boolean | string;

export const useSettingsStore = defineStore("setting", () => {
  // 基本设置
  const settingsVisible = ref(false);
  // 标签
  const tagsView = useStorage<boolean>("tagsView", defaultSettings.tagsView);
  // 侧边栏 Logo
  const sidebarLogo = useStorage<boolean>(
    "sidebarLogo",
    defaultSettings.sidebarLogo
  );
  // 固定头部
  const fixedHeader = useStorage<boolean>(
    "fixedHeader",
    defaultSettings.fixedHeader
  );
  // 布局
  const layout = useStorage<string>("layout", defaultSettings.layout);
  const contentWidth = useStorage<AppSettings["contentWidth"]>(
    "contentWidth",
    defaultSettings.contentWidth
  );
  // 水印
  const watermarkEnabled = useStorage<boolean>(
    "watermarkEnabled",
    defaultSettings.watermarkEnabled
  );

  // 主题
  const themeColor = useStorage<string>(
    "themeColor",
    defaultSettings.themeColor
  );
  const theme = useStorage<string>("theme", defaultSettings.theme);
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const systemPrefersDark = ref(mediaQuery.matches);
  const isDark = computed(() =>
    isDarkTheme(theme.value, systemPrefersDark.value)
  );

  mediaQuery.addEventListener("change", (event) => {
    systemPrefersDark.value = event.matches;
  });

  // 监听主题变化
  watch(
    [isDark, themeColor],
    ([dark, newThemeColor]) => {
      toggleDarkMode(dark);
      const colors = generateThemeColors(newThemeColor);
      applyTheme(colors);
    },
    { immediate: true }
  );
  // 设置更改函数
  const settingsMap: Record<string, Ref<SettingsValue>> = {
    fixedHeader,
    tagsView,
    sidebarLogo,
    layout,
    contentWidth,
    watermarkEnabled,
  };

  function changeSetting({
    key,
    value,
  }: {
    key: string;
    value: SettingsValue;
  }) {
    const setting = settingsMap[key];
    if (setting) setting.value = value;
  }

  function changeTheme(val: string) {
    theme.value = val;
  }

  function changeThemeColor(color: string) {
    themeColor.value = color;
  }

  function changeLayout(val: string) {
    layout.value = val;
  }

  return {
    settingsVisible,
    tagsView,
    fixedHeader,
    sidebarLogo,
    layout,
    contentWidth,
    themeColor,
    theme,
    isDark,
    watermarkEnabled,
    changeSetting,
    changeTheme,
    changeThemeColor,
    changeLayout,
  };
});
