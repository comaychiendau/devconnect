function getErrorMessage(data, fallbackMessage) {
    if (typeof data === 'string' && data.trim()) {
        return data
    }

    if (data?.message) {
        return data.message
    }

    if (data?.errors) {
        const errorMessages = Object.values(data.errors)
            .flat()
            .filter(Boolean)

        if (errorMessages.length > 0) {
            return errorMessages.join(' ')
        }
    }

    return fallbackMessage
}

async function sendCommunityRequest(path, options = {}) {
    const response = await fetch(path, {
        ...options,
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            ...(options.headers ?? {}),
        },
    })

    const responseText = await response.text()

    let data = null

    if (responseText) {
        try {
            data = JSON.parse(responseText)
        } catch {
            data = responseText
        }
    }

    if (!response.ok) {
        const error = new Error(
            getErrorMessage(
                data,
                `Community request failed (${response.status}).`,
            ),
        )

        error.status = response.status

        throw error
    }

    return data
}

export function getCommunities() {
    return sendCommunityRequest('/api/communities')
}
export function getCommunity(communityId) {
    return sendCommunityRequest(
        `/api/communities/${communityId}`,
    )
}

export function getJoinedCommunities() {
    return sendCommunityRequest('/api/communities/joined')
}

export function joinCommunity(communityId) {
    return sendCommunityRequest(
        `/api/communities/${communityId}/join`,
        {
            method: 'POST',
        },
    )
}

export function leaveCommunity(communityId) {
    return sendCommunityRequest(
        `/api/communities/${communityId}/leave`,
        {
            method: 'DELETE',
        },
    )
}