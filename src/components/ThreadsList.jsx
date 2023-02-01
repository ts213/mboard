import { useLoaderData } from 'react-router-dom';
import { Post } from './Post';
import React from 'react';
import { PostsWrapper } from './PostsWrapper.jsx';
import { PostForm } from './PostForm.jsx';

export default function ThreadsList() {
  const data = useLoaderData();

  const posts = data.threads.map(thread =>
    <React.Fragment key={thread.id}>
      <section className={'flex flex-col flex-wrap items-start '}>
        <Post
          post={thread}
          isThreadsList={true}
        />
        {thread.replies.map(reply =>
          <Post
            key={reply.id}
            post={reply}
            isThreadsList={false}
          />
        )}
      </section>
      <hr className={'w-full border-t-gray-500'} />
    </React.Fragment>
  );

  return (
    <>
      <PostsWrapper>
        {posts}
      </PostsWrapper>
      <PostForm />
    </>
  )
}
