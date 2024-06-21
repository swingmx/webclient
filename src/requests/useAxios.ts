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

        if (error.response?.status === 401) {
            useModal().showLoginModal()
        }

        if (error.response?.status === 422) {
            await logoutUser()
            useModal().showLoginModal()
        }

        return {
            error: error.message,
            data: error.response?.data,
            status: error.response?.status,
        }
    }

    // await getAxios()
    //   .then((res: AxiosResponse) => {
    //     data = res.data;
    //     status = res.status;
    //   })
    //   .catch((err: AxiosError) => {
    //     error = err.message as string;
    //     status = err.response?.status as number;
    //   })
    //   .then(() => stopLoading());

    // return { data, error, status };
}

// TODO: Set base url in axios config
