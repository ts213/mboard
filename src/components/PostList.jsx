import { useLoaderData, useOutletContext } from 'react-router-dom';
import { PostForm } from './PostForm.jsx';
import { Post } from './Post';
import { PostsWrapper } from './PostsWrapper';
import React, { memo, useMemo } from 'react';

const PostList = () => {
  const postsJson = useLoaderData();
// const dateNow = new Date();
  console.log('post list jsx ');
  const { imageOnClickHandler } = useOutletContext();

  const posts = useMemo(() => {
    return postsJson.threads.map(thread =>
      <React.Fragment key={thread.id}>
        <section className='flex flex-col flex-wrap items-start'>
          <Post
            post={thread}
            isThreadsList={true}
            // dateNow={dateNow}
            // context={context}
            // menuId={menuId}
            // toggleDropdownMenu={toggleDropdownMenu}
            imageOnClickHandler={imageOnClickHandler}
          />
          {thread.replies.map(reply =>
            <Post key={reply.id}
              post={reply}
              isThreadsList={false}
              // menuId={menuId}
              // toggleDropdownMenu={toggleDropdownMenu}
              // dateNow={dateNow}
              // context={context}
              imageOnClickHandler={imageOnClickHandler}
            />
          )}
        </section>
        <hr className='w-full border-t-gray-500' />
      </React.Fragment>
    );
  }, [imageOnClickHandler, postsJson]);

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
};

export default PostList;

