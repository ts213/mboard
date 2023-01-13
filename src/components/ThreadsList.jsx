import { useLoaderData } from 'react-router-dom';
import { Post } from './Post';
import React from 'react';

export function ThreadsList() {
  const threads = useLoaderData();

  const threadsList = threads.map(thread =>
    <React.Fragment key={thread.id}>
      <Post key={thread.id} thread={thread} isThreadsList={true} />

      {
        thread.replies.map(reply => {
            return <Post key={reply.id} thread={reply} isThreadsList={false} />
          }
        )
      }

    </React.Fragment>
  );

  return (
      <div className='post-list m-12 flex flex-col flex-wrap items-start'>
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

