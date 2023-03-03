import { useLoaderData, useOutletContext } from 'react-router-dom';
import { PostForm } from './PostForm.jsx';
import { Post } from './Post';
import { PostsWrapper } from './PostsWrapper';
import React, { useMemo } from 'react';

export default function PostList() {
  const data = useLoaderData();
  console.info('post list jsx ');
  const { imageOnClickHandler } = useOutletContext();

  const posts = useMemo(() => {
    console.log('postsmemo');
    const dateNow = new Date();

    return data.threads.map(thread =>
      <React.Fragment key={thread.id}>
        <section className='flex flex-col flex-wrap items-start'>
          <Post
            post={thread}
            isThreadsList={true}
            dateNow={dateNow}
            imageOnClickHandler={imageOnClickHandler}
          />
          {thread.replies.map(reply =>
            <Post key={reply.id}
              post={reply}
              isThreadsList={false}
              dateNow={dateNow}
              imageOnClickHandler={imageOnClickHandler}
            />
          )}
        </section>
        <hr className='w-full border-t-gray-500' />
      </React.Fragment>
    );
  }, [imageOnClickHandler, data]);

  return (
    <>
      <PostsWrapper>
        {posts}
      </PostsWrapper>
      <PostForm />
    </>
  );
}
