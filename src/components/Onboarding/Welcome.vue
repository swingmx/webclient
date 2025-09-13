<template>
    <div class="welcome">
        <div class="logo"><LogoSvg /></div>
        <div class="heading">Welcome to</div>
        <div class="appname">Swing Music</div>
        <p class="tagline">
            You will need to configure your account login details <br />
            and root directories to get started.
        </p>
        <button class="btn-continue" @click="emit('continue')">Get Started</button>
    </div>
</template>

<script setup lang="ts">
import LogoSvg from '@/assets/icons/logos/logo-fill.light.svg'

const emit = defineEmits(['continue'])
</script>

<style lang="scss">
.welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $medium;

    // center everything
    text-align: center;

    .logo {
        width: 100%;
        height: 100%;
    }

    .appname {
        color: $highlight-blue;
        font-size: 2.5rem;
        font-weight: 700;
        // gradient text
        background: linear-gradient(to right, $red, $blue, $red);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        // disable selection
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
}
</style>
