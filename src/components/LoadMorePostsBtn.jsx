export function LoadMorePostsBtn(props) {
  const { repliesLoadedCount, repliesCount, loadMorePosts } = props;
  return (
    <div
      className='w-[100%] py-2 ml-2 text-center border-2 border-slate-800 text-white font-thin'
    >
      Posts loaded:
      <span className='ml-1'>
        {repliesLoadedCount}/{repliesCount}
      </span>
      <button
        name='loadMore'
        onClick={loadMorePosts}
        className='ml-2 p-1 bg-slate-800'
      >
        [Load More]
      </button>
      <button
        name='loadAll'
        onClick={loadMorePosts}
        className='ml-2 p-1 bg-slate-800'
      >
        [All]
      </button>
    </div>
  )
}
