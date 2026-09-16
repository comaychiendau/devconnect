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
import { useCommunityMemberships } from '../hooks/useCommunityMemberships.js'

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

    // Public directory state
    const [communities, setCommunities] = useState([])
    const [directoryStatus, setDirectoryStatus] =
        useState('loading')
    const [directoryError, setDirectoryError] = useState('')
    const [requestVersion, setRequestVersion] = useState(0)

    // Leave-confirmation state
    const [
        communityPendingLeave,
        setCommunityPendingLeave,
    ] = useState(null)

    // Shared membership logic
    const {
        actionError: membershipError,
        clearActionError,
        isAuthLoading: isLoading,
        isJoined,
        join,
        joinedCommunities,
        joinedError,
        joinedStatus,
        leave,
        membershipStateReady,
        pendingCommunityId,
        retryJoinedCommunities,
        user,
    } = useCommunityMemberships()

    // Load all public communities.
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

    // Return a logged-out user to Discover.
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

    const handleRetry = () => {
        if (visibleActiveTab === 'joined') {
            retryJoinedCommunities()
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

        await join(community)
    }

    const handleLeave = async (community) => {
        await leave(community)
    }

    const handleLeaveRequest = (community) => {
        if (pendingCommunityId !== null) {
            return
        }

        clearActionError()
        setCommunityPendingLeave(community)
    }

    const handleCancelLeave = () => {
        setCommunityPendingLeave(null)
    }

    const handleConfirmLeave = async () => {
        if (!communityPendingLeave) {
            return
        }

        const community = communityPendingLeave

        setCommunityPendingLeave(null)

        await handleLeave(community)
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
                            onClick={clearActionError}
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
                                onClick={retryJoinedCommunities}
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
                                    isJoined={isJoined(community.id)}
                                    isUpdating={
                                        pendingCommunityId === community.id
                                    }
                                    key={community.id}
                                    onJoin={handleJoin}
                                    onLeave={handleLeaveRequest}
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

            {communityPendingLeave && (
                <div className="dialog-backdrop">
                    <section
                        aria-describedby="leave-community-description"
                        aria-labelledby="leave-community-title"
                        aria-modal="true"
                        className="dialog"
                        role="alertdialog"
                    >
                        <button
                            aria-label="Close leave confirmation"
                            className="icon-button dialog__close"
                            onClick={handleCancelLeave}
                            type="button"
                        >
                            <Icon name="close" size={20} />
                        </button>

                        <div className="dialog__icon dialog__icon--warning">
                            <Icon name="alert" size={26} />
                        </div>

                        <h2 id="leave-community-title">
                            Leave {communityPendingLeave.name}?
                        </h2>

                        <p id="leave-community-description">
                            This community will be removed from your Joined
                            tab. You can join it again later.
                        </p>

                        <div className="dialog__actions">
                            <button
                                className="button button--secondary"
                                onClick={handleCancelLeave}
                                type="button"
                            >
                                Cancel
                            </button>

                            <button
                                className="button button--danger"
                                onClick={handleConfirmLeave}
                                type="button"
                            >
                                Leave community
                            </button>
                        </div>
                    </section>
                </div>
            )}

            <AuthenticationPrompt
                action="view joined communities or join a new one"
                onClose={() => setShowPrompt(false)}
                open={showPrompt && !user}
            />
        </div>
    )
}

export default CommunitiesPage