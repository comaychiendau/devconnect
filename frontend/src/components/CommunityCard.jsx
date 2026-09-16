function CommunityCard({
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
        <article className="card community-card">
            <div className="community-card__content">
                <h2>{community.name}</h2>
                <p>{community.description}</p>
            </div>

            <div className="community-card__actions">
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
            </div>
        </article>
    )
}

export default CommunityCard