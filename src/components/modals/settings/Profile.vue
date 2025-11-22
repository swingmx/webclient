<template>
    <div class="profilesettings">
        <div class="profileavatar">
            <Avatar :name="username || auth.user.username" />
            <div class="name">
                {{ adding_user ? username : $t('Profile.HiUser', {user: auth.user.username}) }}
            </div>
            <div class="roles" v-if="!adding_user">
                <span class="role" v-for="role in auth.user.roles" :key="role"> {{ role }}</span>
            </div>
        </div>
        <div class="updateprof">
            <div class="locale-changer">
                <label>{{ t('Languages.ChooseLang') }}</label>
                <select class="language" v-model="$i18n.locale" @change="updateLang">
                    <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ $t('Languages.'+ locale) }}</option>
                </select>
            </div>                
            <button v-if="setLang" @click="setCookie">
                {{ $t('Profile.SetLanguage') }}
            </button>
            <label class="warning" v-if="setLang">{{ $t('Languages.WarnAppReload') }}</label>
        </div>
        <form class="updateprof" v-auto-animate @submit.prevent="handleSubmit">
            <div class="names">
                <label for="username">{{ $t('Profile.Username')}}</label>
                <Input
                    :placeholder="adding_user ? t('Profile.Username') : auth.user.username"
                    @input="input => (username = input)"
                />                
            </div>
            <label for="pswd">{{ adding_user ? $t('Profile.PasswordAction', {action: $t('Common.Create')}) 
                : $t('Profile.PasswordAction', {action: $t('Common.Change')}) }}</label>
            <Input type="password" placeholder="⏺⏺⏺⏺⏺⏺⏺⏺" @input="input => (password = input)" />
            <div class="confirmpassword" v-if="password.length">
                <label for="confirmpswd">{{ $t('Profile.ConfirmPassword') }}</label>
                <Input type="password" placeholder="⏺⏺⏺⏺⏺⏺⏺⏺" @input="input => (confirmPassword = input)" />
                <label class="error" v-if="errorText">{{ errorText }}</label>
            </div>
            <button v-if="showSubmit">
                {{ adding_user ? $t('Profile.AddUser') : $t('Common.Update') }}
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { computed, ComputedGetter, onMounted, ref } from 'vue'

import Avatar from '@/components/shared/Avatar.vue'
import Input from '@/components/shared/Input.vue'
import { User } from '@/interfaces'
import useAuth from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useRouter } from 'vue-router'

const cookies = useCookies(['locale']);
const router = useRouter();

const { t, locale } = useI18n();

const props = defineProps<{
    adding_user?: boolean
}>()

const emit = defineEmits<{
    (e: 'userAdded', value: User): void
}>()

const auth = useAuth()

const username = ref('')
const password = ref('')
const langIns = ref(false)
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
const setLang = computed(()=> {
    return (langIns.value)
})

const setCookie = function() {
    cookies.set('locale', locale.value)
    langIns.value = false
    //FIXME: Feels like a hack to force reload the whole app; but parts of the UI doesn't update it properly.
    //Adding cookies dependencies to all components might be the only alternative.
    router.go(0);
}

const updateLang = function() {
    langIns.value = true
}

const errorText = computed(() => {
    // if password has not changed, no error
    if (!password.value.length) {
        return ''
    }

    if (confirmPassword.value.length && password.value !== confirmPassword.value) {
        return t('Profile.PasswordMismatch')
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
        langIns.value = false
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

        select {
            width: 100%;
            margin-bottom: 0.5rem;
            margin-top: 0.5rem;
            font-weight: 500;
            font-size: 0.9rem;
            color: $white;
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

        .warning {
            width: 100%;
            color: $yellow;
            text-align: center;
        }

        button {
            background: $darkblue;
            padding: $medium 1.5rem;
            margin: 1rem auto;
        }
    }
}
</style>
