import { useFetcher, useLoaderData } from 'react-router-dom';
import { PostForm } from './PostForm.jsx';
import { Post } from './Post';
import { PostsWrapper } from './PostsWrapper';
import { useState } from 'react';

export default function Thread() {
  const postsJson = useLoaderData();
  const fetcher = useFetcher();

  const [menuId, setMenuId] = useState(0);
  const toggleDropdownMenu = id => setMenuId.call(this, menuId === id ? 0 : id);

  const [postEditable, setPostEditable] = useState(0);
  const toggleEditMenu = id => setPostEditable.call(this, postEditable === id ? 0 : id);

  const posts = postsJson.posts.map(post =>
    <Post key={post.id}
          post={post}
          isThreadsList={false}
          menuId={menuId}
          toggleDropdownMenu={toggleDropdownMenu}
          postEditable={postEditable}
          setPostEditable={setPostEditable}
          toggleEditMenu={toggleEditMenu}
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

// export async function threadLoader({ params }) {
//   // const r = await fetch(`${import.meta.env.VITE_API}/${params.board}/thread/${params.threadId}/`);
//   const r = await fetch(`/api/${params.board}/thread/${params.threadId}/`);
//   if (!r.ok) {
//     throw new Response('threadLoader err', { status: r.status })
//   }
//   return r.json();
// }
//

