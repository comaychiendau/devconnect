import { useState } from 'react'
import AuthLayout from '../components/AuthLayout.jsx'
import FormField from '../components/FormField.jsx'
import Icon from '../components/Icon.jsx'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginPage() {
  const [values, setValues] = useState({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')

  const updateValue = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setNotice('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!values.email.trim()) nextErrors.email = 'Enter your email address.'
    else if (!emailPattern.test(values.email)) nextErrors.email = 'Enter a valid email address.'

    if (!values.password) nextErrors.password = 'Enter your password.'
    else if (values.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      setNotice('Authentication is not connected yet. Your details have not been sent.')
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Log in to continue to your developer community."
      footerText="New to DevConnect?"
      footerLinkLabel="Create an account"
      footerLinkTo="/signup"
    >
      <form className="auth-form" noValidate onSubmit={handleSubmit}>
        <FormField
          autoComplete="email"
          error={errors.email}
          icon="mail"
          id="login-email"
          label="Email address"
          name="email"
          onChange={(event) => updateValue('email', event.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={values.email}
        />
        <FormField
          autoComplete="current-password"
          endAction={
            <button
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="input-action-button"
              onClick={() => setShowPassword((visible) => !visible)}
              type="button"
            >
              <Icon name={showPassword ? 'eyeOff' : 'eye'} size={19} />
            </button>
          }
          error={errors.password}
          icon="lock"
          id="login-password"
          label="Password"
          name="password"
          onChange={(event) => updateValue('password', event.target.value)}
          placeholder="Enter your password"
          required
          type={showPassword ? 'text' : 'password'}
          value={values.password}
        />

        <div className="form-options">
          <label className="checkbox-field">
            <input
              checked={values.remember}
              onChange={(event) => updateValue('remember', event.target.checked)}
              type="checkbox"
            />
            <span>Remember me</span>
          </label>
          <span className="muted-link" title="Planned for a future milestone">
            Forgot password?
          </span>
        </div>

        {notice && (
          <p className="form-notice" role="status">
            <Icon name="alert" size={18} />
            {notice}
          </p>
        )}

        <button className="button button--primary auth-submit" type="submit">
          Log in
          <Icon name="arrowRight" size={19} />
        </button>
      </form>

      <div className="auth-divider">
        <span>or continue with</span>
      </div>
      <div className="social-buttons" aria-label="Social login options are not yet connected">
        <button className="button button--social" disabled type="button">
          <span className="social-mark social-mark--github" aria-hidden="true">&lt;/&gt;</span>
          GitHub
          <span className="soon-label">Soon</span>
        </button>
        <button className="button button--social" disabled type="button">
          <span className="social-mark" aria-hidden="true">G</span>
          Google
          <span className="soon-label">Soon</span>
        </button>
      </div>
    </AuthLayout>
  )
}

export default LoginPage
