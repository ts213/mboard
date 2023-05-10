import '../styles/Thread.css';
import { Link, useLoaderData, useRevalidator } from 'react-router-dom';
import { PostList } from '../parts/PostList.jsx';
import { PostFormsStateContainer } from '../posting/PostForm.jsx';
import { useEffect } from 'react';
import { api_prefix } from '../../App.jsx';

const DEFAULT_LOAD_LIMIT = 10;
let loadPostLimit = null;

export function Thread() {
  const { thread, repliesCount } = useLoaderData();
  const revalidator = useRevalidator();

  useEffect(() => {
    window.threadWasMounted = true;

    return () => {
      loadPostLimit = null;
    };
  }, []);

  const loadMoreProps = {
    repliesLoadedCount: thread.replies.length,
    repliesCount,
    loadMorePosts,
    revalidator,
  };

  return (
    <>
      <PostList
        threadList={[thread]}
        loadMoreProps={(repliesCount - thread.replies.length) > 0 // if not all posts loaded
          ? loadMoreProps
          : undefined}
      />
      <NavigationButtons />
      <PostFormsStateContainer />
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

export async function ThreadLoader({ request }) {
  let url = api_prefix + new URL(request.url).pathname;

  if (loadPostLimit) {
    url += `?limit=${loadPostLimit}`;
  }

  const r = await fetch(url);
  if (!r.ok) {
    throw new Response('loader error', { status: r.status });
  }
  return await r.json();
}

function NavigationButtons() {
  return (
    <div id='bottom'>
      <Link to='../../' relative='path'>[Return]</Link>
      <Link to=''
            onClick={(e) => {
              e.preventDefault();
              document.body.scrollIntoView();
            }}
      >
        [Top]
      </Link>
    </div>
  )
}
