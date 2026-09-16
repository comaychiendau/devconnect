import { useEffect, useState } from 'react'
import {
    Link,
    useParams,
} from 'react-router-dom'
import { getCommunity } from '../api/communities.js'
import AppHeader from '../components/AppHeader.jsx'
import AuthenticationPrompt from '../components/AuthenticationPrompt.jsx'
import { CommunityMembershipButton } from '../components/CommunityCard.jsx'
import {
    CommunityCardSkeleton,
    EmptyState,
    ErrorState,
    ResourceState,
} from '../components/DataState.jsx'
import Icon from '../components/Icon.jsx'
import { useCommunityMemberships } from '../hooks/useCommunityMemberships.js'

function CommunityDetailPage() {
    const { id } = useParams()

    const [community, setCommunity] = useState(null)
    const [status, setStatus] = useState('loading')
    const [errorMessage, setErrorMessage] = useState('')
    const [requestVersion, setRequestVersion] = useState(0)
    const [showPrompt, setShowPrompt] = useState(false)

    const [
        communityPendingLeave,
        setCommunityPendingLeave,
    ] = useState(null)

    const {
        actionError,
        clearActionError,
        isAuthLoading,
        isJoined,
        join,
        joinedError,
        joinedStatus,
        leave,
        membershipStateReady,
        pendingCommunityId,
        retryJoinedCommunities,
        user,
    } = useCommunityMemberships()

    useEffect(() => {
        let active = true

        async function loadCommunity() {
            try {
                const result = await getCommunity(id)

                if (!active) {
                    return
                }

                setCommunity(result)
                setErrorMessage('')
                setStatus('success')
            } catch (error) {
                if (!active) {
                    return
                }

                setCommunity(null)

                if (
                    error instanceof Error &&
                    error.status === 404
                ) {
                    setErrorMessage('Community not found.')
                    setStatus('not-found')
                    return
                }

                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : 'The community could not be loaded.',
                )
                setStatus('error')
            }
        }

        loadCommunity()

        return () => {
            active = false
        }
    }, [id, requestVersion])

    const handleRetry = () => {
        setErrorMessage('')
        setStatus('loading')
        setRequestVersion((current) => current + 1)
    }

    const handleJoin = async (selectedCommunity) => {
        if (isAuthLoading) {
            return
        }

        if (!user) {
            setShowPrompt(true)
            return
        }

        await join(selectedCommunity)
    }

    const handleLeaveRequest = (selectedCommunity) => {
        if (pendingCommunityId !== null) {
            return
        }

        clearActionError()
        setCommunityPendingLeave(selectedCommunity)
    }

    const handleCancelLeave = () => {
        setCommunityPendingLeave(null)
    }

    const handleConfirmLeave = async () => {
        if (!communityPendingLeave) {
            return
        }

        const selectedCommunity = communityPendingLeave

        setCommunityPendingLeave(null)

        await leave(selectedCommunity)
    }

    const resourceStatus =
        status === 'not-found' ? 'empty' : status

    return (
        <div className="page-shell">
            <AppHeader />

            <main className="community-detail-page">
                <Link
                    className="community-detail-back"
                    to="/communities"
                >
                    ← Back to communities
                </Link>

                {community && actionError && (
                    <div className="form-notice" role="alert">
                        <Icon name="alert" size={18} />

                        <span>{actionError}</span>

                        <button
                            className="button button--ghost button--small"
                            onClick={clearActionError}
                            type="button"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {community &&
                    user &&
                    joinedStatus === 'error' && (
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

                <ResourceState
                    status={resourceStatus}
                    loading={
                        <div className="community-grid">
                            <CommunityCardSkeleton />
                        </div>
                    }
                    empty={
                        <EmptyState
                            action={
                                <Link
                                    className="button button--secondary"
                                    to="/communities"
                                >
                                    Back to communities
                                </Link>
                            }
                            icon="compass"
                            message="The community may have been removed, or the address may be incorrect."
                            title="Community not found"
                        />
                    }
                    error={
                        <ErrorState
                            message={
                                errorMessage ||
                                'The community could not be loaded.'
                            }
                            onRetry={handleRetry}
                        />
                    }
                >
                    {community && (
                        <article className="card community-detail-card">
                            <span className="eyebrow">Community</span>

                            <h1>{community.name}</h1>

                            <p className="community-detail-description">
                                {community.description}
                            </p>

                            <div className="community-detail-actions">
                                <CommunityMembershipButton
                                    community={community}
                                    isActionDisabled={
                                        isAuthLoading ||
                                        !membershipStateReady ||
                                        pendingCommunityId !== null
                                    }
                                    isJoined={isJoined(community.id)}
                                    isUpdating={
                                        pendingCommunityId === community.id
                                    }
                                    onJoin={handleJoin}
                                    onLeave={handleLeaveRequest}
                                />
                            </div>
                        </article>
                    )}
                </ResourceState>
            </main>

            {communityPendingLeave && (
                <div className="dialog-backdrop">
                    <section
                        aria-describedby="detail-leave-description"
                        aria-labelledby="detail-leave-title"
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

                        <h2 id="detail-leave-title">
                            Leave {communityPendingLeave.name}?
                        </h2>

                        <p id="detail-leave-description">
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
                action="join this community"
                onClose={() => setShowPrompt(false)}
                open={showPrompt && !user}
            />
        </div>
    )
}

export default CommunityDetailPage