import '../styles/Thread.css';
import { useLoaderData, useRevalidator } from 'react-router-dom';
import { PostList } from '../parts/PostList.jsx';
import { PostFormsStateContainer } from '../posting/PostForm.jsx';
import { createContext, useEffect } from 'react';
import { LoadMorePostsBtn } from '../parts/LoadMorePostsBtn.jsx';
import { ThreadNavigationButtons } from '../parts/ThreadNavigationButtons.jsx';
import { routeLoaderHandler } from '../../utils/fetchHandler.js';

let loadPostLimit = null;
export const IsThreadClosed = createContext(false);
const REPLIES_PER_PAGE = Number(import.meta.env.VITE_REPLIES_PER_PAGE);

export function Thread() {
  const { thread, repliesCount } = useLoaderData();
  const revalidator = useRevalidator();

  useEffect(() => {
    window.threadWasMounted = true;
    document.title = thread.text.slice(0, 50);
    return () => loadPostLimit = null;
  }, [thread.text]);

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
        (repliesCount - thread.replies.length) < (REPLIES_PER_PAGE * 1.5)
          ? loadPostLimit = repliesCount
          : loadPostLimit = thread.replies.length + REPLIES_PER_PAGE;
        return revalidator.revalidate();
      case 'loadAll':
        loadPostLimit = repliesCount;
        return revalidator.revalidate();
    }
  }
}

export async function ThreadLoader({ request }) {
  let url = '/api' + new URL(request.url).pathname;

  if (loadPostLimit) {
    url += `?limit=${loadPostLimit}`;
  }

  return await routeLoaderHandler(url);
}
