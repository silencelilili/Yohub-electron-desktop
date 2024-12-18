// src/hooks/useLocale.ts
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import type { Ref } from "vue";

export function useLocale() {
  const { locale, t, availableLocales: locales } = useI18n();
  const loading = ref(false);

  const currentLocale = computed(() => locale.value);

  // 支持的语言列表
  const availableLocales = computed(() => locales);

  // 切换语言
  const changeLocale = async (value: string) => {
    loading.value = true;
    try {
      // 动态导入语言包
      // const messages = await import(`../i18n/locales/${value}.ts`);
      // useI18n().global.setLocaleMessage(value, messages.default);

      locale.value = value;
      localStorage.setItem("locale", value);

      // 可选: 修改 HTML lang 属性
      document.querySelector("html")?.setAttribute("lang", value);
    } catch (error) {
      console.error("Failed to load locale:", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    t,
    loading,
    currentLocale,
    availableLocales,
    changeLocale,
  };
}
