import { useState } from 'react'
import AuthLayout from '../components/AuthLayout.jsx'
import FormField from '../components/FormField.jsx'
import Icon from '../components/Icon.jsx'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const usernamePattern = /^[a-zA-Z0-9_]+$/

function SignUpPage() {
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [passwordVisibility, setPasswordVisibility] = useState({ password: false, confirmPassword: false })
  const [notice, setNotice] = useState('')

  const updateValue = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setNotice('')
  }

  const toggleVisibility = (field) => {
    setPasswordVisibility((current) => ({ ...current, [field]: !current[field] }))
  }

  const passwordToggle = (field, label) => (
    <button
      aria-label={`${passwordVisibility[field] ? 'Hide' : 'Show'} ${label}`}
      className="input-action-button"
      onClick={() => toggleVisibility(field)}
      type="button"
    >
      <Icon name={passwordVisibility[field] ? 'eyeOff' : 'eye'} size={19} />
    </button>
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    const fullName = values.fullName.trim()
    const username = values.username.trim()

    if (!fullName) nextErrors.fullName = 'Enter your full name.'
    else if (fullName.length < 2) nextErrors.fullName = 'Name must be at least 2 characters.'

    if (!values.email.trim()) nextErrors.email = 'Enter your email address.'
    else if (!emailPattern.test(values.email)) nextErrors.email = 'Enter a valid email address.'

    if (!username) nextErrors.username = 'Choose a username.'
    else if (username.length < 3) nextErrors.username = 'Username must be at least 3 characters.'
    else if (!usernamePattern.test(username)) nextErrors.username = 'Use letters, numbers, and underscores only.'

    if (!values.password) nextErrors.password = 'Create a password.'
    else if (values.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'
    else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
      nextErrors.password = 'Include at least one letter and one number.'
    }

    if (!values.confirmPassword) nextErrors.confirmPassword = 'Confirm your password.'
    else if (values.confirmPassword !== values.password) nextErrors.confirmPassword = 'Passwords do not match.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      setNotice('Account creation is not connected yet. Your details have not been sent.')
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Join the community of developers and technology professionals."
      footerText="Already have an account?"
      footerLinkLabel="Log in"
      footerLinkTo="/login"
    >
      <form className="auth-form" noValidate onSubmit={handleSubmit}>
        <FormField
          autoComplete="name"
          error={errors.fullName}
          icon="user"
          id="signup-name"
          label="Full name"
          name="fullName"
          onChange={(event) => updateValue('fullName', event.target.value)}
          placeholder="Your name"
          required
          type="text"
          value={values.fullName}
        />
        <FormField
          autoComplete="email"
          error={errors.email}
          icon="mail"
          id="signup-email"
          label="Email address"
          name="email"
          onChange={(event) => updateValue('email', event.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={values.email}
        />
        <FormField
          autoCapitalize="none"
          autoComplete="username"
          error={errors.username}
          help="3 or more characters; letters, numbers, and underscores."
          id="signup-username"
          label="Username"
          name="username"
          onChange={(event) => updateValue('username', event.target.value)}
          placeholder="Choose a username"
          required
          type="text"
          value={values.username}
        />
        <FormField
          autoComplete="new-password"
          endAction={passwordToggle('password', 'password')}
          error={errors.password}
          help="Use at least 8 characters with a letter and a number."
          icon="lock"
          id="signup-password"
          label="Password"
          name="password"
          onChange={(event) => updateValue('password', event.target.value)}
          placeholder="Create a password"
          required
          type={passwordVisibility.password ? 'text' : 'password'}
          value={values.password}
        />
        <FormField
          autoComplete="new-password"
          endAction={passwordToggle('confirmPassword', 'password confirmation')}
          error={errors.confirmPassword}
          icon="lock"
          id="signup-confirm-password"
          label="Confirm password"
          name="confirmPassword"
          onChange={(event) => updateValue('confirmPassword', event.target.value)}
          placeholder="Repeat your password"
          required
          type={passwordVisibility.confirmPassword ? 'text' : 'password'}
          value={values.confirmPassword}
        />

        {notice && (
          <p className="form-notice" role="status">
            <Icon name="alert" size={18} />
            {notice}
          </p>
        )}

        <button className="button button--primary auth-submit" type="submit">
          Create account
          <Icon name="arrowRight" size={19} />
        </button>
        <p className="form-legal">By continuing, you acknowledge DevConnect’s future community guidelines and privacy terms.</p>
      </form>

      <div className="auth-divider">
        <span>or continue with</span>
      </div>
      <div className="social-buttons" aria-label="Social sign-up options are not yet connected">
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

export default SignUpPage
