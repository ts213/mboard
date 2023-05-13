import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from 'react-router-dom';
import { ThreadsContainer } from './components/parts/ThreadsContainer.jsx';
import { newPostAction, deletePostAction, editPostAction } from './components/posting/formActions.js'
import { ErrorPage } from './components/pages/ErrorPage.jsx';
import { BoardAction, BoardList, BoardLoader } from './components/pages/BoardList.jsx';
import { ThreadList, ThreadListLoader } from './components/pages/ThreadList.jsx';
import { Thread, ThreadLoader } from './components/pages/Thread.jsx';
import { useCurrentRoute } from './hooks/useCurrentRoute.jsx';
import { setDocumentTitle } from './utils/utils.js';

let { VITE_API_PREFIX, VITE_REPLIES_LOAD_LIMIT } = import.meta.env;
VITE_REPLIES_LOAD_LIMIT = Number(VITE_REPLIES_LOAD_LIMIT);
export { VITE_API_PREFIX, VITE_REPLIES_LOAD_LIMIT };

export default function App() {
  return <RouterProvider router={router} />
}

function Title() {
  const route = useCurrentRoute();
  setDocumentTitle(route);
  return <Outlet />
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      ErrorBoundary={ErrorPage}
      Component={Title}
    >

      <Route path='/'
             id='boards'
             Component={BoardList}
             loader={BoardLoader}
             action={BoardAction}
             shouldRevalidate={() => false}
      />

      <Route Component={ThreadsContainer}>
        <Route path=':board/'
               id='board'
               action={newPostAction}
               Component={ThreadList}
               loader={ThreadListLoader}
               shouldRevalidate={() => false}
        />
        <Route path=':board/thread/:threadId/'
               id='thread'
               action={newPostAction}
               Component={Thread}
               loader={ThreadLoader}
               shouldRevalidate={({ actionResult }) => {
                 return actionResult ?
                   !Object.hasOwn(actionResult, 'errors')
                   : true;
               }}
        />
      </Route>

      <Route path='post/:postId/' action={({ request }) => {
        if (request.method === 'PATCH') return editPostAction(request);
        if (request.method === 'DELETE') return deletePostAction(request);
      }}
      />

    </Route>
  )
);
