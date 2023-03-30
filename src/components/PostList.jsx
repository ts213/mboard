import { useEdiMenuContext, usePostDropdownContext } from '../ContextProviders/GlobalContext.jsx';
import { memo, useEffect, useState } from 'react';
import { Post } from './Post.jsx';

const PostMemo = memo(Post);

export function PostList({ thread, loadMoreProps = undefined }) {
  const dropdown = usePostDropdownContext();
  const postEditMenu = useEdiMenuContext();

  const [dateNow, setDate] = useState(new Date());
  useEffect(() => setDate(new Date()), [thread]);

  return (
    <div className='m-12'>
      {thread.map(thread =>
        <section
          key={thread.id}
          className='flex flex-col flex-wrap items-start'>
          {loadMoreProps && <LoadMorePostsBtn {...loadMoreProps} />}
          <PostMemo
            post={thread}
            dateNow={dateNow}
            isEditMenu={postEditMenu === thread.id}
            isDropdown={dropdown === thread.id}
          />

          {thread.replies.map(reply =>
            <PostMemo
              key={reply.id}
              post={reply}
              dateNow={dateNow}
              isEditMenu={postEditMenu === reply.id}
              isDropdown={dropdown === reply.id}
            />
          )}
        </section>
      )}
    </div>
  );
}

function LoadMorePostsBtn(props) {
  const { repliesLoadedCount, repliesCount, loadMorePosts } = props;
  return (
    <div
      className='w-[100%] py-2 ml-2 text-center border-2 border-slate-800 text-white font-thin'
    >
      Posts loaded:
      <span className='ml-1'>{repliesLoadedCount}/{repliesCount}</span>
      <button name='loadMore' onClick={loadMorePosts}
              className='ml-2 p-1 bg-slate-800'>
        [Load More]
      </button>
      <button name='loadAll' onClick={loadMorePosts}
              className='ml-2 p-1 bg-slate-800'>
        [All]
      </button>
    </div>
  )
}
