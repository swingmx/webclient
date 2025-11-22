import { Setting } from '@/interfaces/settings'
import settings from '@/stores/settings'
import { SettingType } from '../enums'
import { getT } from '@/i18n';

const { t } = getT();


// const use_legacy_streaming_endpoint: Setting = {
//     title: t('Settings.Audio.LegacyStreaming.Title'),
//     desc: t("Settings.Audio.LegacyStreaming.Description"),
//     type: SettingType.binary,
//     state: () => settings().use_legacy_streaming_endpoint,
//     action: () => settings().toggleUseLegacyStreamingEndpoint(),
// }

const use_silence: Setting = {
    title: t("Settings.Audio.UseSilence.Title"),
    desc: t("Settings.Audio.UseSilence.Description"),
    type: SettingType.binary,
    state: () => settings().use_silence_skip,
    action: () => settings().toggleUseSilenceSkip(),
}

const use_crossfade: Setting = {
    title: t('Settings.Audio.UseCrossfade.Title'),
    desc: t('Settings.Audio.UseCrossfade.Description'),
    type: SettingType.binary,
    state: () => settings().use_crossfade,
    action: () => settings().toggleCrossfade(),
    // @ts-ignore
    experimental: !window.chrome,
}

const crossfade: Setting = {
    title: t('Settings.Audio.CrossfadeDuration.Title'),
    desc: t('Settings.Audio.CrossfadeDuration.Description'),
    type: SettingType.locked_number_input,
    state: () => settings().crossfade_duration_seconds,
    action: (duration: number) => settings().setCrossfadeDuration(duration),
    defaultAction: () => {},
    show_if: () => settings().use_crossfade,
}

// const streaming_quality_options = [
//     {
//         title: t("Settings.Audio.StreamingQuality.Original"),
//         key: 'original',
//     },
//     // {
//     //     title: t("Settings.Audio.StreamingQuality.1024Flac"),
//     //     key: '1024',
//     // },
//     // {
//     //     title: t("Settings.Audio.StreamingQuality.640Flac"),
//     //     key: '640',
//     // },
//     {
//         title: t('Settings.Audio.StreamingQuality.320'),
//         key: '320',
//     },
//     {
//         title: t("Settings.Audio.StreamingQuality.128"),
//         key: '128',
//     },
//     {
//         title: t("Settings.Audio.StreamingQuality.96"),
//         key: '96',
//     },
// ]

// const transcoding: Setting = {
//     title: t("Settings.Audio.StreamingQuality.Title"),
//     desc: t("Settings.Audio.StreamingQuality.Description"),
//     type: SettingType.streaming_quality,
//     state: () => streaming_quality_options.find(option => option.key === settings().streaming_quality),
//     action: (quality: {
//         key: string
//         title: string
//     }) => settings().setStreamingQuality(quality.key),
//     defaultAction: () => {},
//     show_if: () => !settings().use_legacy_streaming_endpoint,
//     options: streaming_quality_options as any,
// }

export default [use_silence, use_crossfade, crossfade]
