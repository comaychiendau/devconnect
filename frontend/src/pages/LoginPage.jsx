import { useState } from 'react'
import {
    useLocation,
    useNavigate,
} from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import FormField from '../components/FormField.jsx'
import Icon from '../components/Icon.jsx'
import { useAuth } from '../context/useAuth.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginPage() {
    const [values, setValues] = useState({
        email: '',
        password: '',
        remember: false,
    })

    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [notice, setNotice] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const updateValue = (field, value) => {
        setValues((current) => ({
            ...current,
            [field]: value,
        }))

        setErrors((current) => ({
            ...current,
            [field]: undefined,
        }))

        setNotice('')
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const nextErrors = {}
        const email = values.email.trim()

        if (!email) {
            nextErrors.email = 'Enter your email address.'
        } else if (!emailPattern.test(email)) {
            nextErrors.email = 'Enter a valid email address.'
        }

        if (!values.password) {
            nextErrors.password = 'Enter your password.'
        }

        setErrors(nextErrors)

        if (Object.keys(nextErrors).length > 0) {
            return
        }

        setIsSubmitting(true)
        setNotice('')

        try {
            await login({
                email,
                password: values.password,
                rememberMe: values.remember,
            })

            const destination =
                location.state?.from?.pathname ?? '/communities'

            navigate(destination, { replace: true })
        } catch (error) {
            setNotice(
                error instanceof Error
                    ? error.message
                    : 'Unable to log in.',
            )
        } finally {
            setIsSubmitting(false)
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
            <form
                className="auth-form"
                noValidate
                onSubmit={handleSubmit}
            >
                <FormField
                    autoComplete="email"
                    error={errors.email}
                    icon="mail"
                    id="login-email"
                    label="Email address"
                    name="email"
                    onChange={(event) =>
                        updateValue('email', event.target.value)
                    }
                    placeholder="you@example.com"
                    required
                    type="email"
                    value={values.email}
                />

                <FormField
                    autoComplete="current-password"
                    endAction={
                        <button
                            aria-label={
                                showPassword
                                    ? 'Hide password'
                                    : 'Show password'
                            }
                            className="input-action-button"
                            onClick={() =>
                                setShowPassword((visible) => !visible)
                            }
                            type="button"
                        >
                            <Icon
                                name={showPassword ? 'eyeOff' : 'eye'}
                                size={19}
                            />
                        </button>
                    }
                    error={errors.password}
                    icon="lock"
                    id="login-password"
                    label="Password"
                    name="password"
                    onChange={(event) =>
                        updateValue('password', event.target.value)
                    }
                    placeholder="Enter your password"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                />

                <label className="checkbox-field">
                    <input
                        checked={values.remember}
                        onChange={(event) =>
                            updateValue('remember', event.target.checked)
                        }
                        type="checkbox"
                    />
                    Remember me
                </label>

                {notice && (
                    <p className="form-notice" role="alert">
                        <Icon name="alert" size={18} />
                        {notice}
                    </p>
                )}

                <button
                    className="button button--primary auth-submit"
                    disabled={isSubmitting}
                    type="submit"
                >
                    {isSubmitting ? 'Logging in...' : 'Log in'}
                    <Icon name="arrowRight" size={19} />
                </button>
            </form>
        </AuthLayout>
    )
}

export default LoginPage
