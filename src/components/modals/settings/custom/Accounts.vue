<template>
    <div class="accountsettings">
        <div class="userlist">
            <div
                class="usercard rounded-sm"
                v-for="user in users"
                :key="user.id"
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
                <div class="settings">
                    <div
                        v-for="setting in settings"
                        :key="setting.title"
                    >
                        <!-- <div class="label">{{ setting.title }}</div> -->
                        <div
                            class="setting rounded-sm"
                            v-for="option in setting.options"
                            :key="option.title"
                        >
                            <div class="text">
                                <div>{{ option.title }}</div>
                                <div class="desc">{{ option.desc }}</div>
                            </div>
                            <Switch
                                :state="option.value.value"
                                @click="
                                    option.value.value = !option.value.value
                                "
                            />
                        </div>
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
import Switch from '@/components/SettingsView/Components/Switch.vue'

const users = ref(<User[]>[])

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

onMounted(async () => {
    const res = await getAllUsers(false)
    users.value = res
})
</script>

<style lang="scss">
.accountsettings {
    width: 100%;

    .usercard {
        width: 100%;
        padding: 1rem;
        border: solid 1px $gray5;

        .userinfo {
            display: flex;
            align-items: center;
            gap: 1rem;
            border-bottom: solid 1px $gray4;
            padding-bottom: $small;
        }
    }

    .settings {
        padding-top: $small;

        .label {
            color: $gray1;
            // text-transform: uppercase;
            font-size: 14px;
            margin-top: $small;
        }

        .setting {
            // background-color: $gray;
            // padding: $small;
            // margin-top: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;

            padding: $small;
            cursor: pointer;

            &:hover {
                background-color: $gray5;
            }
        }

        .switch {
            display: unset;
        }
    }
}
</style>
