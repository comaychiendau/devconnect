import { useEffect, useState } from 'react'
import {
    getCommunities,
    getJoinedCommunities,
    joinCommunity,
    leaveCommunity,
} from '../api/communities.js'
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
]

function CommunitiesPage() {
    const [activeTab, setActiveTab] = useState('discover')
    const [showPrompt, setShowPrompt] = useState(false)

    const [filters, setFilters] = useState({
        query: '',
    })

    // Public communities
    const [communities, setCommunities] = useState([])
    const [directoryStatus, setDirectoryStatus] =
        useState('loading')
    const [directoryError, setDirectoryError] = useState('')
    const [requestVersion, setRequestVersion] = useState(0)

    // Current user's memberships
    const [joinedCommunities, setJoinedCommunities] =
        useState([])
    const [joinedStatus, setJoinedStatus] =
        useState('loading')
    const [joinedError, setJoinedError] = useState('')
    const [joinedRequestVersion, setJoinedRequestVersion] =
        useState(0)

    // Join/leave request state
    const [pendingCommunityId, setPendingCommunityId] =
        useState(null)
    const [membershipError, setMembershipError] =
        useState('')

    const { user, isLoading } = useAuth()

    // Load the public community directory.
    useEffect(() => {
        let active = true

        async function loadCommunities() {
            try {
                const result = await getCommunities()

                if (!active) {
                    return
                }

                setCommunities(result)
                setDirectoryError('')
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

    // Load the signed-in user's real memberships.
    useEffect(() => {
        if (isLoading || !user) {
            return undefined
        }

        let active = true

        async function loadJoinedCommunities() {
            try {
                const result = await getJoinedCommunities()

                if (!active) {
                    return
                }

                setJoinedCommunities(result)
                setJoinedError('')
                setJoinedStatus(
                    result.length === 0 ? 'empty' : 'success',
                )
            } catch (error) {
                if (!active) {
                    return
                }

                setJoinedCommunities([])
                setJoinedError(
                    error instanceof Error
                        ? error.message
                        : 'Your joined communities could not be loaded.',
                )
                setJoinedStatus('error')
            }
        }

        loadJoinedCommunities()

        return () => {
            active = false
        }
    }, [isLoading, user, joinedRequestVersion])

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
    // show the public Discover tab.
    const visibleActiveTab =
        !user && activeTab === 'joined'
            ? 'discover'
            : activeTab

    const sourceCommunities =
        visibleActiveTab === 'joined'
            ? joinedCommunities
            : communities

    const sourceStatus =
        visibleActiveTab === 'joined'
            ? joinedStatus
            : directoryStatus

    const visibleError =
        visibleActiveTab === 'joined'
            ? joinedError
            : directoryError

    const normalizedQuery = filters.query
        .trim()
        .toLowerCase()

    const filteredCommunities = sourceCommunities.filter(
        (community) => {
            if (!normalizedQuery) {
                return true
            }

            const name =
                community.name?.toLowerCase() ?? ''

            const description =
                community.description?.toLowerCase() ?? ''

            return (
                name.includes(normalizedQuery) ||
                description.includes(normalizedQuery)
            )
        },
    )

    const visibleStatus =
        sourceStatus === 'success' &&
            filteredCommunities.length === 0
            ? 'empty'
            : sourceStatus

    const visibleResultCount = filteredCommunities.length

    // This Set makes membership checks simple and quick.
    const joinedCommunityIds = new Set(
        joinedCommunities.map((community) => community.id),
    )

    const membershipStateReady =
        !user ||
        joinedStatus === 'success' ||
        joinedStatus === 'empty'

    const handleTabChange = (tab) => {
        if (tab.id === 'joined' && !user) {
            if (!isLoading) {
                setShowPrompt(true)
            }

            return
        }

        setActiveTab(tab.id)
    }

    const handleDirectoryRetry = () => {
        setDirectoryError('')
        setDirectoryStatus('loading')
        setRequestVersion((current) => current + 1)
    }

    const handleJoinedRetry = () => {
        setJoinedError('')
        setJoinedStatus('loading')
        setJoinedRequestVersion((current) => current + 1)
    }

    const handleRetry = () => {
        if (visibleActiveTab === 'joined') {
            handleJoinedRetry()
            return
        }

        handleDirectoryRetry()
    }

    const handleJoin = async (community) => {
        if (isLoading) {
            return
        }

        if (!user) {
            setShowPrompt(true)
            return
        }

        if (pendingCommunityId !== null) {
            return
        }

        setPendingCommunityId(community.id)
        setMembershipError('')

        try {
            // Wait for the server before changing local state.
            await joinCommunity(community.id)

            setJoinedCommunities((current) => {
                const alreadyJoined = current.some(
                    (joinedCommunity) =>
                        joinedCommunity.id === community.id,
                )

                if (alreadyJoined) {
                    return current
                }

                return [...current, community].sort((left, right) =>
                    left.name.localeCompare(right.name),
                )
            })

            setJoinedStatus('success')
        } catch (error) {
            setMembershipError(
                error instanceof Error
                    ? error.message
                    : 'The community could not be joined. Please try again.',
            )
        } finally {
            setPendingCommunityId(null)
        }
    }

    const handleLeave = async (community) => {
        if (!user || pendingCommunityId !== null) {
            return
        }

        setPendingCommunityId(community.id)
        setMembershipError('')

        try {
            // Wait for the server before changing local state.
            await leaveCommunity(community.id)

            const remainingCommunities =
                joinedCommunities.filter(
                    (joinedCommunity) =>
                        joinedCommunity.id !== community.id,
                )

            setJoinedCommunities(remainingCommunities)
            setJoinedStatus(
                remainingCommunities.length === 0
                    ? 'empty'
                    : 'success',
            )
        } catch (error) {
            setMembershipError(
                error instanceof Error
                    ? error.message
                    : 'The community could not be left. Please try again.',
            )
        } finally {
            setPendingCommunityId(null)
        }
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

    const emptyTitle = filters.query
        ? 'No matching communities'
        : visibleActiveTab === 'joined'
            ? 'No joined communities'
            : 'No communities available'

    const emptyMessage = filters.query
        ? 'No communities match your current search. Try a different term.'
        : visibleActiveTab === 'joined'
            ? 'Communities you join will appear here.'
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
                                setFilters({
                                    query: event.target.value,
                                })
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

                {membershipError && (
                    <div className="form-notice" role="alert">
                        <Icon name="alert" size={18} />

                        <span>{membershipError}</span>

                        <button
                            className="button button--ghost button--small"
                            onClick={() => setMembershipError('')}
                            type="button"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {user &&
                    joinedStatus === 'error' &&
                    visibleActiveTab !== 'joined' && (
                        <div className="form-notice" role="alert">
                            <Icon name="alert" size={18} />

                            <span>{joinedError}</span>

                            <button
                                className="button button--secondary button--small"
                                onClick={handleJoinedRetry}
                                type="button"
                            >
                                Retry memberships
                            </button>
                        </div>
                    )}

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

                        <span>
                            {visibleActiveTab === 'joined'
                                ? 'Your memberships'
                                : 'Public directory'}
                        </span>
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
                                    filters.query ? (
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
                                    visibleError ||
                                    'The communities could not be loaded.'
                                }
                                onRetry={handleRetry}
                            />
                        }
                    >
                        <div className="community-grid">
                            {filteredCommunities.map((community) => (
                                <CommunityCard
                                    community={community}
                                    isActionDisabled={
                                        isLoading ||
                                        !membershipStateReady ||
                                        pendingCommunityId !== null
                                    }
                                    isJoined={joinedCommunityIds.has(
                                        community.id,
                                    )}
                                    isUpdating={
                                        pendingCommunityId === community.id
                                    }
                                    key={community.id}
                                    onJoin={handleJoin}
                                    onLeave={handleLeave}
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
                                ? 'Use a Join button above'
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