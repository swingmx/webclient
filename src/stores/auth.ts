import { defineStore } from 'pinia'
import { User } from '@/interfaces'
import useModal from '@/stores/modal'

import {
    loginUser,
    logoutUser,
    getLoggedInUser,
    updateUserProfile,
} from '@/requests/auth'
import { NotifType, useNotifStore } from '@/stores/notification'

export default defineStore('authStore', {
    state: () => ({
        user: {} as User,
    }),
    actions: {
        async getLoggedInUser() {
            const res = await getLoggedInUser()
            if (res.status === 200) {
                this.setUser(res.data)
            }
        },
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
        async updateProfile(user: { [key: string]: any }) {
            const toast = useNotifStore()
            const res = await updateUserProfile(user)

            if (res.status === 200) {
                this.user = res.data
                toast.showNotification(
                    'Profile updated successfully!',
                    res.status === 200 ? NotifType.Success : NotifType.Error
                )

                return true
            }

            toast.showNotification(
                'Failed! Something went wrong!',
                NotifType.Error
            )

            return false
        },
    },
})
