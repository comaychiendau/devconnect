import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

function AuthenticationPrompt({ open, onClose, action = 'continue' }) {
  const closeButtonRef = useRef(null)
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    previousFocusRef.current = document.activeElement
    closeButtonRef.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = dialogRef.current?.querySelectorAll('a[href], button:not(:disabled)')
      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (document.contains(previousFocusRef.current)) previousFocusRef.current.focus()
    }
  }, [onClose, open])

  if (!open) return null

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section
        aria-labelledby="auth-prompt-title"
        aria-modal="true"
        className="dialog"
        ref={dialogRef}
        role="dialog"
      >
        <button
          aria-label="Close sign-in prompt"
          className="icon-button dialog__close"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          <Icon name="close" size={20} />
        </button>
        <span className="dialog__icon" aria-hidden="true">
          <Icon name="lock" size={30} />
        </span>
        <h2 id="auth-prompt-title">Sign in required</h2>
        <p>Log in or create an account to {action}. Public browsing remains available without an account.</p>
        <div className="dialog__actions">
          <Link className="button button--primary" to="/login">
            Log in
          </Link>
          <Link className="button button--secondary" to="/signup">
            Create account
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AuthenticationPrompt
