import { useLoaderData } from 'react-router-dom';
import { PostForm } from './PostForm.jsx';
import { Post } from './Post';
import React from 'react';

export function Thread() {
  const threadsJson = useLoaderData();


  const posts = threadsJson.posts.map(thread =>
    <Post key={thread.id} thread={thread} isThreadsList={false}/>
  );
  return (
    <>
      <div className='post-list mt-12 flex flex-col flex-wrap items-start'>
        {posts}
      </div>
      <PostForm />
    </>
  )
}

export async function threadLoader({ params }) {
  // const r = await fetch(`${import.meta.env.VITE_API}/${params.board}/thread/${params.threadId}/`);
  const r = await fetch(`/api/${params.board}/thread/${params.threadId}/`);
  if (!r.ok) {
    throw new Response('threadLoader err', { status: r.status })
  }
  return r.json();
}


