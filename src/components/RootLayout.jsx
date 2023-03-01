import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar.jsx';
import { useCallback, useEffect, useState } from 'react';
import { addRepliesToPosts } from '../utils/addRepliesToPost.js';
import { tooltipsOnHover } from '../utils/tooltipsOnHover.js';

export function RootLayout() {
  console.log('root l');

  const [imageStateObject, setImageObj] = useState({
    expanded: false,
    imageUrl: null,
  });

  const imageOnClickHandler = useCallback((ev) => {
    ev.preventDefault();
    const imageClicked = ev.target.parentElement;

    setImageObj(prevState =>
      imageClicked.href !== prevState.imageUrl ?  // clicked img is a new one, displaying a new img
        {
          expanded: true,
          imageUrl: imageClicked.href,
        }
        : {  // same img clicked twice, removing from displaying
          expanded: false,
          imageUrl: null
        }
    );
  }, []);

  useEffect(() => {
    addRepliesToPosts();
    document.body.addEventListener('mouseover', tooltipsOnHover);
    // document.body.addEventListener('click', clickOutsideToCloseMenu);
    document.body.addEventListener('click', hideImageOnClick);

    return () => {
      document.body.removeEventListener('mouseover', tooltipsOnHover);
      // document.body.removeEventListener('click', clickOutsideToCloseMenu);
      document.body.removeEventListener('click', hideImageOnClick);
    };

    function hideImageOnClick(ev) {
      if (!ev.target.classList.contains('img')) {
        setImageObj(prev => ({ ...prev, expanded: false, imageUrl: null }))
      }
    }
  }, []);

  // function clickOutsideToCloseMenu(ev) {
  //   if (menuId !== 0 || !ev.target.classList.contains('dropdown')) {
  //     setMenuId(0);
  //   }
  // }

  const [postEditable, setPostEditable] = useState(0);
  const toggleEditMenu = id => setPostEditable.call(null, postEditable === id ? 0 : id);

  const [menuId, setMenuId] = useState(0);
  const toggleDropdownMenu = useCallback((id) => setMenuId(prev => prev === id ? 0 : id), []);

  const contextStore = {
    postEditable, setPostEditable,
    toggleEditMenu,

    menuId, setMenuId,
    toggleDropdownMenu,

    imageOnClickHandler
  };

  return (
    <>
      <NavBar />
      <pre className='fixed w-[100%] pointer-events-none text-right opacity-50 '>
        {JSON.stringify({ imageStateObject, menuId }, null, ' ')}
      </pre>
      <main>
        <Outlet context={contextStore} />
      </main>
      {imageStateObject.expanded && <ExpandedImage />}
    </>
  );

  function ExpandedImage() {
    return (
      <div id='img-wrapper'>
        <a href={imageStateObject.imageUrl} className=''>
          <img id='expanded-img' className='img' alt='image'
            onClick={imageOnClickHandler}
            src={imageStateObject.imageUrl} />
        </a>
      </div>
    );
  }
}
