import { useLoaderData } from 'react-router-dom';
import { usePostList } from '../hooks/usePostList.jsx';
import { PostForm } from '../PostForm.jsx';


export function Thread() {
  const fetchedData = useLoaderData();
  const { results } = fetchedData;
  const posts = usePostList(results);

  return (
    <>
      {posts}
      <PostForm />
    </>
  );
}
