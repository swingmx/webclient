<template>
    <div class="profilesettings">
        <div class="avatar">
            <Avatar :name="username || auth.user.username" />
            <div class="name">
                {{
                    adding_user
                        ? username
                        : `Hi ${auth.user.firstname || auth.user.username}`
                }}
            </div>
            <div
                class="roles"
                v-if="!adding_user"
            >
                <span
                    class="role"
                    v-for="role in auth.user.roles"
                    :key="role"
                >
                    {{ role }}</span
                >
            </div>
        </div>
        <form
            class="updateprof"
            v-auto-animate
            @submit.prevent="handleSubmit"
        >
            <div class="names">
                <label for="username">Username</label>
                <Input
                    :placeholder="adding_user ? 'username' : auth.user.username"
                    @input="(input) => (username = input)"
                />
            </div>
            <label for="pswd"
                >{{ adding_user ? 'Create' : 'Change' }} password</label
            >
            <Input
                type="password"
                placeholder="⏺⏺⏺⏺⏺⏺⏺⏺"
                @input="(input) => (password = input)"
            />
            <div
                class="confirmpassword"
                v-if="password.length"
            >
                <label for="confirmpswd">Confirm password</label>
                <Input
                    type="password"
                    placeholder="⏺⏺⏺⏺⏺⏺⏺⏺"
                    @input="(input) => (confirmPassword = input)"
                />
                <label
                    class="error"
                    v-if="errorText"
                    >{{ errorText }}</label
                >
            </div>
            <button v-if="showSubmit">
                {{ adding_user ? 'Add user' : 'Update' }}
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import useAuth from '@/stores/auth'
import Avatar from '@/components/shared/Avatar.vue'
import Input from '@/components/shared/Input.vue'
import { User } from '@/interfaces'

const props = defineProps<{
    adding_user?: boolean
}>()

const emit = defineEmits<{
    (e: 'userAdded', value: User): void
}>()

const auth = useAuth()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')

const showSubmit = computed(() => {
    if (props.adding_user) {
        return (
            username.value.length &&
            password.value.length &&
            confirmPassword.value.length &&
            !errorText.value
        )
    }
    // show submit button if:
    // username has changed
    // password has changed and is confirmed
    return (
        (!confirmPassword.value.length ||
            (confirmPassword.value && !errorText.value)) &&
        (payload.value.username || payload.value.password)
    )
})

const errorText = computed(() => {
    // if password has not changed, no error
    if (!password.value.length) {
        return ''
    }

    if (
        confirmPassword.value.length &&
        password.value !== confirmPassword.value
    ) {
        return 'Passwords do not match'
    }
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
    .avatar {
        display: flex;
        flex-direction: column;
        align-items: center;

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
            font-size: 14px;
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
