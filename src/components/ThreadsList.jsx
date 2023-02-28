import { useLoaderData, useOutletContext } from 'react-router-dom';
import { Post } from './Post';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { PostsWrapper } from './PostsWrapper.jsx';
import { PostForm } from './PostForm.jsx';


export default function ThreadsList() {
  const data = useLoaderData();
  const dateNow = new Date();
  console.log('thread list jsx');

  // const { imgObj, setImageObj, test } = useContext(Context);
  const [test]  = useOutletContext();

  const posts = data.threads.map(thread =>
    <React.Fragment key={thread.id}>
      <section className='flex flex-col flex-wrap items-start '>
        <Post
          post={thread}
          isThreadsList={true}
          // dateNow={dateNow}
          // context={context}
          lovilka={test}
        />
        {thread.replies.map(reply =>
          <Post key={reply.id}
            post={reply}
            isThreadsList={false}
            // dateNow={dateNow}
            // context={context}
            lovilka={test}
          />
        )}
      </section>
      <hr className='w-full border-t-gray-500' />
    </React.Fragment>
  );

  return (
    <>
      <PostsWrapper>
        {posts}
        {/*{memo}*/}
      </PostsWrapper>
      <PostForm />
    </>
  )
}
