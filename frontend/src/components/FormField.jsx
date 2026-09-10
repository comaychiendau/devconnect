import Icon from './Icon.jsx'

function FormField({
  id,
  label,
  icon,
  error,
  help,
  endAction,
  className = '',
  ...inputProps
}) {
  const describedBy = error ? `${id}-error` : help ? `${id}-help` : undefined

  return (
    <div className={`form-field${error ? ' form-field--error' : ''}${className ? ` ${className}` : ''}`}>
      <label htmlFor={id}>{label}</label>
      <div className="input-shell">
        {icon && (
          <span className="input-shell__icon" aria-hidden="true">
            <Icon name={icon} size={19} />
          </span>
        )}
        <input
          {...inputProps}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          className={icon ? 'input-with-icon' : ''}
          id={id}
        />
        {endAction && <span className="input-shell__action">{endAction}</span>}
      </div>
      {help && !error && (
        <p className="field-help" id={`${id}-help`}>
          {help}
        </p>
      )}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField
