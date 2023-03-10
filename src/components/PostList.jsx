import { useLoaderData } from 'react-router-dom';
import { PostForm } from './PostForm.jsx';
import { Post } from './Post';
import { memo, useEffect, useState } from 'react';
import { useContextApi, usePostDropdown, useEdiMenutContext } from '../ContextProvider.jsx';

const PostMemo = memo(Post);

export default function PostList() {
  console.info('post list jsx ');
  const fetchedData = useLoaderData();
  const { threads } = fetchedData;

  const { onDropdownClick, onEditMenuClick } = useContextApi();
  const dropdown = usePostDropdown();
  const postEditMenu = useEdiMenutContext();

  const [dateNow, setDate] = useState(new Date());
  useEffect(() => setDate(new Date()), [fetchedData]);

  const posts = threads.map(thread =>
    <section key={thread.id} className='flex flex-col flex-wrap items-start'>
      <PostMemo
        post={thread}
        dateNow={dateNow}
        isEditMenu={postEditMenu === thread.id}
        onEditMenuClick={onEditMenuClick}
        isDropdown={dropdown === thread.id}
        onDropdownClick={onDropdownClick}
      />

      {thread.replies.map(reply =>
        <PostMemo
          key={reply.id}
          post={reply}
          dateNow={dateNow}
          isEditMenu={postEditMenu === reply.id}
          onEditMenuClick={onEditMenuClick}
          isDropdown={dropdown === reply.id}
          onDropdownClick={onDropdownClick}
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
