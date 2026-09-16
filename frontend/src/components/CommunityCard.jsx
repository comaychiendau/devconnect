import { Link } from 'react-router-dom'

export function CommunityMembershipButton({
    community,
    isJoined = false,
    isUpdating = false,
    isActionDisabled = false,
    onJoin,
    onLeave,
}) {
    const handleMembershipAction = () => {
        if (isJoined) {
            onLeave?.(community)
            return
        }

        onJoin?.(community)
    }

    const actionLabel = isUpdating
        ? isJoined
            ? 'Leaving...'
            : 'Joining...'
        : isJoined
            ? 'Leave'
            : 'Join'

    return (
        <button
            aria-label={`${actionLabel} ${community.name}`}
            className={`button button--small ${isJoined
                    ? 'button--secondary'
                    : 'button--primary'
                }`}
            disabled={isUpdating || isActionDisabled}
            onClick={handleMembershipAction}
            type="button"
        >
            {actionLabel}
        </button>
    )
}

function CommunityCard({
    community,
    isJoined = false,
    isUpdating = false,
    isActionDisabled = false,
    onJoin,
    onLeave,
}) {
    return (
        <article className="card community-card">
            <Link
                aria-label={`View ${community.name} community`}
                className="community-card__content community-card__link"
                to={`/communities/${community.id}`}
            >
                <h2>{community.name}</h2>

                <p>{community.description}</p>

                <span className="community-card__view">
                    View community
                    <span aria-hidden="true">→</span>
                </span>
            </Link>

            <div className="community-card__actions">
                <CommunityMembershipButton
                    community={community}
                    isActionDisabled={isActionDisabled}
                    isJoined={isJoined}
                    isUpdating={isUpdating}
                    onJoin={onJoin}
                    onLeave={onLeave}
                />
            </div>
        </article>
    )
}

export default CommunityCard