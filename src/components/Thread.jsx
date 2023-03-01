import { useFetcher, useLoaderData, useOutletContext } from 'react-router-dom';
import { PostForm } from './PostForm.jsx';
import { Post } from './Post';
import { PostsWrapper } from './PostsWrapper';

export default function Thread() {
  const postsJson = useLoaderData();
  const fetcher = useFetcher();
  const dateNow = new Date();
  console.log('thread jsx ')
  const { imageOnClickHandler } = useOutletContext();

  const posts = postsJson.posts.map(post =>
    <Post key={post.id}
      post={post}
      isThreadsList={false}
      // dateNow={dateNow}
      lovilka={imageOnClickHandler}
      // context={context}
    />
  );

  return (
    <>
      <fetcher.Form>
        <PostsWrapper>
          {posts}
        </PostsWrapper>
      </fetcher.Form>
      <PostForm />
    </>
  );
}

