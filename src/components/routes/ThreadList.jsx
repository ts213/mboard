import { PostList } from '../PostList.jsx';
import { useRef, useState } from 'react';
import { useFetchPaginatedThreads } from '../../hooks/useFetchPaginatedThreads.jsx';
import { PostForm } from '../PostForm.jsx';

export default function ThreadList() {
  const [thread, setThread] = useState([]);
  const intersectionRef = useRef();

  useFetchPaginatedThreads(intersectionRef, setThread);

  return (
    <>
      <PostList thread={thread} />
      <var ref={intersectionRef}></var>
      {/*<PostForm />*/}
    </>
  );
}

export async function threadListLoader(request) {
  let url = '/api' + new URL(request.url).pathname;
  const page = new URL(request.url).searchParams.get('page');

  if (page) {
    url += `?page=${page}`;
  }
  const r = await fetch(url);
  if (!r.ok) {
    throw new Response('loader error', { status: r.status });
  }
  return r.json();
}
