<template>
    <div class="account">
        <form class="createadmin" @submit.prevent="createAccount">
            <Avatar class="avatar" :name="username" :size="48"/>
            <div>
                <div class="heading">Create admin account</div>
                <div class="description">This account will be used to manage your server.</div>
            </div>
            <br />
            <div class="form">
                <div class="names">
                    <label for="username">Username</label>
                    <Input :placeholder="username" input-id="username" required @input="input => (username = input)" />
                </div>
                <div class="passwords">
                    <div class="names">
                        <label for="password">Password</label>
                        <Input
                            :placeholder="password"
                            type="password"
                            input-id="password"
                            required
                            @input="input => (password = input)"
                        />
                    </div>
                    <div class="names">
                        <label for="confirmPassword">Confirm Password</label>
                        <Input
                            :placeholder="confirmPassword"
                            type="password"
                            input-id="confirmPassword"
                            required
                            @input="input => (confirmPassword = input)"
                        />
                    </div>
                </div>
            </div>
            <button class="btn-continue">Create account</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { addNewUser } from '@/requests/auth'
import Input from '@/components/shared/Input.vue'
import Avatar from '@/components/shared/Avatar.vue'

const username = ref('')
const password = ref('✶✶✶✶✶✶✶✶')
const confirmPassword = ref('✶✶✶✶✶✶✶✶')

const emit = defineEmits(['accountCreated', 'error'])

function validatePassword() {
    // check if password is at least 8 characters
    if (password.value.length < 8) {
        return emit('error', 'Password must be at least 8 characters')
    }

    // check if password and confirm password match
    if (password.value !== confirmPassword.value) {
        return emit('error', 'Passwords do not match')
    }

    emit('error', '')
    return true
}

async function createAccount() {
    if (!validatePassword()) {
        return
    }

    const response = await addNewUser({
        username: username.value,
        password: password.value,
    })

    if (response.status === 200) {
        emit('accountCreated', response.data.userhome)
    }
}

onMounted(() => {
    // focus on username input
    document.getElementById('username')?.focus()
})
</script>

<style lang="scss">
.account {
    .passwords {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        margin-top: $small;
    }

    .createadmin {
        width: 100%;
        height: 100%;
        // outline: solid 1px;
        position: relative;

        .heading {
            margin-bottom: $smaller;
        }

        .avatar {
            position: absolute;
            top: 0;
            right: 0;
            // outline: solid 1px;
        }
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: flex-end;

        label {
            font-size: 0.9rem;
            font-weight: 600;
            color: rgb(210, 210, 210);
        }
    }
}
</style>
