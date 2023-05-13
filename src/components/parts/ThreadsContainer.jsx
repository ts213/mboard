import { Outlet, ScrollRestoration } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalContext.jsx';
import { PostHistoryContext } from '../../context/PostHistoryContext.jsx';
import { Breadcrumbs } from './Breadcrumbs.jsx';
import { PostFormReducer } from '../posting/PostFormReducer.jsx';

export function ThreadsContainer() {

  return (
    <>
      <ScrollRestoration />
      <main>
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
