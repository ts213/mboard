import { useLoaderData } from 'react-router-dom';
import { PostForm } from '../PostForm.jsx';
import { Post } from '../Post.jsx';
import { memo, useEffect, useState } from 'react';
import { usePostDropdownContext, useEdiMenuContext } from '../../ContextProviders/GlobalContext.jsx';

const PostMemo = memo(Post);

export default function PostList() {
  const fetchedData = useLoaderData();

  const { results } = fetchedData;

  const dropdown = usePostDropdownContext();
  const postEditMenu = useEdiMenuContext();

  const [dateNow, setDate] = useState(new Date());
  useEffect(() => setDate(new Date()), [fetchedData]);

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
    <>
      <div className='posts-wrap m-12'>
        {posts}
      </div>
      <PostForm />
    </>
  );
}
