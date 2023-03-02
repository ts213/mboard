import { useLoaderData, useOutletContext } from 'react-router-dom';
import { PostForm } from './PostForm.jsx';
import { Post } from './Post';
import { PostsWrapper } from './PostsWrapper';
import React from 'react';

export default function PostList() {
  const postsJson = useLoaderData();
  // const fetcher = useFetcher();
  // const dateNow = new Date();
  console.log('post list jsx ')
  const { imageOnClickHandler } = useOutletContext();

  // const posts = postsJson.posts.map(post =>
  //   <Post key={post.id}
  //     post={post}
  //     isThreadsList={false}
  //     // dateNow={dateNow}
  //     lovilka={imageOnClickHandler}
  //     // context={context}
  //   />
  // );
    const posts = postsJson.threads.map(thread =>
    <React.Fragment key={thread.id}>
      <section className='flex flex-col flex-wrap items-start'>
        <Post
          post={thread}
          isThreadsList={true}
          // dateNow={dateNow}
          // context={context}
          // menuId={menuId}
          // toggleDropdownMenu={toggleDropdownMenu}
          lovilka={imageOnClickHandler}
        />
        {thread.replies.map(reply =>
          <Post key={reply.id}
            post={reply}
            isThreadsList={false}
            // menuId={menuId}
            // toggleDropdownMenu={toggleDropdownMenu}
            // dateNow={dateNow}
            // context={context}
            lovilka={imageOnClickHandler}
          />
        )}
      </section>
      <hr className='w-full border-t-gray-500' />
    </React.Fragment>
  );

  return (
    <>
      {/*<fetcher.Form>*/}
        <PostsWrapper>
          {posts}
        </PostsWrapper>
      {/*</fetcher.Form>*/}
      <PostForm />
    </>
  );
}

