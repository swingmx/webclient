import { createI18n } from "vue-i18n";

import en from './locales/en_US.json';
import it from './locales/it_IT.json';
import ko from './locales/ko.json';
import { useCookies } from "@vueuse/integrations/useCookies";

const userLocale = navigator.language;
export const supportedLocales = ['en_US', 'it_IT', 'ko'];
const fallbackLocale = 'en_US';
const cookies = useCookies();
const locale = supportedLocales.includes(userLocale) ? userLocale : fallbackLocale;

const i18n = createI18n({
  legacy: false,
  locale: cookies.get('locale') ? cookies.get('locale') : locale,
  globalInjection: true,
  messages: {
    en_US: en,
    it_IT: it,
    ko: ko
  },
});

export function getT(){
    return i18n.global;
}

export default i18n;