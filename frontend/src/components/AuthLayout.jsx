import { Link } from 'react-router-dom'
import Brand from './Brand.jsx'

function AuthLayout({ title, description, children, footerText, footerLinkLabel, footerLinkTo }) {
  return (
    <main className="auth-page">
      <Link className="auth-page__back" to="/">
        <span aria-hidden="true">←</span> Back to home
      </Link>
      <section className="auth-card" aria-labelledby="auth-title">
        <header className="auth-card__header">
          <Brand />
          <div>
            <h1 id="auth-title">{title}</h1>
            <p>{description}</p>
          </div>
        </header>
        <div className="auth-card__body">{children}</div>
        <footer className="auth-card__footer">
          <p>
            {footerText}{' '}
            <Link to={footerLinkTo}>{footerLinkLabel}</Link>
          </p>
        </footer>
      </section>
    </main>
  )
}

export default AuthLayout
