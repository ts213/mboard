import { useLoaderData, useParams, useRevalidator } from 'react-router-dom';
import { PostList } from '../PostList.jsx';
import { PostForm } from '../PostForm.jsx';
import { useEffect } from 'react';

const DEFAULT_LOAD_LIMIT = 10;
let loadPostLimit = null;

export function Thread() {
  const { threadId, board } = useParams();
  const { thread, repliesCount } = useLoaderData();
  const revalidator = useRevalidator();
  // useScrollToPost(thread.replies[0]?.id);

  useEffect(() => () => loadPostLimit = null, []);  // clean-up

  const loadMoreProps = {
    repliesLoadedCount: thread.replies.length,
    repliesCount: repliesCount,
    loadMorePosts,
  };

  return (
    <>
      <PostList
        threads={[thread]}
        loadMoreProps={(repliesCount - thread.replies.length) > 0 // if not all posts loaded
          ? loadMoreProps
          : undefined}
      />
      <PostForm threadId={threadId}
                board={board}
      />
    </>
  );

  async function loadMorePosts(ev) {
    switch (ev.target.name) {
      case 'loadMore':
        (repliesCount - thread.replies.length) < (DEFAULT_LOAD_LIMIT * 1.5)
          ? loadPostLimit = repliesCount
          : loadPostLimit = thread.replies.length + DEFAULT_LOAD_LIMIT;
        return revalidator.revalidate();
      case 'loadAll':
        loadPostLimit = repliesCount;
        return revalidator.revalidate();
    }
  }
}

export async function threadLoader(request) {
  let url = '/api' + new URL(request.url).pathname;

  if (loadPostLimit) {
    url += `?limit=${loadPostLimit}`;
  }

  const r = await fetch(url);
  if (!r.ok) {
    throw new Response('loader error', { status: r.status });
  }
  return await r.json();
}
