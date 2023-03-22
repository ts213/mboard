import { lazy, Suspense } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, defer, } from 'react-router-dom';
import { RootLayout } from './components/RootLayout.jsx';
import { createNewPostAction, editPostAction, deletePostAction } from './utils/formAction.js'
import { ErrorCpmnt } from './components/ErrorCpmnt.jsx';
import { PostHistoryContext } from './ContextProviders/PostHistoryContext.jsx';

const BoardsList = lazy(() => import('./components/routes/BoardsList.jsx'));
const PostList = lazy(() => import('./components/routes/PostList.jsx'));
// const ErrorCpmnt = lazy(() => import('./components/ErrorCpmnt'));
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
          errorElement={<ErrorCpmnt />}
        >

          <Route index element={<HomePage />} />

          <Route path='boards'
                 loader={({ request, params }) => defer({ boards: customFetch(request, params) })}
                 element={<BoardsList />}
          />

          <Route path=':board'
                 loader={({ request, params }) => customFetch(request, params)}
                 element={<PostList />}
          />

          <Route path=':board/thread/:threadId'
                 loader={({ request, params }) => customFetch(request, params)}
                 action={createNewPostAction}
                 element={<PostList />}
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

async function customFetch(request, params) {
  let url = '/api' + new URL(request.url).pathname;
  const page = new URL(request.url).searchParams.get('page');
  page ? url += `?page=${page}` : '';
  const r = await fetch(url);
  if (!r.ok) {
    throw new Response('loader error', { status: r.status });
  }
  return r.json();
}
