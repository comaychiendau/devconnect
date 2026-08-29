function Tabs({ tabs, activeTab, onChange, label }) {
  const handleKeyDown = (event, currentIndex) => {
    let nextIndex

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = tabs.length - 1
    else return

    event.preventDefault()
    const tabButtons = event.currentTarget.parentElement.querySelectorAll('[role="tab"]')
    tabButtons[nextIndex]?.focus()
    onChange(tabs[nextIndex])
  }

  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((tab, index) => (
        <button
          aria-selected={activeTab === tab.id}
          className={`tab${activeTab === tab.id ? ' tab--active' : ''}`}
          id={`${tab.id}-tab`}
          key={tab.id}
          onClick={() => onChange(tab)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          role="tab"
          tabIndex={activeTab === tab.id ? 0 : -1}
          type="button"
        >
          {tab.label}
          {tab.badge && <span className="tab__badge">{tab.badge}</span>}
        </button>
      ))}
    </div>
  )
}

export default Tabs
