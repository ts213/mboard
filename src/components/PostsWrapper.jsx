import { useEffect } from 'react';
import { tooltipsOnHover } from '../utils/tooltipsOnHover.js';
import { addRepliesToPosts } from '../utils/addRepliesToPost.js';
import { expandImage } from '../utils/expandImage.js';
import { useOutletContext } from 'react-router-dom';

export function PostsWrapper({ children }) {
  const { imageExpanded, setImageExpanded, menuId, setMenuId } = useOutletContext();

  useEffect(() => {
    addRepliesToPosts();
    document.body.addEventListener('mouseover', tooltipsOnHover);
    document.body.addEventListener('click', callback);
    document.body.addEventListener('click', clickOutsideToCloseMenu);

    return () => {
      document.body.removeEventListener('mouseover', tooltipsOnHover);
      document.body.removeEventListener('click', callback);
      document.body.removeEventListener('click', clickOutsideToCloseMenu);
    }

  }, []);

  function callback(ev) {
    expandImage(ev, imageExpanded, setImageExpanded);
  }

  function clickOutsideToCloseMenu(ev) {
    if (menuId !== 0 || !ev.target.classList.contains('dropdown')) {
      setMenuId(0);
    }
  }

  return (
    <div className='m-12 flex flex-col flex-wrap items-start'>
      {children}
    </div>
  );
}
