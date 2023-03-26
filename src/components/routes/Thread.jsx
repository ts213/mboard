import { useLoaderData } from 'react-router-dom';
import { PostList } from '../PostList.jsx';
import { PostForm } from '../PostForm.jsx';


export function Thread() {
  const fetchedData = useLoaderData();
  const { results } = fetchedData;

  return (
    <>
      <PostList postList={results} />
      <PostForm />
    </>
  );
}
