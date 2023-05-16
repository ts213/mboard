import '../styles/Thread.css';
import { useLoaderData, useRevalidator } from 'react-router-dom';
import { PostList } from '../parts/PostList.jsx';
import { PostFormsStateContainer } from '../posting/PostForm.jsx';
import { createContext, useEffect } from 'react';
import { VITE_API_PREFIX, VITE_REPLIES_LOAD_LIMIT } from '../../App.jsx';
import { LoadMorePostsBtn } from '../parts/LoadMorePostsBtn.jsx';
import { ThreadNavigationButtons } from '../parts/ThreadNavigationButtons.jsx';

let loadPostLimit = null;
export const IsThreadClosed = createContext(false);

export function Thread() {
  const { thread, repliesCount } = useLoaderData();
  const revalidator = useRevalidator();

  useEffect(() => {
    window.threadWasMounted = true;
    return () => loadPostLimit = null;
  }, []);

  return (
    <>
      {thread.closed &&
        <div style={{ textAlign: 'center', color: '#d03e3e', fontSize: 'larger', marginBottom: '3%' }}>
          Thread closed
        </div>
      }
      {(repliesCount - thread.replies.length) > 0 &&
        <LoadMorePostsBtn
          repliesLoaded={thread.replies.length}
          repliesCount={repliesCount}
          loadMoreReplies={loadMoreReplies}
          revalidator={revalidator}
        />
      }
      <IsThreadClosed.Provider value={thread.closed}>
        <PostList threadList={[thread]} />
      </IsThreadClosed.Provider>

      <ThreadNavigationButtons
        revalidator={revalidator}
        repliesCount={repliesCount}
      />
      {!thread.closed && <PostFormsStateContainer />}
    </>
  );

  async function loadMoreReplies(ev) {
    switch (ev.target.name) {
      case 'loadMore':
        (repliesCount - thread.replies.length) < (VITE_REPLIES_LOAD_LIMIT * 1.5)
          ? loadPostLimit = repliesCount
          : loadPostLimit = thread.replies.length + VITE_REPLIES_LOAD_LIMIT;
        return revalidator.revalidate();
      case 'loadAll':
        loadPostLimit = repliesCount;
        return revalidator.revalidate();
    }
  }
}

export async function ThreadLoader({ request }) {
  let url = VITE_API_PREFIX + new URL(request.url).pathname;

  if (loadPostLimit) {
    url += `?limit=${loadPostLimit}`;
  }

  const r = await fetch(url);
  if (!r.ok) {
    throw new Response('loader error', { status: r.status });
  }
  return await r.json();
}
