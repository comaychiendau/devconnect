import Icon from './Icon.jsx'

function LoadingLine({ width = '100%' }) {
  return <span className="skeleton skeleton--line" style={{ width }} />
}

export function PostCardSkeleton({ media = false }) {
  return (
    <article className="card post-skeleton" aria-label="Loading post" aria-busy="true">
      <div className="skeleton-row">
        <span className="skeleton skeleton--avatar" />
        <div className="skeleton-stack skeleton-stack--header">
          <LoadingLine width="34%" />
          <LoadingLine width="22%" />
        </div>
      </div>
      <LoadingLine width="72%" />
      <div className="skeleton-stack">
        <LoadingLine />
        <LoadingLine width="94%" />
        <LoadingLine width="68%" />
      </div>
      {media && <span className="skeleton skeleton--media" />}
      <div className="skeleton-tags">
        <span className="skeleton skeleton--chip" />
        <span className="skeleton skeleton--chip skeleton--chip-wide" />
      </div>
      <div className="skeleton-actions">
        <span className="skeleton skeleton--action" />
        <span className="skeleton skeleton--action" />
        <span className="skeleton skeleton--action" />
      </div>
    </article>
  )
}

export function CommunityCardSkeleton() {
  return (
    <article className="card community-skeleton" aria-label="Loading community" aria-busy="true">
      <div className="skeleton-row">
        <span className="skeleton skeleton--community-icon" />
        <div className="skeleton-stack skeleton-stack--header">
          <LoadingLine width="58%" />
          <LoadingLine width="34%" />
        </div>
      </div>
      <div className="skeleton-stack">
        <LoadingLine />
        <LoadingLine width="84%" />
      </div>
      <div className="skeleton-tags">
        <span className="skeleton skeleton--chip" />
        <span className="skeleton skeleton--chip" />
      </div>
    </article>
  )
}

export function CompactSkeleton() {
  return (
    <div className="compact-skeleton" aria-label="Loading content" aria-busy="true">
      <LoadingLine width="82%" />
      <LoadingLine width="56%" />
      <LoadingLine width="70%" />
    </div>
  )
}

export function EmptyState({ icon = 'inbox', title, message, action }) {
  return (
    <div className="empty-state" role="status">
      <span className="state-icon" aria-hidden="true">
        <Icon name={icon} size={28} />
      </span>
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  )
}

export function ErrorState({ title = 'Unable to load content', message, onRetry }) {
  return (
    <div className="empty-state empty-state--error" role="alert">
      <span className="state-icon" aria-hidden="true">
        <Icon name="alert" size={28} />
      </span>
      <h3>{title}</h3>
      <p>{message ?? 'Something went wrong while loading this section.'}</p>
      {onRetry && (
        <button className="button button--secondary button--small" type="button" onClick={onRetry}>
          <Icon name="refresh" size={17} />
          Try again
        </button>
      )}
    </div>
  )
}

export function ResourceState({ status, loading, empty, error, children }) {
  if (status === 'loading') return loading
  if (status === 'error') return error
  if (status === 'empty') return empty
  return children
}
