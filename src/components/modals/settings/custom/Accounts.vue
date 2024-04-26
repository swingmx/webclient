<template>
    <div class="accountsettings">
        <div class="asettings">
            <ToggleSetting
                v-for="s in gsettings"
                :key="s.title"
                :title="s.title"
                :value="s.value.value"
                :desc="s.desc"
                @click="s.action"
            />
        </div>
        <div class="ahead">
            <div class="h2">All users</div>
            <button class="adduser">
                <PlusSvg />
                new user
            </button>
        </div>
        <div class="userlist">
            <div
                class="usercard rounded"
                v-auto-animate
                v-for="user in users"
                :key="user.id"
                :class="{ selected: user.id === selectedUser }"
                @click="() => selectUser(user.id)"
            >
                <div class="userinfo">
                    <Avatar
                        :name="user.username"
                        :size="47"
                    />
                    <div class="details">
                        <div class="name">
                            {{ user.firstname || user.username }}
                        </div>
                        <div class="roles">
                            <span
                                class="role"
                                v-for="role in user.roles"
                                >{{ role }}</span
                            >
                        </div>
                    </div>
                </div>
                <div
                    class="usettins"
                    v-if="user.id === selectedUser"
                >
                    <div
                        v-for="setting in settings"
                        :key="setting.title"
                    >
                        <ToggleSetting
                            v-for="option in setting.options"
                            :key="option.title"
                            :title="option.title"
                            :desc="option.desc"
                            :value="option.value.value"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { User } from '@/interfaces'
import { SettingType } from '@/settings/enums'

import { getAllUsers } from '@/requests/auth'
import Avatar from '@/components/shared/Avatar.vue'
import PlusSvg from '@/assets/icons/plus.svg'
import ToggleSetting from './ToggleSetting.vue'

const selectedUser = ref(0)
const users = ref(<User[]>[])

const enableGuest = ref(false)
const showAllUsers = ref(false)

const gsettings = [
    {
        title: 'Enable guest access',
        desc: 'Allow users to access the site without an account',
        type: SettingType.binary,
        value: enableGuest,
        action: () => {
            enableGuest.value = !enableGuest.value
        },
    },
    {
        title: 'Show users on login',
        desc: 'Show a list of users on your server when logging in',
        type: SettingType.binary,
        value: showAllUsers,
    },
]

const settings = [
    {
        title: 'User roles',
        type: SettingType.binary,
        options: [
            {
                title: 'Admin',
                desc: 'Can do anything',
                value: ref(false),
            },
            {
                title: 'Curator',
                desc: 'Can create and edit content',
                value: ref(false),
            },
        ],
    },
]

function selectUser(id: number) {
    if (selectedUser.value === id) {
        selectedUser.value = 0
        return
    }

    selectedUser.value = id
}

onMounted(async () => {
    const res = await getAllUsers(false)
    users.value = res
})
</script>

<style lang="scss">
.accountsettings {
    width: 100%;

    .adduser svg {
        height: 75%;
    }

    .asettings {
        margin: 0 0 1rem 0;
        padding-bottom: 1rem;
        border-bottom: solid 1px $gray5;
    }

    .ahead {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: $smaller;
    }

    .h2 {
        padding-left: $smaller;
        font-size: 1.15rem;
        font-weight: bold;
    }

    .usercard {
        width: 100%;
        padding: 1rem;
        padding-bottom: 0;
        margin-top: 1rem;
        border: solid 1px $gray5;

        .userinfo {
            display: grid;
            grid-template-columns: max-content 1fr;
            align-items: center;
            gap: 1rem;
            padding-bottom: 1rem;
        }

        .details {
            display: flex;
            justify-content: space-between;
            max-width: 100%;
        }
    }

    .usercard.selected {
        padding-bottom: 1rem;

        .usettins {
            border-top: solid 1px $gray4;
        }
    }

    .usettins {
        padding-top: $small;

        .label {
            color: $gray1;
            font-size: 14px;
            margin-top: $small;
        }
    }
}
</style>
