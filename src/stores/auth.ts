import { defineStore } from 'pinia'
import { User } from '@/interfaces'
import useModal from '@/stores/modal'

import { loginUser, logoutUser } from '@/requests/auth'
import { NotifType, useNotifStore } from '@/stores/notification'

export default defineStore('authStore', {
    state: () => ({
        user: {} as User,
    }),
    actions: {
        setUser(user: User) {
            this.user = user
        },
        async login(username: string, password: string) {
            const res = await loginUser(username, password)
            console.log(res)
            const modal = useModal()
            const toast = useNotifStore()

            if (res.status === 200) {
                toast.showNotification(res.data.msg, NotifType.Success)
                modal.hideModal()
                window.location.reload()
            } else {
                toast.showNotification(res.data.msg, NotifType.Error)
            }
        },
        async logout() {
            await logoutUser()
            window.location.reload()
        },
    },
})
