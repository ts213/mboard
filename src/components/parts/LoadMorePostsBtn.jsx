import { useContext } from 'react';
import { TranslationContext } from './RoutesWrapper.jsx';

export function LoadMorePostsBtn({ repliesLoaded, repliesCount, loadMoreReplies, revalidator }) {
  const i18n = useContext(TranslationContext);

  return (
    <div
      className='load-more-wrap'
    >
      {i18n.postsLoaded}:
      <span style={{ marginLeft: '0.25rem' }}>
        {repliesLoaded}/{repliesCount}
      </span>

      <button
        hidden={revalidator.state !== 'idle'}
        name='loadMore'
        onClick={loadMoreReplies}
      >
        {i18n.loadMore}
      </button>

      <button
        hidden={revalidator.state !== 'idle'}
        name='loadAll'
        onClick={loadMoreReplies}
      >
        {i18n.loadAll}
      </button>

      <button hidden={revalidator.state === 'idle'}>
        {i18n.loading}
      </button>
    </div>
  )
}
