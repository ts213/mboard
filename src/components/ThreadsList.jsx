import { useLoaderData } from 'react-router-dom';
import { Post } from './Post';
import React from 'react';
import { Thread } from './Thread.jsx';

export function ThreadsList() {
  const threads = useLoaderData();

  const threadsList = threads.map(thread =>
    <React.Fragment key={thread.id}>
      <section className='thread flex flex-col flex-wrap items-start'>
      <Post key={thread.id} thread={thread} isThreadsList={true} />

      {
        thread.replies.map(reply => {
            return <Post key={reply.id} thread={reply} isThreadsList={false} />
          }
        )
      }
      </section>
    </React.Fragment>
  );

  return (
      <div className='post-list m-12'>
        {threadsList}
      </div>
  )
}

export async function dataLoader({ params }) {
  // const r = await fetch(`${import.meta.env.VITE_API}/${params.board}/`);
  const r = await fetch(`/api/${params.board}/`);
  if (!r.ok) {
    // throw Error(`fetch thread list !!! error ${r.statusText}`);
    throw new Response('loader error', { status: r.status })
  }
  return await r.json();
}

