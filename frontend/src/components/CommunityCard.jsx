function CommunityCard({ community }) {
    return (
        <article className="card community-card">
            <h2 className="community-card__title">
                {community.name}
            </h2>
            <p className="community-card__description">
                {community.description}
            </p>
        </article>
    )
}

export default CommunityCard