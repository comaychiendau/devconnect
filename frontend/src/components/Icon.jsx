const paths = {
  alert: (
    <>
      <path d="M12 3.5 3.4 19a1 1 0 0 0 .88 1.5h15.44A1 1 0 0 0 20.6 19L12 3.5Z" />
      <path d="M12 9v4.5M12 17h.01" />
    </>
  ),
  arrowRight: <path d="M5 12h14m-5-5 5 5-5 5" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  chevronDown: <path d="m7 10 5 5 5-5" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  eyeOff: (
    <>
      <path d="m3 3 18 18M10.6 6.2A10 10 0 0 1 12 6c6.1 0 9.5 6 9.5 6a15 15 0 0 1-2.1 2.8M6.1 6.2C3.7 7.8 2.5 12 2.5 12s3.4 6 9.5 6a9.7 9.7 0 0 0 3-.5" />
      <path d="M10.5 10.5a2.5 2.5 0 0 0 3 3" />
    </>
  ),
  inbox: (
    <>
      <path d="M4 5h16l2 9v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5l2-9Z" />
      <path d="M2 14h5l2 3h6l2-3h5" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3 11v2a2 2 0 0 0 2 2h3l8 4V5L8 9H5a2 2 0 0 0-2 2Z" />
      <path d="m8 15 1.5 5h3L11 16.5M19 9a4 4 0 0 1 0 6" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  refresh: (
    <>
      <path d="M20 7v5h-5" />
      <path d="M19 12a7 7 0 1 0-2 5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  terminal: (
    <>
      <rect x="2.5" y="4" width="19" height="16" rx="3" />
      <path d="m7 9 3 3-3 3M12.5 15H17" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
}

function Icon({ name, size = 24, strokeWidth = 1.8, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      {paths[name]}
    </svg>
  )
}

export default Icon
