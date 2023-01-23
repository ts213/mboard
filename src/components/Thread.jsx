import { useFetcher, useLoaderData } from 'react-router-dom';
import { PostForm } from './PostForm.jsx';
import { Post } from './Post';
import { PostsWrapper } from './PostsWrapper';
import { useState, createContext } from 'react';

export const MenuContext = createContext( {} );

export default function Thread() {
  const postsJson = useLoaderData();
  const fetcher = useFetcher();

  const [menuId, setMenuId] = useState(0);
  const togglePostDropdownMenu = id => setMenuId.call(this, menuId === id ? 0 : id);

  const posts = postsJson.posts.map(post =>
    <Post key={post.id} post={post} isThreadsList={false} />
  );

  return (
    <>
      <fetcher.Form>
        <MenuContext.Provider value={{menuId, togglePostMenu: togglePostDropdownMenu}}>
          <PostsWrapper posts={posts} />
        </MenuContext.Provider>
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

