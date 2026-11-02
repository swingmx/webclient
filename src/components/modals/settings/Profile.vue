<template>
    <div class="profilesettings">
        <div class="profileavatar">
            <div class="avatarwrapper">
                <Avatar :name="username || auth.user.username" :image="adding_user ? null : auth.user.image" />
                <div v-if="canEditImage" class="avataractions">
                    <button
                        type="button"
                        class="avataraction"
                        :title="$t('Profile.ChangeImage')"
                        @click="fileInput?.click()"
                    >
                        <PencilSvg />
                    </button>
                    <button
                        v-if="auth.user.image"
                        type="button"
                        class="avataraction"
                        :title="$t('Profile.RemoveImage')"
                        @click="auth.removeImage()"
                    >
                        <DeleteSvg />
                    </button>
                </div>
                <input ref="fileInput" type="file" accept="image/*" hidden @change="handleImage" />
            </div>
            <div class="name">
                {{ adding_user ? username : $t('Profile.HiUser', {user: auth.user.username}) }}
            </div>
            <div v-if="!adding_user" class="roles">
                <span v-for="role in auth.user.roles" :key="role" class="role"> {{ role }}</span>
            </div>
        </div>
        <form v-auto-animate class="updateprof" @submit.prevent="handleSubmit">
            <div class="names">
                <label for="username">{{ $t('Profile.Username')}}</label>
                <Input
                    :placeholder="adding_user ? $t('Profile.Username')  : auth.user.username"
                    @input="input => (username = input)"
                />
            </div>
            <label for="pswd">{{ adding_user ? $t('Profile.PasswordAction', { action: $t('Common.Create') }) 
                : $t('Profile.PasswordAction', { action: $t('Common.Change') }) }}</label>
            <Input type="password" placeholder="✶✶✶✶✶✶✶✶" @input="input => (password = input)" />
            <div v-if="password.length" class="confirmpassword">
                <label for="confirmpswd">{{ $t('Profile.ConfirmPassword') }}</label>
                <Input type="password" placeholder="✶✶✶✶✶✶✶✶" @input="input => (confirmPassword = input)" />
                <label v-if="errorText" class="error">{{ errorText }}</label>
            </div>
            <button v-if="showSubmit">
                {{ adding_user ? $t('Profile.AddUser') : $t('Common.Update') }}
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import DeleteSvg from '@/assets/icons/delete.svg'
import PencilSvg from '@/assets/icons/pencil.svg'
import Avatar from '@/components/shared/Avatar.vue'
import Input from '@/components/shared/Input.vue'
import { User } from '@/interfaces'
import useAuth from '@/stores/auth'

const { t } = useI18n()

const props = defineProps<{
    adding_user?: boolean
}>()

const emit = defineEmits<{
    (e: 'userAdded', value: User): void
}>()

const auth = useAuth()

const fileInput = ref<HTMLInputElement>()
const canEditImage = computed(() => !props.adding_user && auth.user.roles && !auth.user.roles.includes('guest'))

const username = ref('')
const password = ref('')
const confirmPassword = ref('')

const showSubmit = computed(() => {
    if (props.adding_user) {
        return username.value.length && password.value.length && confirmPassword.value.length && !errorText.value
    }
    // show submit button if:
    // username has changed
    // password has changed and is confirmed
    return (
        (!confirmPassword.value.length || (confirmPassword.value && !errorText.value)) &&
        (payload.value.username || payload.value.password)
    )
})
const errorText = computed(() => {
    // if password has not changed, no error
    if (!password.value.length) {
        return ''
    }

    if (confirmPassword.value.length && password.value !== confirmPassword.value) {
        return t('Profile.PasswordMismatch')
    }

    return ""
})

const payload = computed(() => {
    const payload = {
        username: '',
        password: '',
    }

    if (username.value.length && username.value !== auth.user.username) {
        payload['username'] = username.value
    }

    if (password.value.length && password.value === confirmPassword.value) {
        payload['password'] = password.value
    }

    return payload
})

async function handleSubmit() {
    if (props.adding_user) {
        const user = await auth.addNewUser(payload.value)
        if (user) {
            return emit('userAdded', user)
        }

        return
    }

    await updateProfile()
}

async function handleImage(e: Event) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    input.value = ''

    if (file) {
        await auth.updateImage(file)
    }
}

async function updateProfile() {
    const success = await auth.updateProfile(payload.value)
    if (success) {
        // clear form
        username.value = ''
        password.value = ''
        confirmPassword.value = ''
    }
}

onMounted(async () => {
    if (props.adding_user) {
        return
    }
    await auth.getLoggedInUser()
})
</script>

<style lang="scss">
.profilesettings {
    .profileavatar {
        display: flex;
        flex-direction: column;
        align-items: center;

        .avatarwrapper {
            position: relative;
        }

        .avataractions {
            position: absolute;
            top: -0.25rem;
            right: -0.75rem;
            display: flex;
            gap: 0.25rem;
        }

        .avataraction {
            display: grid;
            place-items: center;
            width: 1.75rem;
            height: 1.75rem;
            padding: 0;
            border-radius: 50%;
            background-color: $gray3;

            svg {
                width: 0.85rem;
                height: 0.85rem;
            }

            &:hover {
                background-color: $gray2;
            }
        }

        .name {
            font-weight: 500;
            margin-top: 0.5rem;
        }
    }

    .roles {
        margin-top: $small;
    }

    .updateprof {
        width: 60%;
        margin: 0 auto;
        margin-top: 1rem;

        .names {
            margin-bottom: 1rem;
        }

        .confirmpassword {
            margin-top: 1rem;
        }

        label {
            margin-bottom: 0.5rem;
            font-weight: 500;
            font-size: 0.9rem;
            color: $gray1;
        }

        input {
            width: 100%;
            padding: 0.5rem;
            margin: 0.5rem 0;
            border: solid 1px $gray5;
            border-radius: $small;
            border: none;
            background-color: $gray5;
            height: 2.75rem;
            font-size: 1rem;
            padding: 1rem;
            color: $white;

            &:focus {
                outline: solid 2px $white;
            }
        }

        .error {
            color: $red;
        }

        button {
            background: $darkblue;
            padding: $medium 1.5rem;
            margin: 1rem auto;
        }
    }
}
</style>
