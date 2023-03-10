import { useLoaderData } from 'react-router-dom';
import { PostForm } from './PostForm.jsx';
import { Post } from './Post';
import { memo, useEffect, useState } from 'react';

const PostMemo = memo(Post);

export default function PostList() {
  console.info('post list jsx ');
  const fetchedData = useLoaderData();
  const { threads } = fetchedData;

  const [postEditMenu, setEditMenu] = useState(0);

  const [dateNow, setDate] = useState(new Date());
  useEffect(() => {
    setDate(new Date())
  }, [fetchedData]);

  const posts = threads.map(thread =>
    <section key={thread.id} className='flex flex-col flex-wrap items-start'>
      <PostMemo
        post={thread}
        dateNow={dateNow}
        isEditMenu={postEditMenu === thread.id}
        setEditMenu={setEditMenu}
      />

      {thread.replies.map(reply =>
        <PostMemo
          key={reply.id}
          post={reply}
          dateNow={dateNow}
          isEditMenu={postEditMenu === reply.id}
          setEditMenu={setEditMenu}
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
