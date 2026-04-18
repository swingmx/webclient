<template>
    <div class="welcome">
        <div class="logo"><LogoSvg /></div>
        <div class="heading">Welcome to</div>
        <div class="appname">Swing Music</div>
        <p class="tagline">
            Click the button below to let's create your account <br />
            <!-- and configure your music folders to get started. -->
        </p>
        <button class="btn-continue" tabindex="0" @click="emit('continue')">Get Started</button>
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
