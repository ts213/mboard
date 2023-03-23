import { useEdiMenuContext, usePostDropdownContext } from '../../ContextProviders/GlobalContext.jsx';
import { memo, useEffect, useState } from 'react';
import { Post } from '../Post.jsx';

const PostMemo = memo(Post);

export function usePostList(results) {

  const dropdown = usePostDropdownContext();
  const postEditMenu = useEdiMenuContext();

  const [dateNow, setDate] = useState(new Date());
  useEffect(() => setDate(new Date()), [results]);

  const posts = results.map(thread =>
    <section key={thread.id} className='flex flex-col flex-wrap items-start'>
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
  );

  return (
    <div className='posts-wrap m-12'>
      {posts}
    </div>
  );
}
