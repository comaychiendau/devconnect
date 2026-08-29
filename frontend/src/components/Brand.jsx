import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

function Brand({ compact = false }) {
  return (
    <Link className={`brand${compact ? ' brand--compact' : ''}`} to="/" aria-label="DevConnect home">
      <span className="brand__mark" aria-hidden="true">
        <Icon name="terminal" size={compact ? 20 : 22} strokeWidth={2.2} />
      </span>
      <span>DevConnect</span>
    </Link>
  )
}

export default Brand
