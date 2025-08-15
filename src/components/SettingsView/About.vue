<template>
    <div class="aboutswingmusic">
        <div class="version">Swing Music v{{ settings.version }}</div>
        <span v-html="t('Settings.About.Developer', { link: '<a href=&quot;https://github.com/cwilvx&quot; target=&quot;_blank&quot;>@<u>cwilvx</u></a>' })"></span>
        <br /><br />
        <div class="links">
            <h2>{{ t('Settings.About.LinksTitle') }}</h2>
            <div class="flex">
                <a
                    href="https://swingmusic.vercel.app/guide/introduction.html"
                    target="_blank"
                    ><button>{{ t('Settings.About.LinksDocs') }}</button></a
                >
                <a
                    href="https://github.com/cwilvx/swingmusic"
                    target="_blank"
                    ><button>{{ t('Settings.About.LinksGitHub') }}</button></a
                >
                <a
                    href="https://github.com/cwilvx/swingmusic/issues/new/choose"
                    target="_blank"
                >
                    <button>{{ t('Settings.About.LinksIssue') }}</button>
                </a>
                <a
                    href="https://github.com/cwilvx/swingmusic/blob/master/.github/contributing.md"
                    target="_blank"
                    ><button>{{ t('Settings.About.LinksContribute') }}</button></a
                >
            </div>
        </div>
        <br />
        <div class="contact">
            <h2>{{ t('Settings.About.GetInTouchTitle') }}</h2>
            {{ t('Settings.About.GetInTouchDescription') }}
            <br /><br />
            <div class="flex">
                <a
                    href="mailto:geoffreymungai45@gmail.com?subject=Hiii 👋😁&body=Hi Mungai,
        "
                    target="_blank"
                    ><button>{{ t('Settings.About.SendEmail') }}</button></a
                >
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import useSettings from '@/stores/settings'
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const settings = useSettings()
</script>

<style lang="scss">
.aboutswingmusic {
    padding: $small;

    .version {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: $small;
        border-bottom: solid 1px $separator;
        padding-bottom: 1rem;
    }

    .links .flex {
        flex-wrap: wrap;
        margin-top: $small;
        gap: 1rem;
    }

    .contact button {
        background-color: $blue;
    }

    h2 {
        margin-top: 0;
        margin-bottom: $smaller;
    }
}
</style>
