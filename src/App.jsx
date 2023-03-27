import { lazy, Suspense } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, defer, } from 'react-router-dom';
import { RootLayout } from './components/RootLayout.jsx';
import { createNewPostAction, editPostAction, deletePostAction } from './utils/formAction.js'
import { ErrorPage } from './components/routes/ErrorPage.jsx';
import { PostHistoryContext } from './ContextProviders/PostHistoryContext.jsx';
import { Thread } from './components/routes/Thread';

const BoardsList = lazy(() => import('./components/routes/BoardsList.jsx'));
const PostList = lazy(() => import('./components/routes/ThreadList.jsx'));
// const ErrorPage = lazy(() => import('./components/ErrorPage'));
// const formAction = lazy(() => import('./utils/formAction'));  // submit form not working with lazy

export default function App() {
  const router = createBrowserRouter(
      createRoutesFromElements(
        <Route
          path='/'
          element={
            <Suspense fallback={<h1>loading..</h1>}>
              <RootLayout />
            </Suspense>
          }
          errorElement={<ErrorPage />}
        >

          <Route index element={<HomePage />} />

          <Route path='boards'
                 loader={({ request, params }) => defer({ boards: routeLoader(request) })}
                 element={<BoardsList />}
                 shouldRevalidate={() => false}
          />

          <Route path=':board'
                 element={<PostList />}
          />


          <Route path=':board/thread/:threadId'
                 loader={({ request, params }) => routeLoader(request)}
                 action={createNewPostAction}
                 element={<Thread />}
          />

          <Route path='posting/' action={createNewPostAction} />
          <Route path='edit/' action={editPostAction} />
          <Route path='delete/:postId/' action={deletePostAction} />

        </Route>
      )
    )
  ;

  return (
    <PostHistoryContext>
      <RouterProvider router={router} />
    </PostHistoryContext>
  );
}

function HomePage() {
  return (
    <div className={'text-center m-20'}>home page.....</div>
  )
}

export async function routeLoader(request) {
  let url = '/api' + new URL(request.url).pathname;
  const page = new URL(request.url).searchParams.get('page');
  page ? url += `?page=${page}` : '';
  const r = await fetch(url);
  if (!r.ok) {
    throw new Response('loader error', { status: r.status });
  }
  return r.json();
}
