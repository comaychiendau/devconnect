import {
    Navigate,
    useLocation,
} from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function ProtectedRoute({ children }) {
    const { user, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return <p>Checking your session...</p>
    }

    if (!user) {
        return (
            <Navigate
                replace
                state={{ from: location }}
                to="/login"
            />
        )
    }

    return children
}

export default ProtectedRoute
