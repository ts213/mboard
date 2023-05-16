import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from 'react-router-dom';
import { ThreadsContainer } from './components/parts/ThreadsContainer.jsx';
import { newPostAction, deletePostAction, editPostAction } from './components/posting/formActions.js'
import { ErrorPage } from './components/routes/ErrorPage.jsx';
import { BoardAction, BoardList, BoardLoader } from './components/routes/BoardList.jsx';
import { ThreadList, ThreadListLoader } from './components/routes/ThreadList.jsx';
import { Thread, ThreadLoader } from './components/routes/Thread.jsx';
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
               action={({ request, params }) => {
                 if (request.method === 'POST') return newPostAction({ request, params });
                 else if (request.method === 'PATCH') return editPostAction(request);
                 else if (request.method === 'DELETE') return deletePostAction(request);
               }}
               Component={Thread}
               loader={ThreadLoader}
               shouldRevalidate={({ actionResult }) => {
                 return actionResult ?
                   !Object.hasOwn(actionResult, 'errors')
                   : true;
               }}
        />
      </Route>
    </Route>
  )
);
