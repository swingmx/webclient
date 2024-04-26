import { paths } from '@/config'
import useAxios from './useAxios'
import { User, UserSimplified } from '@/interfaces'

export async function getAllUsers<T extends boolean>(simple: T = true as T) {
    const data = await useAxios({
        url: paths.api.auth.allUsers + (simple ? '?simplified=true' : ''),
        method: 'GET',
    })

    return data.data as T extends true ? UserSimplified[] : User[]
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

export async function updateUserProfile(user: any) {
    const res = await useAxios({
        url: paths.api.auth.updateProfile,
        method: 'PUT',
        props: user,
    })

    return res
}

export async function addNewUser(user: any) {
    const res = await useAxios({
        url: paths.api.auth.addUser,
        method: 'POST',
        props: user,
    })

    return res
}