import { useFetcher, useLoaderData } from 'react-router-dom';
import { PostForm } from './PostForm.jsx';
import { Post } from './Post';
import { PostsWrapper } from './PostsWrapper';

export default function Thread() {
  const postsJson = useLoaderData();
  const fetcher = useFetcher();

  const posts = postsJson.posts.map(post =>
    <Post key={post.id}
          post={post}
          isThreadsList={false}
    />
  );

  return (
    <>
      <fetcher.Form>
        <PostsWrapper>{posts}</PostsWrapper>

      </fetcher.Form>
      <PostForm />
    </>
  );
}

