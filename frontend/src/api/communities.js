function getErrorMessage(data, status) {
    if (typeof data === 'string' && data.trim()) {
        return data
    }

    return (
        data?.message ||
        data?.title ||
        `Unable to load communities. Server returned ${status}.`
    )
}

export async function getCommunities() {
    const response = await fetch('/api/communities', {
        method: 'GET',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        },
    })

    const text = await response.text()
    let data = null

    if (text) {
        try {
            data = JSON.parse(text)
        } catch {
            data = text
        }
    }

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, response.status),
        )
    }

    if (!Array.isArray(data)) {
        throw new Error(
            'The server returned an invalid communities response.',
        )
    }

    return data
}