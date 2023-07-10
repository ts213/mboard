import { Outlet, ScrollRestoration, useParams } from 'react-router-dom';
import { ThreadsContext } from '../../context/ThreadsContext.jsx';
import { PostHistoryContext } from '../../context/PostHistoryContext.jsx';
import { Breadcrumbs } from './Breadcrumbs.jsx';
import { PostFormReducer } from '../posting/PostFormReducer.jsx';

export function ThreadsContainer() {
  const { threadId } = useParams();
  return (
    <>
      <ScrollRestoration />
      <main className={threadId ? 'thread-route' : 'board-route'}>
        <Breadcrumbs />
        <ThreadsContext>
          <PostHistoryContext>
            <PostFormReducer>
              <Outlet />
            </PostFormReducer>
          </PostHistoryContext>
        </ThreadsContext>
      </main>
    </>
  );
}
