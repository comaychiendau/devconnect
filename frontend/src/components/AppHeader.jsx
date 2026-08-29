import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Brand from './Brand.jsx'
import Icon from './Icon.jsx'

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'Communities', to: '/communities' },
]

function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Brand compact />

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
              end={item.to === '/'}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
          <span className="nav-link nav-link--disabled" aria-disabled="true" title="Planned for a future milestone">
            Events
          </span>
          <span className="nav-link nav-link--disabled" aria-disabled="true" title="Planned for a future milestone">
            About
          </span>
        </nav>

        <div className="app-header__actions">
          <button className="header-search" type="button" disabled title="Search is planned for a future milestone">
            <Icon name="search" size={20} />
            <span>Search</span>
            <kbd>/</kbd>
          </button>
          <Link className="button button--ghost header-login" to="/login">
            Log in
          </Link>
          <Link className="button button--primary header-signup" to="/signup">
            Sign up
          </Link>
          <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="icon-button menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      <nav
        className={`mobile-nav${menuOpen ? ' mobile-nav--open' : ''}`}
        id="mobile-navigation"
        aria-label="Mobile navigation"
      >
        {navigation.map((item) => (
          <NavLink
            className={({ isActive }) => `mobile-nav__link${isActive ? ' mobile-nav__link--active' : ''}`}
            end={item.to === '/'}
            key={item.to}
            onClick={closeMenu}
            to={item.to}
          >
            {item.label}
          </NavLink>
        ))}
        <div className="mobile-nav__actions">
          <Link className="button button--secondary" onClick={closeMenu} to="/login">
            Log in
          </Link>
          <Link className="button button--primary" onClick={closeMenu} to="/signup">
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default AppHeader
