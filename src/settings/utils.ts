import useAuth from "@/stores/auth"

export const loggedInUserIsAdmin = () => {
    const auth = useAuth()
    return auth.is_admin
}
