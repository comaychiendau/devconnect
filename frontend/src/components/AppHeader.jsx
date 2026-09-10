import { useState } from 'react'
import {
    Link,
    NavLink,
    useNavigate,
} from 'react-router-dom'
import Brand from './Brand.jsx'
import Icon from './Icon.jsx'
import { useAuth } from '../context/useAuth.js'

const navigation = [
    { label: 'Home', to: '/' },
    { label: 'Communities', to: '/communities' },
]

function AppHeader() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [isLoggingOut, setIsLoggingOut] =
        useState(false)
    const [logoutError, setLogoutError] = useState('')

    const { user, isLoading, logout } = useAuth()
    const navigate = useNavigate()

    const closeMenu = () => setMenuOpen(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        setLogoutError('')

        try {
            await logout()
            closeMenu()
            navigate('/login', { replace: true })
        } catch {
            setLogoutError(
                'Unable to log out. Please try again.',
            )
        } finally {
            setIsLoggingOut(false)
        }
    }

    const userLabel =
        user?.fullName?.trim() ||
        user?.email ||
        'DevConnect user'

    return (
        <header className="app-header">
            <div className="app-header__inner">
                <Brand compact />

                <nav
                    className="desktop-nav"
                    aria-label="Primary navigation"
                >
                    {navigation.map((item) => (
                        <NavLink
                            className={({ isActive }) =>
                                `nav-link${isActive
                                    ? ' nav-link--active'
                                    : ''
                                }`
                            }
                            end={item.to === '/'}
                            key={item.to}
                            to={item.to}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="app-header__actions">
                    <button
                        aria-label="Search"
                        className="icon-button menu-search"
                        type="button"
                    >
                        <Icon name="search" size={21} />
                    </button>

                    {!isLoading && !user && (
                        <>
                            <Link
                                className="button button--ghost header-login"
                                to="/login"
                            >
                                Log in
                            </Link>

                            <Link
                                className="button button--primary header-signup"
                                to="/signup"
                            >
                                Sign up
                            </Link>
                        </>
                    )}

                    {!isLoading && user && (
                        <div className="header-user">
                            <span className="header-user__name">
                                {userLabel}
                            </span>

                            <button
                                className="button button--ghost"
                                disabled={isLoggingOut}
                                onClick={handleLogout}
                                type="button"
                            >
                                {isLoggingOut
                                    ? 'Logging out...'
                                    : 'Log out'}
                            </button>
                        </div>
                    )}

                    <button
                        aria-expanded={menuOpen}
                        aria-label={
                            menuOpen
                                ? 'Close navigation menu'
                                : 'Open navigation menu'
                        }
                        className="icon-button menu-toggle"
                        onClick={() =>
                            setMenuOpen((open) => !open)
                        }
                        type="button"
                    >
                        <Icon
                            name={menuOpen ? 'close' : 'menu'}
                            size={23}
                        />
                    </button>
                </div>
            </div>

            {logoutError && (
                <p
                    className="app-header__auth-error"
                    role="alert"
                >
                    {logoutError}
                </p>
            )}

            {menuOpen && (
                <nav
                    className="mobile-nav"
                    aria-label="Mobile navigation"
                >
                    {navigation.map((item) => (
                        <NavLink
                            className={({ isActive }) =>
                                `mobile-nav__link${isActive
                                    ? ' mobile-nav__link--active'
                                    : ''
                                }`
                            }
                            end={item.to === '/'}
                            key={item.to}
                            onClick={closeMenu}
                            to={item.to}
                        >
                            {item.label}
                        </NavLink>
                    ))}

                    {!isLoading && !user && (
                        <div className="mobile-nav__actions">
                            <Link
                                className="button button--ghost"
                                onClick={closeMenu}
                                to="/login"
                            >
                                Log in
                            </Link>

                            <Link
                                className="button button--primary"
                                onClick={closeMenu}
                                to="/signup"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}

                    {!isLoading && user && (
                        <div className="mobile-nav__actions">
                            <span className="mobile-nav__user">
                                Signed in as {userLabel}
                            </span>

                            <button
                                className="button button--ghost"
                                disabled={isLoggingOut}
                                onClick={handleLogout}
                                type="button"
                            >
                                {isLoggingOut
                                    ? 'Logging out...'
                                    : 'Log out'}
                            </button>
                        </div>
                    )}
                </nav>
            )}
        </header>
    )
}

export default AppHeader
