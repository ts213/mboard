import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar.jsx';
import { useCallback, useEffect, useState } from 'react';
import { addRepliesToPosts } from '../utils/addRepliesToPost.js';
import { tooltipsOnHover } from '../utils/tooltipsOnHover.js';
import { ContextProvider } from '../ContextProvider';

export function RootLayout() {
  console.info('root l');

  useEffect(() => {
    addRepliesToPosts();
    document.body.addEventListener('mouseover', tooltipsOnHover);
    // document.body.addEventListener('click', clickOutsideToCloseMenu);
    // document.body.addEventListener('click', hideImageOnClick);

    return () => {
      document.body.removeEventListener('mouseover', tooltipsOnHover);
      // document.body.removeEventListener('click', clickOutsideToCloseMenu);
      // document.body.removeEventListener('click', hideImageOnClick);
    };

  }, []);

  return (
    <>
      <ContextProvider>
        <NavBar />
        <main>
          <Outlet />
        </main>
      </ContextProvider>
      {/*{imageStateObject.expanded && <ExpandedImage />}*/}
    </>
  );
  //
  // function ExpandedImage() {
  //   return (
  //     <div id='img-wrapper'>
  //       <a href={imageStateObject.imageUrl} className=''>
  //         <img id='expanded-img' className='img' alt='image'
  //           onClick={imageOnClickHandler}
  //           src={imageStateObject.imageUrl} />
  //       </a>
  //     </div>
  //   );
  // }
}
