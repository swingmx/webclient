import useAuth from "@/stores/auth"

export const loggedInUserIsAdmin = () => {
    const auth = useAuth()

    if (auth.user.roles) {
        return auth.user.roles.includes('admin')
    }

    return false
}
