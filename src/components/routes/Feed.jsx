import { useLoaderData } from 'react-router-dom';
import { PostList } from '../PostList.jsx';

export function Feed() {
  const data = useLoaderData();

  return (
    <PostList threadList={data} />
  );
}

export function FeedLoader() {
  const userid = localStorage.getItem('userid');
  const url = import.meta.env.VITE_API_PREFIX + '/feed/';
  return fetch(url, {
    method: 'GET',
    headers: {
      userid,
    }
  })
    .then(r => r.json())
    .then(j => j);
}
