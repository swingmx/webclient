import { SettingType } from "@/settings/enums";

export interface SettingOption {
  title: string;
  value: any;
}

export interface Setting {
  title?: string;
  desc?: string;
  type: SettingType;
  options?: SettingOption[];
  inactive?: () => boolean;
  action: (arg0?: any) => void;
  state: (() => any) | null;
  button_text?: () => string;
  defaultAction?: () => void;
  show_if?: () => boolean;
  experimental?: boolean;
  new?: boolean;
}

export interface SettingGroup {
  title?: string;
  desc?: string;
  settings: Setting[];
  show_if?: () => boolean;
  experimental?: boolean;
  icon?: string;
}

export interface SettingCategory {
  title: string;
  groups: SettingGroup[];
  show_if?: () => boolean;
}
