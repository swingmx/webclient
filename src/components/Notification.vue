<template>
    <div
        v-if="notifStore.notifs"
        class="toasts"
    >
        <div
            v-for="notif in notifStore.notifs"
            :key="notif.text"
            class="new-notif rounded-sm"
            :class="notif.type"
        >
            <component
                :is="getSvg(notif.type)"
                class="notif-icon"
            />
            <div class="notif-text">{{ notif.text }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { NotifType, useToast } from '../stores/notification'

import HeartSvg from '../assets/icons/heart.svg'
import ErrorSvg from '../assets/icons/toast/error.svg'
import InfoSvg from '../assets/icons/toast/info.svg'
import SuccessSvg from '../assets/icons/toast/ok.svg'
import WorkingSvg from '../assets/icons/toast/working.svg'

const notifStore = useToast()

function getSvg(notif: NotifType) {
    switch (notif) {
        case NotifType.Error:
            return ErrorSvg
        case NotifType.Info:
            return InfoSvg
        case NotifType.Success:
            return SuccessSvg
        case NotifType.Working:
            return WorkingSvg
        case NotifType.Favorite:
            return HeartSvg
    }
}
</script>
<style lang="scss">
.toasts {
  position: fixed;
  bottom: 6rem;
  left: 50%;
  width: 100%;
  transform: translate(-50%);
  z-index: 1003;
  display: flex;
  align-items: center;
  flex-direction: column-reverse;
  gap: 1rem;
}

.new-notif {
  font-size: 0.85rem;
  font-weight: 600;
  width: 18rem;
  min-height: 4rem;
  background-color: $gray;
  display: grid;
  place-items: center;
  box-shadow: 0px 0px 2rem rgba(0, 0, 0, 0.466);
  padding: 1rem $small;

    grid-template-columns: 2rem 3fr;
    gap: $smaller;

  .notif-text {
    width: 100%;
  }

  @include smallestPhones {
    max-width: calc(100% - 2rem);
  }
}

.new-notif.error {
    $bg: rgb(197, 72, 72);
    background-color: $bg;
}

.new-notif.info,
.new-notif.favorite,
.new-notif.success {
    $bg: rgb(255, 255, 255);
    background-color: $bg;
    color: $black;
}

.new-notif.working {
    $bg: $gray4;
    background-color: $bg;
}
</style>
