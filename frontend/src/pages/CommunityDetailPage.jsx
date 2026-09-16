import { useEffect, useState } from 'react'
import {
    Link,
    useParams,
} from 'react-router-dom'
import { getCommunity } from '../api/communities.js'
import AppHeader from '../components/AppHeader.jsx'
import {
    CommunityCardSkeleton,
    EmptyState,
    ErrorState,
    ResourceState,
} from '../components/DataState.jsx'

function CommunityDetailPage() {
    const { id } = useParams()

    const [community, setCommunity] = useState(null)
    const [status, setStatus] = useState('loading')
    const [errorMessage, setErrorMessage] = useState('')
    const [requestVersion, setRequestVersion] = useState(0)

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
                        </article>
                    )}
                </ResourceState>
            </main>
        </div>
    )
}

export default CommunityDetailPage