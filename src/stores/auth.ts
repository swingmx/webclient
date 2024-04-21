import { defineStore } from 'pinia'
import { User } from '@/interfaces'
import useModal from '@/stores/modal'

export default defineStore('authStore', {
    state: () => ({
        user: {} as User,
    }),
    actions: {
        setUser(user: User) {
            console.log('Setting user:', user)
            this.user = user
        },
        logout() {
            this.user = {} as User
            useModal().showLoginModal()
        },
    },
})
