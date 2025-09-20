<template>
    <div class="account">
        <div class="avatarbox rounded-sm">
            <!-- <Avatar :name="username"/> -->
            <!-- <LogoSvg /> -->
        </div>
        <form class="createadmin" @submit.prevent="createAccount">
            <div>
                <div class="heading">Create admin account</div>
                <div class="description">This account will be used to manage your server.</div>
            </div>
            <br />
            <div class="form">
                <div class="names">
                    <label for="username">Username</label>
                    <Input :placeholder="username" input-id="username" @input="input => (username = input)" />
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

const username = ref('admin')
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
    display: grid;
    grid-template-columns: 1fr 1.25fr;
    gap: 1.5rem;
    width: 100%;
    margin: 0 $medium 0 $medium;

    .avatarbox {
        width: 100%;
        height: 100%;
        // background gradient
        background: linear-gradient(37deg, $pink, $purple);
        display: flex;
        // margin-left: $medium;
        align-items: center;
        justify-content: center;
        padding: $small;

        svg {
            transform: scale(2);
        }

        background: url('https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
            no-repeat center center;
        background-size: cover;
    }

    .passwords {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        margin-top: $small;
    }

    .createadmin {
        width: 100%;
        height: 100%;

        .heading {
            margin-bottom: $smaller;
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
