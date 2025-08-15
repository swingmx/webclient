import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from 'vue-i18n'

import { MotionPlugin } from "@vueuse/motion";
import WrapBalancer from "vue-wrap-balancer";

import {
  RecycleScroller,
  DynamicScroller,
  DynamicScrollerItem,
  // @ts-ignore
} from "vue-virtual-scroller";
import VWave from "v-wave";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from "./App.vue";
import { router } from "./router";
import vTooltip from "./directives/vTooltip";

import "./assets/scss/index.scss";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

const app = createApp(App);
import en from './locales/en.json';
import ko from './locales/ko.json';

const userLocale = navigator.language.split('-')[0];
const supportedLocales = ['en', 'ko'];
const fallbackLocale = 'en';
const locale = supportedLocales.includes(userLocale) ? userLocale : fallbackLocale;

const i18n = createI18n({
  legacy: false,
  locale: locale,
  messages: {
    en: en,
    ko: ko
  },
});

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(autoAnimatePlugin);
app.use(VWave);
app.use(i18n);
app.use(MotionPlugin);

app.directive("tooltip", vTooltip);

app.component("WrapBalancer", WrapBalancer);
app.component("RecycleScroller", RecycleScroller);
app.component("DynamicScroller", DynamicScroller);
app.component("DynamicScrollerItem", DynamicScrollerItem);

app.mount("#app");
