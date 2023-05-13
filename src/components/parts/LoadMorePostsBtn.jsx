export function LoadMorePostsBtn({ repliesLoaded, repliesCount, loadMoreReplies, revalidator }) {
  return (
    <div
      className='load-more-wrap'
    >
      Posts loaded:
      <span style={{ marginLeft: '0.25rem' }}>
        {repliesLoaded}/{repliesCount}
      </span>

      <button
        hidden={revalidator.state !== 'idle'}
        name='loadMore'
        onClick={loadMoreReplies}
      >
        [Load More]
      </button>

      <button
        hidden={revalidator.state !== 'idle'}
        name='loadAll'
        onClick={loadMoreReplies}
      >
        [All]
      </button>

      <button hidden={revalidator.state === 'idle'}>
        Loading...
      </button>
    </div>
  )
}
