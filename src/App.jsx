import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, defer } from 'react-router-dom';
import RootLayout from './components/RootLayout.jsx';
import { lazy, Suspense } from 'react';
import { formAction } from './utils/formAction'

const BoardsList = lazy(() => import('./components/BoardsList'));
const ThreadsList = lazy(() => import('./components/ThreadsList'));
const Thread = lazy(() => import('./components/Thread'));
const ErrorCpmnt = lazy(() => import('./components/ErrorCpmnt'));
// const formAction = lazy(() => import('./utils/formAction'));  // submit form not working with lazy

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />} errorElement={<ErrorCpmnt />}>
        <Route index element={<HomePage />} />

        <Route path='boards'
               loader={() => defer({ boards: customFetch('boards') })}
               errorElement={<ErrorCpmnt />}
               element={
                 <Suspense>
                   <BoardsList />
                 </Suspense>
               } />

        <Route path=':board'
               loader={({ params }) => customFetch(params.board)}
               errorElement={<ErrorCpmnt />}
               element={
                 <Suspense>
                   <ThreadsList />
                 </Suspense>
               } />

        <Route path=':board/thread/:threadId'
               loader={({ params }) => customFetch(`${params.board}/thread/${params.threadId}/`)}
               errorElement={<ErrorCpmnt />}
               action={formAction}
               element={
                 <Suspense>
                   <Thread />
                 </Suspense>
               } />

      </Route>
    )
  );

  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}

function HomePage() {
  return (
    <div className={'text-center m-20'}>home page.....</div>
  )
}

async function customFetch(addr) {
  const r = await fetch(`/api/${addr}/`);
  if (!r.ok) {
    throw new Response('loader error', { status: r.status });
  }
  return r.json();
}
