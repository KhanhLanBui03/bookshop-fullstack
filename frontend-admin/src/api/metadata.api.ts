import axiosClient from "./axios"

export interface DropdownItem { id: number; name: string }

export const categoryApi = {
    findAll: async (): Promise<DropdownItem[]> => {
        const res = await axiosClient.get("/categories")
        return (res.data.data as { id: number; name: string }[]).map(c => ({ id: c.id, name: c.name }))
    },
}

export const authorApi = {
    findAll: async (): Promise<DropdownItem[]> => {
        const res = await axiosClient.get("/authors")
        return (res.data.data as { id: number; name: string }[]).map(a => ({ id: a.id, name: a.name }))
    },
}

export const publisherApi = {
    findAll: async (): Promise<DropdownItem[]> => {
        const res = await axiosClient.get("/publishers")
        return (res.data.data as { id: number; name: string }[]).map(p => ({ id: p.id, name: p.name }))
    },
}