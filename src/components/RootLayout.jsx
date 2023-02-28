import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar.jsx';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { addRepliesToPosts } from '../utils/addRepliesToPost.js';
import { tooltipsOnHover } from '../utils/tooltipsOnHover.js';

export function RootLayout() {
  console.log('root l');

  const [imgObj, setImageObj] = useState({
    expanded: false,
    imageUrl: null,
    dimensions: {
      width: null,
      height: null,
    },
  });

  const test = useCallback((ev) => {
    ev.preventDefault();
    const imageClicked = ev.target.parentElement;

    setImageObj(prevState =>
      imageClicked.href !== prevState.imageUrl ?
        {
          ...prevState,
          expanded: true,
          imageUrl: imageClicked.href,
          dimensions: { ...resizeImg(imageClicked) }
        }
        : {
          ...prevState,
          expanded: false,
          dimensions: { width: null, height: null },
          imageUrl: null
        }
    );
  }, []);

  function resizeImg(image) {
    const [maxWidth, maxHeight] = [window.innerWidth, window.innerHeight];
    const [width, height] = [image.dataset.width, image.dataset.height];
    const ratio = Math.min(1, maxWidth / width, maxHeight / height);
    const w = width * ratio + 'px';
    const h = height * ratio + 'px';
    return { width: w, height: h };
  }

  // const { menuId, setMenuId } = useContext(Context);

  useEffect(() => {
    addRepliesToPosts();
    document.body.addEventListener('mouseover', tooltipsOnHover);
    // document.body.addEventListener('click', clickOutsideToCloseMenu);
    document.body.addEventListener('click', hideImage);

    return () => {
      document.body.removeEventListener('mouseover', tooltipsOnHover);
      // document.body.removeEventListener('click', clickOutsideToCloseMenu);
      document.body.removeEventListener('click', hideImage);
    };

  function hideImage(ev) {
    // if (imgObj.expanded && !ev.target.classList.contains('img')) {
    if (!ev.target.classList.contains('img')) {
      setImageObj(prev => ({ ...prev, expanded: false, imageUrl: null, dimensions: { width: null, height: null } }))
    }
  }

  }, []);

  // const hideImage = useCallback(function (ev) {
  //   // if (imgObj.expanded && !ev.target.classList.contains('img')) {
  //   if (!ev.target.classList.contains('img')) {
  //     setImageObj(prev => ({ ...prev, expanded: false, imageUrl: null, dimensions: { width: null, height: null } }))
  //   }
  // }, []);

  // function clickOutsideToCloseMenu(ev) {
  //   if (menuId !== 0 || !ev.target.classList.contains('dropdown')) {
  //     setMenuId(0);
  //   }
  // }

  return (
    <>
      <NavBar />
      <div className='fixed w-[100%] pointer-events-none text-right opacity-50 '>
        {JSON.stringify(imgObj)}
      </div>
      <main>
        <Outlet context={[test]} />
      </main>
      {imgObj.expanded &&
        <div style={{ ...imgObj.dimensions }} id='img-wrapper'>
          <a href={imgObj.imageUrl}>
            <img alt='image' className='img'
              onClick={test}
              src={imgObj.imageUrl} />
          </a>
        </div>
      }
    </>
  )
}
