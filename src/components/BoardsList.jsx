import { useLoaderData, Await } from 'react-router-dom';
import { Suspense } from 'react';
import { Link } from 'react-router-dom';

export default function BoardsList() {
  const boardsData = useLoaderData();

  // const posts = boardsData.map(board =>
  //   <div key={board.id} className='ml-12 mb-5 text-lg text-center'>
  //     <Link to={'../' + board.link + '/'}>{board.title}</Link>
  //     <hr className='h-px my-8 border-0 dark:bg-gray-700' />
  //   </div>
  // );


  return (
    <Suspense fallback={<h1 className='ml-12 mb-5 text-lg text-center'>loading</h1>}>
      <Await resolve={boardsData.boards}>
        {(loaded) => mapEmAll(loaded)}
      </Await>
    </Suspense>
  )
}

function mapEmAll(obj) {
  return obj.map(board =>
    <div key={board.id} className='ml-12 mb-5 text-lg text-center'>
      <Link to={'../' + board.link + '/'}>{board.title}</Link>
      <hr className='h-px my-8 border-0 dark:bg-gray-700' />
    </div>
  );
}


// export async function boardsLoader() {
//   // const r = await fetch(import.meta.env.VITE_BOARDS_LIST);
//   const r = await fetch('/api/boards/');
//   if (!r.ok) {
//     throw new Response('loader error', {status: r.status});
//   }
//   return r.json();
// }
