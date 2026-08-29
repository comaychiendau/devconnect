import { useState } from 'react'
import AppHeader from '../components/AppHeader.jsx'
import AuthenticationPrompt from '../components/AuthenticationPrompt.jsx'
import {
  CommunityCardSkeleton,
  EmptyState,
  ErrorState,
  ResourceState,
} from '../components/DataState.jsx'
import Icon from '../components/Icon.jsx'
import Tabs from '../components/Tabs.jsx'

const directoryTabs = [
  { id: 'joined', label: 'Joined', badge: 'Sign in' },
  { id: 'discover', label: 'Discover' },
  { id: 'trending', label: 'Trending' },
]

function CommunitiesPage() {
  const [activeTab, setActiveTab] = useState('discover')
  const [showPrompt, setShowPrompt] = useState(false)
  const [filters, setFilters] = useState({ query: '', sort: 'activity' })

  const handleTabChange = (tab) => {
    if (tab.id === 'joined') {
      setShowPrompt(true)
      return
    }
    setActiveTab(tab.id)
  }

  const clearFilters = () => setFilters({ query: '', sort: 'activity' })

  return (
    <div className="page-shell">
      <AppHeader />
      <main className="directory-page">
        <header className="directory-hero">
          <span className="eyebrow">Find your technical space</span>
          <h1>Communities directory</h1>
          <p>Discover public technology groups and the conversations happening within them.</p>
        </header>

        <form className="filter-bar" onSubmit={(event) => event.preventDefault()} role="search">
          <label className="filter-search" htmlFor="community-search">
            <span className="sr-only">Search communities</span>
            <Icon name="search" size={20} />
            <input
              id="community-search"
              onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
              placeholder="Search communities"
              type="search"
              value={filters.query}
            />
          </label>
          <label className="select-field">
            <span className="sr-only">Sort communities</span>
            <select
              onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
              value={filters.sort}
            >
              <option value="activity">Sort by activity</option>
              <option value="newest">Sort by newest</option>
              <option value="members">Sort by members</option>
            </select>
            <Icon name="chevronDown" size={18} />
          </label>
        </form>

        <Tabs tabs={directoryTabs} activeTab={activeTab} onChange={handleTabChange} label="Community directory views" />

        <section aria-labelledby={`${activeTab}-tab`} className="directory-results" role="tabpanel">
          <div className="results-meta">
            <p aria-live="polite">Community results</p>
            <span>Public directory</span>
          </div>
          <ResourceState
            status="empty"
            loading={
              <div className="community-grid">
                <CommunityCardSkeleton />
                <CommunityCardSkeleton />
                <CommunityCardSkeleton />
              </div>
            }
            empty={
              <EmptyState
                icon="compass"
                title="No communities available"
                message={
                  filters.query
                    ? 'No communities match your current search. Try a different term.'
                    : 'Public communities will appear here when the directory is connected.'
                }
                action={
                  filters.query ? (
                    <button className="button button--secondary button--small" onClick={clearFilters} type="button">
                      Clear search
                    </button>
                  ) : undefined
                }
              />
            }
            error={<ErrorState message="The communities directory could not be loaded." onRetry={clearFilters} />}
          />
        </section>

        <section className="directory-cta">
          <div>
            <span className="eyebrow">Want to participate?</span>
            <h2>Join communities that match your interests</h2>
            <p>Membership unlocks joining, following, and community discussion tools.</p>
          </div>
          <button className="button button--primary" onClick={() => setShowPrompt(true)} type="button">
            Join a community
            <Icon name="arrowRight" size={18} />
          </button>
        </section>
      </main>
      <AuthenticationPrompt
        action="view joined communities or join a new one"
        onClose={() => setShowPrompt(false)}
        open={showPrompt}
      />
    </div>
  )
}

export default CommunitiesPage
