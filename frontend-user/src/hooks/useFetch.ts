import { useEffect, useState } from "react"

export const useFetch = <T>(fetcher: () => Promise<T>) => {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetcher()
            .then(setData)
            .catch(() => setError("Fetch failed"))
            .finally(() => setLoading(false))
    }, [])

    return { data, loading, error }
}
