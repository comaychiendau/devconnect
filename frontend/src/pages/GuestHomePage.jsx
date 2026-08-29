import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppHeader from '../components/AppHeader.jsx'
import AuthenticationPrompt from '../components/AuthenticationPrompt.jsx'
import {
  CompactSkeleton,
  EmptyState,
  ErrorState,
  PostCardSkeleton,
  ResourceState,
} from '../components/DataState.jsx'
import Icon from '../components/Icon.jsx'
import Tabs from '../components/Tabs.jsx'

const feedTabs = [
  { id: 'global', label: 'Global' },
  { id: 'trending', label: 'Trending' },
]

function GuestHomePage() {
  const [activeFeed, setActiveFeed] = useState('global')
  const [promptAction, setPromptAction] = useState('')

  return (
    <div className="page-shell">
      <AppHeader />
      <main className="home-layout">
        <aside className="home-sidebar home-sidebar--left" aria-label="Guest information">
          <section className="card join-card">
            <span className="eyebrow">For developers, by developers</span>
            <h1>Join the community</h1>
            <p>Exchange practical knowledge, follow technical discussions, and connect around the tools you use.</p>
            <div className="join-card__actions">
              <Link className="button button--primary" to="/signup">
                Create account
                <Icon name="arrowRight" size={18} />
              </Link>
              <Link className="button button--secondary" to="/login">
                Log in
              </Link>
            </div>
          </section>

          <section className="card sidebar-card" aria-labelledby="community-discovery-title">
            <div className="section-heading section-heading--compact">
              <span className="section-heading__icon">
                <Icon name="compass" size={19} />
              </span>
              <h2 id="community-discovery-title">Community discovery</h2>
            </div>
            <ResourceState
              status="empty"
              loading={<CompactSkeleton />}
              empty={
                <EmptyState
                  icon="users"
                  title="No recommendations yet"
                  message="Community recommendations will appear here when available."
                  action={
                    <Link className="text-link" to="/communities">
                      Browse directory <Icon name="arrowRight" size={15} />
                    </Link>
                  }
                />
              }
              error={<ErrorState message="Community recommendations could not be loaded." />}
            />
          </section>
        </aside>

        <section className="feed-column" aria-labelledby="public-feed-title">
          <div className="feed-intro">
            <div>
              <span className="eyebrow">Public discussions</span>
              <h2 id="public-feed-title">Explore the latest knowledge</h2>
            </div>
            <button className="button button--soft feed-join-button" type="button" onClick={() => setPromptAction('join a discussion')}>
              Join a discussion
            </button>
          </div>
          <Tabs tabs={feedTabs} activeTab={activeFeed} onChange={(tab) => setActiveFeed(tab.id)} label="Public feed" />
          <div aria-labelledby={`${activeFeed}-tab`} className="feed-list" role="tabpanel">
            <ResourceState
              status="loading"
              loading={
                <>
                  <PostCardSkeleton />
                  <PostCardSkeleton media />
                </>
              }
              empty={
                <EmptyState
                  title="No public posts available"
                  message="Public discussions will appear here when they are published."
                />
              }
              error={<ErrorState message="The public feed could not be loaded." />}
            />
          </div>
        </section>

        <aside className="home-sidebar home-sidebar--right" aria-label="Community updates">
          <section className="card sidebar-card" aria-labelledby="announcements-title">
            <div className="section-heading section-heading--compact">
              <span className="section-heading__icon">
                <Icon name="megaphone" size={19} />
              </span>
              <h2 id="announcements-title">Announcements</h2>
            </div>
            <ResourceState
              status="empty"
              loading={<CompactSkeleton />}
              empty={
                <EmptyState
                  title="No announcements"
                  message="Public announcements will appear here when available."
                />
              }
              error={<ErrorState message="Announcements could not be loaded." />}
            />
          </section>

          <section className="card sidebar-card" aria-labelledby="events-title">
            <div className="section-heading section-heading--compact">
              <span className="section-heading__icon">
                <Icon name="calendar" size={19} />
              </span>
              <h2 id="events-title">Upcoming events</h2>
            </div>
            <ResourceState
              status="empty"
              loading={<CompactSkeleton />}
              empty={
                <EmptyState
                  icon="calendar"
                  title="No upcoming events"
                  message="Public events will appear here when scheduled."
                />
              }
              error={<ErrorState message="Upcoming events could not be loaded." />}
            />
          </section>

          <section className="member-benefit">
            <span className="member-benefit__icon" aria-hidden="true">
              <Icon name="users" size={20} />
            </span>
            <div>
              <h2>Make DevConnect yours</h2>
              <p>Sign in to follow discussions, save resources, and join communities.</p>
            </div>
          </section>
        </aside>
      </main>
      <AuthenticationPrompt
        action={promptAction || 'continue'}
        onClose={() => setPromptAction('')}
        open={Boolean(promptAction)}
      />
    </div>
  )
}

export default GuestHomePage
