import { createI18n } from "vue-i18n";

import en from './locales/en_US.json';
import it from './locales/it_IT.json';
import ko from './locales/ko.json';
import zh from './locales/zh_CN.json';
import pt from './locales/pt_BR.json';
import { readLocalStorage } from "./utils/useLocalStorage";

export const supportedLocales = ['en_US', 'it_IT', 'ko', 'zh_CN', 'pt_BR'];
const fallbackLocale = 'en_US';

function detectBrowserLocale(): string {
  const tags = navigator.languages?.length ? navigator.languages : [navigator.language];

  for (const tag of tags) {
    const normalized = tag.replace('-', '_');
    const exact = supportedLocales.find(l => l === normalized);
    if (exact) return exact;

    const language = normalized.split('_')[0];
    const byLanguage = supportedLocales.find(l => l.split('_')[0] === language);
    if (byLanguage) return byLanguage;
  }

  return fallbackLocale;
}

// Runs before Pinia is installed, so peek at the persisted settings store directly.
function readSavedLocale(): string | null {
  try {
    const saved = readLocalStorage('settings')?.locale;
    return supportedLocales.includes(saved) ? saved : null;
  } catch {
    return null;
  }
}

const i18n = createI18n({
  legacy: false,
  locale: readSavedLocale() ?? detectBrowserLocale(),
  fallbackLocale,
  globalInjection: true,
  messages: {
    en_US: en,
    it_IT: it,
    ko: ko,
    zh_CN: zh
  }
});

export function useT(){
    return i18n.global;
}

export default i18n;
