<template>
    <div class="player-spinner circular"></div>
</template>

<style lang="scss">
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.player-spinner {
    height: 1.35rem;
    aspect-ratio: 1;
    border: solid transparent;
    border-top: solid;
    border-left: solid;
    animation: spin 400ms linear infinite;
}
</style>
