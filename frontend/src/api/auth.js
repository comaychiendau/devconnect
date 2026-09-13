// JavaScript source code
async function sendAuthRequest(path, options = {}) {
    const response = await fetch(`/api/auth/${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers ?? {}),
        },
    })

    const responseText = await response.text()
    let data = null

    if (responseText) {
        try {
            data = JSON.parse(responseText)
        } catch {
            data = {
                message: responseText,
            }
        }
    }

    if (!response.ok) {
        const messages = []

        // ASP.NET Identity errors:
        // { errors: ["Duplicate email", "..."] }
        // or { errors: [{ description: "Duplicate email" }] }
        if (Array.isArray(data?.errors)) {
            for (const error of data.errors) {
                if (typeof error === 'string') {
                    messages.push(error)
                } else if (typeof error?.description === 'string') {
                    messages.push(error.description)
                } else if (typeof error?.message === 'string') {
                    messages.push(error.message)
                }
            }
        }

        // ASP.NET validation errors:
        // { errors: { Email: ["Invalid email"], Password: ["..."] } }
        else if (
            data?.errors &&
            typeof data.errors === 'object'
        ) {
            for (const fieldErrors of Object.values(data.errors)) {
                if (Array.isArray(fieldErrors)) {
                    messages.push(...fieldErrors)
                } else if (typeof fieldErrors === 'string') {
                    messages.push(fieldErrors)
                }
            }
        }

        // Login usually returns:
        // { message: "Invalid email or password" }
        if (
            messages.length === 0 &&
            typeof data?.message === 'string'
        ) {
            messages.push(data.message)
        }

        const error = new Error(
            messages.length > 0
                ? messages.join(' ')
                : 'Authentication request failed.',
        )

        error.status = response.status
        error.data = data

        throw error
    }

    return data
}
export function registerUser(details) {
    return sendAuthRequest("register", {
        method: "POST",
        body: JSON.stringify(details),
    });
}

export function loginUser(details) {
    return sendAuthRequest("login", {
        method: "POST",
        body: JSON.stringify(details),
    });
}

export function getCurrentUser() {
    return sendAuthRequest("me");
}

export function logoutUser() {
    return sendAuthRequest("logout", {
        method: "POST",
    });
}