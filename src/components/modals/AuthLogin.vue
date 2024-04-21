<template>
    <div
        class="loginmodal"
        v-auto-animate
    >
        <div
            class="head"
            :class="{ selected }"
        >
            <!-- <LogoSvg /> Swing Music -->
            <button
                class="back rounded-sm"
                title="Back to selection"
                @click="resetSelected"
            >
                <span>back</span> <ArrowSvg />
            </button>
            <Logo />
            <button
                class="back back2 rounded-sm"
                title="Back to selection"
            >
                <span>back</span> <ArrowSvg />
            </button>
        </div>
        <div class="helptext">
            <div class="h2">Welcome back</div>
            <!-- <div class="help">Please log in to access your music</div> -->
            <!-- <div class="desc">Please select your account to continue</div> -->
        </div>

        <div
            class="selected-user"
            v-if="selected"
        >
            <User
                :user="selected"
                :selected="true"
            />
            <!-- <div class="help">Please log in to access your music</div> -->
        </div>
        <div
            class="userlist"
            v-auto-animate
            v-else
        >
            <User
                v-for="user in users"
                @click="setUser(user)"
                :user="user"
                :key="user.id"
            />
        </div>
        <form
            class="passinput"
            v-if="selected"
            @submit.prevent="login"
        >
            <input
                type="password"
                class="rounded-sm"
                placeholder="Enter password"
                ref="loginpass"
            />
            <button class="submit">Login</button>
        </form>
        <div
            class="guestlink"
            v-if="!selected"
        >
            <div>Login with username</div>
            <div>Or continue as guest</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Ref, nextTick, onMounted, ref } from 'vue'

import { UserSimplified } from '@/interfaces'
import { getAllUsers, loginUser } from '@/requests/auth'

import useAuth from '@/stores/auth'
import useModal from '@/stores/modal'
import { NotifType, useNotifStore } from '@/stores/notification'

import Logo from '../Logo.vue'
import User from '../shared/LoginUserCard.vue'
import ArrowSvg from '../../assets/icons/expand.svg'

const modal = useModal()
const toast = useNotifStore()
const auth = useAuth()

const loginpass: Ref<HTMLInputElement | null> = ref(null)
const users: Ref<UserSimplified[]> = ref([])
const selected = ref<UserSimplified | null>(null)

async function setUser(user: UserSimplified) {
    selected.value = user

    await nextTick()
    loginpass.value?.focus()
}

function resetSelected() {
    selected.value = null
}

async function login() {
    const password = loginpass.value?.value
    if (!password) {
        return
    }

    const res = await loginUser(selected.value!.username, password)
    if (res.status === 200) {
        console.log('logged in')
        toast.showNotification(res.data.msg, NotifType.Success)
        modal.hideModal()
        window.location.reload()
    } else {
        console.log('login failed', res)
        toast.showNotification(res.data.msg, NotifType.Error)
    }
}

onMounted(async () => {
    let res = await getAllUsers()

    if (res.length === 1) {
        setTimeout(() => {
            setUser(res[0])
        }, 250)
    }

    users.value = res
})
</script>

<style lang="scss">
.loginmodal {
    min-height: 30rem;
    position: relative;

    .messages {
        text-align: center;
        padding: $small;
        margin-top: 1rem;

        .success {
            color: $green;
        }
    }

    .helptext {
        padding: 0 $small;
        text-align: center;
        margin: 1.5rem 0;
        color: $white;

        .h2 {
            font-size: 2rem;
            font-weight: bold;
            margin-top: 0;
        }
    }

    .head {
        text-align: center;
        // margin-bottom: 2rem;
        border-bottom: solid 1px $gray5;
        width: calc(100% + 2.5rem);
        margin-left: -1.25rem;
        padding: 0 1rem 1rem 1rem;

        display: flex;
        justify-content: space-between;
        align-items: center;

        .back {
            background: none;
            transform: rotate(180deg);
            opacity: 0;

            span {
                transform: rotate(180deg);
            }
        }

        .back2 {
            // NOTE: This element is used to center the Swing Music logo
            visibility: hidden;
        }
    }

    .head.selected .back {
        opacity: 1;
        transition: all 0.25s;
    }

    .swing-logo {
        width: max-content;
        padding: $small 2rem;
        background: none;
        border: none;
        pointer-events: none;

        svg {
            transform: scale(0.85);
        }
    }

    .selected-user {
        display: grid;
        place-items: center;
        margin-top: 2rem;
    }

    .userlist {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        padding: 1rem 0;
    }

    .passinput {
        width: 60%;
        margin: 0 auto;
        margin-top: 1rem;
        display: grid;
        gap: 1rem;
        align-items: center;

        input {
            width: 100%;
            height: 3rem;
            padding: 1rem;
            font-size: 1rem;
            border: none;
            outline: none;
            background-color: $gray5;
            color: $gray1;
            text-align: center;
        }

        .submit {
            height: 3rem;
            background-color: $darkblue;
        }
    }

    .guestlink {
        position: absolute;
        width: 100%;
        bottom: 0;
        margin-top: 2rem;
        padding: 0 $medium;
        color: $gray2;
        display: flex;
        justify-content: space-around;
        text-decoration: underline;

        & > * {
            cursor: pointer;
        }
    }
}
</style>
