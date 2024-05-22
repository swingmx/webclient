<template>
    <div class="aboutswingmusic">
        <div class="version">Swing Music v{{ settings.version }}</div>
        Swing Music is a labor of love developed by
        <a
            href="https://github.com/cwilvx"
            target="_blank"
            >@<u>cwilvx</u></a
        >
        on GitHub. If you like this software, a star on GitHub would be nice.
        Hope you enjoy using it as much as I enjoy building it. 😁🤗
        <br /><br />
        <div class="links">
            <h2>Links</h2>
            <div class="flex">
                <a
                    href="https://swingmusic.vercel.app/guide/introduction.html"
                    target="_blank"
                    ><button>Docs</button></a
                >
                <a
                    href="https://github.com/cwilvx/swingmusic"
                    target="_blank"
                    ><button>Star on Github</button></a
                >
                <a
                    href="https://github.com/cwilvx/swingmusic/issues/new/choose"
                    target="_blank"
                >
                    <button>Report issue</button>
                </a>
                <a
                    href="https://github.com/cwilvx/swingmusic/blob/master/.github/contributing.md"
                    target="_blank"
                    ><button>Contribute</button></a
                >
            </div>
        </div>
        <br />
        <div class="contact">
            <h2>Get in touch</h2>
            If you like my work, and would like to say hi, I'd like to hear from
            you.
            <br /><br />
            <div class="flex">
                <a
                    href="mailto:geoffreymungai45@gmail.com?subject=Hiii 👋😁&body=Hi Mungai,
        "
                    target="_blank"
                    ><button>Send email</button></a
                >
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import useSettings from '@/stores/settings'

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
