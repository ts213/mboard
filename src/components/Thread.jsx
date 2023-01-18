import { useLoaderData } from 'react-router-dom';
import { PostForm } from './PostForm.jsx';
import { Post } from './Post';
import { PostsWrapper } from './PostsWrapper';

export default function Thread() {
  const postsJson = useLoaderData();


  const posts = postsJson.posts.map(post =>
    <Post key={post.id} post={post} isThreadsList={false} />
  );

  return (
    <>
      <PostsWrapper posts={posts} />
      <PostForm />
    </>
  )
}

// export async function threadLoader({ params }) {
//   // const r = await fetch(`${import.meta.env.VITE_API}/${params.board}/thread/${params.threadId}/`);
//   const r = await fetch(`/api/${params.board}/thread/${params.threadId}/`);
//   if (!r.ok) {
//     throw new Response('threadLoader err', { status: r.status })
//   }
//   return r.json();
// }
//

