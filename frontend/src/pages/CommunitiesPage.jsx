import { useEffect, useState } from 'react'
import { getCommunities } from '../api/communities.js'
import AppHeader from '../components/AppHeader.jsx'
import AuthenticationPrompt from '../components/AuthenticationPrompt.jsx'
import CommunityCard from '../components/CommunityCard.jsx'
import {
    CommunityCardSkeleton,
    EmptyState,
    ErrorState,
    ResourceState,
} from '../components/DataState.jsx'
import Icon from '../components/Icon.jsx'
import Tabs from '../components/Tabs.jsx'
import { useAuth } from '../context/useAuth.js'

const baseDirectoryTabs = [
    { id: 'joined', label: 'Joined' },
    { id: 'discover', label: 'Discover' },
] //remove trending because the API does not have activity information so cant decide which communities are trending

function CommunitiesPage() {
    const [activeTab, setActiveTab] = useState('discover')
    const [showPrompt, setShowPrompt] = useState(false)

    const [filters, setFilters] = useState({
        query: '',
    })

    const [communities, setCommunities] = useState([])
    const [directoryStatus, setDirectoryStatus] =
        useState('loading')
    const [directoryError, setDirectoryError] = useState('')
    const [requestVersion, setRequestVersion] = useState(0)

    const { user, isLoading } = useAuth()

    useEffect(() => {
        let active = true

        async function loadCommunities() {
            try {
                const result = await getCommunities()

                if (!active) {
                    return
                }

                setCommunities(result)
                setDirectoryStatus(
                    result.length === 0 ? 'empty' : 'success',
                )
            } catch (error) {
                if (!active) {
                    return
                }

                setCommunities([])
                setDirectoryError(
                    error instanceof Error
                        ? error.message
                        : 'The communities directory could not be loaded.',
                )
                setDirectoryStatus('error')
            }
        }

        loadCommunities()

        return () => {
            active = false
        }
    }, [requestVersion])

    const tabs = baseDirectoryTabs.map((tab) => {
        if (
            tab.id === 'joined' &&
            !isLoading &&
            !user
        ) {
            return {
                ...tab,
                badge: 'Sign in',
            }
        }

        return tab
    })

    // If the user logs out while viewing Joined,
    // display the public Discover tab.
    const visibleActiveTab =
        !user && activeTab === 'joined'
            ? 'discover'
            : activeTab
    //filter the communities based on the active tab and search query
    // const visibleStatus =
    //     visibleActiveTab === 'joined'
    //         ? 'empty'
    //         : directoryStatus

    const normalizedQuery = filters.query.trim().toLowerCase()

    const filteredCommunities = communities.filter((community) => {
        if (!normalizedQuery) {
            return true
        }
        const name = community.name?.toLowerCase() ?? ''
        const description = community.description?.toLowerCase() ?? ''

        return (
            name.includes(normalizedQuery) ||
            description.includes(normalizedQuery)
        )
    },
    )

    const filteredDirectoryStatus = directoryStatus === 'success' && filteredCommunities.length === 0 ? 'empty' : directoryStatus

    const visibleStatus = visibleActiveTab === 'joined' ? 'empty' : filteredDirectoryStatus

    const visibleResultCount = visibleActiveTab === 'joined' ? 0 : filteredCommunities.length

    const handleTabChange = (tab) => {
        if (tab.id === 'joined' && !user) {
            if (!isLoading) {
                setShowPrompt(true)
            }

            return
        }

        setActiveTab(tab.id)
    }

    const handleRetry = () => {
        setDirectoryError('')
        setDirectoryStatus('loading')
        setRequestVersion((current) => current + 1)
    }

    const handleJoinClick = () => {
        if (!isLoading && !user) {
            setShowPrompt(true)
        }
    }

    const clearFilters = () => {
        setFilters({
            query: '',
        })
    }

    const emptyTitle =
        visibleActiveTab === 'joined'
            ? 'No joined communities'
            : 'No communities available'

    const emptyMessage =
        visibleActiveTab === 'joined'
            ? 'Communities you join will appear here.'
            : filters.query
                ? 'No communities match your current search. Try a different term.'
                : 'Public communities will appear here when they are added.'

    return (
        <div className="page-shell">
            <AppHeader />

            <main className="directory-page">
                <header className="directory-hero">
                    <span className="eyebrow">
                        Find your technical space
                    </span>

                    <h1>Communities directory</h1>

                    <p>
                        Discover public technology groups and the
                        conversations happening within them.
                    </p>
                </header>

                <form
                    className="filter-bar"
                    onSubmit={(event) => event.preventDefault()}
                    role="search"
                >
                    <label
                        className="filter-search"
                        htmlFor="community-search"
                    >
                        <span className="sr-only">
                            Search communities
                        </span>

                        <Icon name="search" size={20} />

                        <input
                            id="community-search"
                            onChange={(event) =>
                                setFilters((current) => ({
                                    ...current,
                                    query: event.target.value,
                                }))
                            }
                            placeholder="Search communities"
                            type="search"
                            value={filters.query}
                        />
                    </label>

                
                </form>

                <Tabs
                    activeTab={visibleActiveTab}
                    label="Community directory views"
                    onChange={handleTabChange}
                    tabs={tabs}
                />

                <section
                    aria-labelledby={`${visibleActiveTab}-tab`}
                    className="directory-results"
                    role="tabpanel"
                >
                    <div className="results-meta">
                        <p aria-live="polite">
                            {visibleResultCount}{' '}
                            {visibleResultCount === 1
                                ? 'community'
                                : 'communities'}
                        </p>
                        <span>Public directory</span>
                    </div>

                    <ResourceState
                        status={visibleStatus}
                        loading={
                            <div className="community-grid">
                                <CommunityCardSkeleton />
                                <CommunityCardSkeleton />
                                <CommunityCardSkeleton />
                            </div>
                        }
                        empty={
                            <EmptyState
                                action={
                                    filters.query &&
                                        visibleActiveTab !== 'joined' ? (
                                        <button
                                            className="button button--secondary button--small"
                                            onClick={clearFilters}
                                            type="button"
                                        >
                                            Clear search
                                        </button>
                                    ) : undefined
                                }
                                icon={
                                    visibleActiveTab === 'joined'
                                        ? 'users'
                                        : 'compass'
                                }
                                message={emptyMessage}
                                title={emptyTitle}
                            />
                        }
                        error={
                            <ErrorState
                                message={
                                    directoryError ||
                                    'The communities directory could not be loaded.'
                                }
                                onRetry={handleRetry}
                            />
                        }
                    >
                        <div className="community-grid">
                            {filteredCommunities.map((community) => (
                                <CommunityCard
                                    community={community}
                                    key={community.id}
                                />
                            ))}
                        </div>
                    </ResourceState>
                </section>

                <section className="directory-cta">
                    <div>
                        <span className="eyebrow">
                            Want to participate?
                        </span>

                        <h2>
                            Join communities that match your interests
                        </h2>

                        <p>
                            Membership unlocks joining, following, and
                            community discussion tools.
                        </p>
                    </div>

                    <button
                        className="button button--primary"
                        disabled={isLoading || Boolean(user)}
                        onClick={handleJoinClick}
                        type="button"
                    >
                        {isLoading
                            ? 'Checking session...'
                            : user
                                ? 'Joining coming next'
                                : 'Join a community'}

                        <Icon name="arrowRight" size={18} />
                    </button>
                </section>
            </main>

            <AuthenticationPrompt
                action="view joined communities or join a new one"
                onClose={() => setShowPrompt(false)}
                open={showPrompt && !user}
            />
        </div>
    )
}

export default CommunitiesPage