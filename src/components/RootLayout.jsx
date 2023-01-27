import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar.jsx';
import { useEffect, useState } from 'react';

export function RootLayout() {

  const [postEditable, setPostEditable] = useState(0);
  const toggleEditMenu = id => setPostEditable.call(null, postEditable === id ? 0 : id);

  const [menuId, setMenuId] = useState(0);
  const toggleDropdownMenu = id => setMenuId.call(null, menuId === id ? 0 : id);

  const context = {
    postEditable,
    setPostEditable,
    toggleEditMenu,

    menuId,
    setMenuId,
    toggleDropdownMenu,
  };

  useEffect(() => {
    function clickOutsideHandler(e) {
      if (menuId !== 0 || !e.target.classList.contains('dropdown')) {
        setMenuId(0)
      }
    }

    document.addEventListener('click', clickOutsideHandler);
    return () => document.removeEventListener('mousedown', clickOutsideHandler);
  }, []); //not specifying dependencies, Effect will run after every component re-render

  return (
    <>
      <NavBar />
      <main>
        <Outlet context={context} />
      </main>
    </>
  )
}
