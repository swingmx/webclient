<template>
    <div class="welcome-to-swing">
        <h3 class="t-center">
            Welcome to
            <span class="app-name">Swing Music</span>
        </h3>
        <p>
            Swing Music is a web based music player that is designed to provide
            a home 🏡 for all your local music files 💿️.
        </p>
        <hr />
        <p class="t-center">Let there be music!</p>
        <hr />
        <br />

        <div class="bottom-banner">
            <div class="creator t-center">
                Designed and developed by
                <span class="name"
                    ><a
                        target="_blank"
                        href="https://github.com/cwilvx"
                        >@cwilvx</a
                    >
                </span>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.welcome-to-swing {
    p {
        line-height: 1.5rem;
    }

    hr {
        border: none;
        border-bottom: 1px $gray3 solid;
    }

    .app-name {
        font-size: 1.5rem;
        color: $pink;
    }

    .bottom-banner {
        font-size: small;
        margin-top: 1rem;
        opacity: 0.74;

        a {
            color: $pink;
            cursor: pointer !important;
        }
    }
}
</style>
