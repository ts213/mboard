import { Outlet, ScrollRestoration, useParams } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalContext.jsx';
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
        <GlobalContext>
          <PostHistoryContext>
            <PostFormReducer>
              <Outlet />
            </PostFormReducer>
          </PostHistoryContext>
        </GlobalContext>
      </main>
    </>
  );
}
