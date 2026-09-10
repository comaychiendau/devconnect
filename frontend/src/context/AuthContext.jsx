import {
    useEffect,
    useState,
} from 'react'
import {
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
} from '../api/auth.js'

import { AuthContext } from './useAuth.js'

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let active = true

        async function loadCurrentUser() {
            try {
                const currentUser = await getCurrentUser()

                if (active) {
                    setUser(currentUser)
                }
            } catch {
                if (active) {
                    setUser(null)
                }
            } finally {
                if (active) {
                    setIsLoading(false)
                }
            }
        }

        loadCurrentUser()

        return () => {
            active = false
        }
    }, [])

    const login = async (details) => {
        const currentUser = await loginUser(details)
        setUser(currentUser)
        return currentUser
    }

    const register = async (details) => {
        const currentUser = await registerUser(details)
        setUser(currentUser)
        return currentUser
    }

    const logout = async () => {
        await logoutUser()
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

