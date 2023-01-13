import { useLoaderData } from 'react-router-dom';
import { Link } from 'react-router-dom';

export function BoardsList() {
  const boardsJson = useLoaderData();

  return boardsJson.map(board =>
    <section key={board.id} className='ml-12 mb-5 text-lg text-center'>
      <Link to={'../' + board.link + '/'}>{board.title}</Link>
    </section>
  );
}

export async function boardsLoader() {
  // const r = await fetch(import.meta.env.VITE_BOARDS_LIST);
  const r = await fetch('/api/boards/');
  if (!r.ok) {
    throw new Response('loader error', {status: r.status});
  }
  return r.json();
}
