import { FetchProps } from '@/interfaces'
import axios, { AxiosError, AxiosResponse } from 'axios'
import useModal from '@/stores/modal'

import useLoaderStore from '@/stores/loader'
import { logoutUser } from './auth'

const development = import.meta.env.DEV

export function getBaseUrl() {
    const base_url = window.location.origin

    if (!development) {
        return base_url
    }

    const splits = base_url.split(':')
    return base_url.replace(splits[splits.length - 1], '1980')
}

axios.defaults.baseURL = getBaseUrl()

export default async (args: FetchProps) => {
    const on_ngrok = args.url.includes('ngrok')
    const ngrok_config = {
        'ngrok-skip-browser-warning': 'stupid-SOAB!',
    }

    const { startLoading, stopLoading } = useLoaderStore()
    startLoading()

    try {
        const res = await axios({
            url: args.url,
            data: args.props,
            // INFO: Most requests use POST
            method: args.method || 'POST',
            // INFO: Add ngrok header and provided headers
            headers: { ...args.headers, ...(on_ngrok ? ngrok_config : {}) },
            withCredentials: true,
        })

        stopLoading()
        return {
            data: res.data,
            status: res.status,
        }
    } catch (error: any) {
        stopLoading()

        // was unauthorized
        if (error.response?.status === 401) {
            useModal().showLoginModal()
        }

        // server config folder nuked which can
        // can cause a signature mismatch error
        // console.log(error.response.data.msg == "Signature verification failed")
        let isSignatureError = false

        try {
            isSignatureError = error.response.data.msg == 'Signature verification failed'
        } catch (error) {
            console.log('Error:', error)
        }

        if (error.response?.status === 422 && isSignatureError) {
            await logoutUser()
            useModal().showLoginModal()
        }

        return {
            error: error.message,
            data: error.response?.data,
            status: error.response?.status,
        }
    }
}

// TODO: Set base url in axios config
