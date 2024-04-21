<template>
    <div
        class="loginuser rounded-sm"
        :class="{ selected }"
    >
        <Avatar :name="user.id.toString()" />
        <div class="username">
            {{
                selected
                    ? `Hi ${user.username}`
                    : user.username + ` ${user.id + 1}`
            }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { UserSimplified } from '@/interfaces'
import Avatar from '../shared/Avatar.vue'

defineProps<{
    user: UserSimplified
    selected?: boolean
}>()
</script>

<style lang="scss">
.loginuser {
    display: grid;
    text-align: center;
    place-items: center;
    padding: $small;
    gap: $small;
    width: max-content;

    &.selected {
        pointer-events: none;
    }
}

.loginuser:hover {
    background-color: $gray3;
    cursor: pointer;
}
</style>
