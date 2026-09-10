// JavaScript source code
async function sendAuthRequest(path, options = {}) {
    const response = await fetch(`/api/auth/${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw data ?? { message: "Authentication request failed." };
    }

    return data;
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