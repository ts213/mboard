import { useLoaderData } from 'react-router-dom';
import { PostList } from '../PostList.jsx';
import { PostForm } from '../PostForm.jsx';


export function Thread() {
  const fetchedData = useLoaderData();
  const { threads } = fetchedData;

  return (
    <>
      <PostList postList={threads} />
      <PostForm />
    </>
  );
}
