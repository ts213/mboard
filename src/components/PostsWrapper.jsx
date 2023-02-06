import { useEffect } from 'react';
import { tooltipsOnHover } from '../utils/tooltipsOnHover.js';
import { addRepliesToPosts } from '../utils/addRepliesToPost.js';

export function PostsWrapper({ children }) {
  useEffect(() => {
    addRepliesToPosts();
    document.addEventListener('mouseover', tooltipsOnHover);

    return () => document.removeEventListener('mouseover', tooltipsOnHover);

  }, []);

  return (
    <div className='m-12 flex flex-col flex-wrap items-start'>
      {children}
    </div>
  );
}
