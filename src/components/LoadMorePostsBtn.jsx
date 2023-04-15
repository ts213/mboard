export function LoadMorePostsBtn(props) {
  const { repliesLoadedCount, repliesCount, loadMorePosts, revalidator } = props;
  return (
    <div
      className='load-more-wrap'
    >
      Posts loaded:
      <span style={{marginLeft: '0.25rem' }}>
        {repliesLoadedCount}/{repliesCount}
      </span>

      <button
        hidden={revalidator.state !== 'idle'}
        name='loadMore'
        onClick={loadMorePosts}
      >
        [Load More]
      </button>

      <button
        hidden={revalidator.state !== 'idle'}
        name='loadAll'
        onClick={loadMorePosts}
      >
        [All]
      </button>

      <button hidden={revalidator.state === 'idle'}>
        Loading...
      </button>
    </div>
  )
}
