import { paths } from '@/config'
import useAxios from './useAxios'
import { User, UserSimplified } from '@/interfaces'

export async function getAllUsers() {
    const data = await useAxios({
        url: paths.api.auth.allUsers,
        method: 'GET',
    })

    return data.data as UserSimplified[]
}

export async function loginUser(username: string, password: string) {
    const res = await useAxios({
        url: paths.api.auth.login,
        props: {
            username,
            password,
        },
    })

    return res
}

export async function logoutUser() {
    const res = await useAxios({
        url: paths.api.auth.logout,
        method: 'GET',
    })

    return res
}

export async function getLoggedInUser() {
    const res = await useAxios({
        url: paths.api.auth.currentUser,
        method: 'GET',
    })

    return res
}
