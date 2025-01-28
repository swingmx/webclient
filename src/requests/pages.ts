import { Album, Artist, Mix, Page, Playlist } from '@/interfaces'
import useAxios from './useAxios'
import { paths } from '@/config'

const { base: basePageUrl } = paths.api.pages

export async function getAllPages() {
    const { data, status } = await useAxios({
        url: basePageUrl,
        method: 'GET',
    })

    if (status == 200) {
        return data as Page[]
    }

    return []
}

export async function getPage(page_id: string) {
    const { data, status } = await useAxios({
        url: basePageUrl + `/${page_id}`,
        method: 'GET',
    })

    return data as Page
}

export async function createNewPage(
    name: string,
    description: string,
    items?: { hash: string; type: string; extra: any }[]
) {
    const { data, status } = await useAxios({
        url: basePageUrl,
        props: {
            name,
            description,
            items,
        },
        method: 'POST',
    })

    if (status == 201) {
        return true
    }

    return false
}

export async function updatePage(page: Page, name: string, description: string) {
    const { data, status } = await useAxios({
        url: basePageUrl + `/${page.id}`,
        props: {
            name,
            description,
        },
        method: 'PUT',
    })

    if (status == 200) {
        return data.page as Page
    }

    return null
}

export async function addItemToPage(page: Page, item: Album | Artist | Mix | Playlist, type: string) {
    const payload = {
        type: type,
        hash: '',
        extra: {},
    }

    switch (type) {
        case 'album':
            payload.hash = (item as Album).albumhash
            break
        case 'artist':
            payload.hash = (item as Artist).artisthash
            break
        case 'mix':
            payload.hash = (item as Mix).sourcehash
            break
        case 'playlist':
            payload.hash = (item as Playlist).id.toString()
            break
    }

    if (payload.hash === '') {
        throw new Error('Invalid item type. Item not added to page.')
    }

    const { data, status } = await useAxios({
        url: basePageUrl + `/${page.id}/items`,
        props: {
            items: [payload],
        },
        method: 'POST',
    })

    if (status == 200) {
        return true
    }

    return false
}
