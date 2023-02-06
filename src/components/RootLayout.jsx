import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar.jsx';
import { useEffect, useState } from 'react';

export function RootLayout() {
  const [postEditable, setPostEditable] = useState(0);
  const toggleEditMenu = id => setPostEditable.call(null, postEditable === id ? 0 : id);

  const [menuId, setMenuId] = useState(0);
  const toggleDropdownMenu = id => setMenuId.call(null, menuId === id ? 0 : id);

  const contextStore = {
    postEditable,
    setPostEditable,
    toggleEditMenu,

    menuId,
    setMenuId,
    toggleDropdownMenu,
  };

  useEffect(() => {
    document.addEventListener('click', clickOutsideToCloseMenu);

    return () => document.removeEventListener('mousedown', clickOutsideToCloseMenu);
  }, []); //not specifying dependencies, Effect will run after every component re-render

  function clickOutsideToCloseMenu(e) {
    if (menuId !== 0 || !e.target.classList.contains('dropdown')) {
      setMenuId(0);
    }
  }

  return (
    <>
      <NavBar />
      <main>
        <Outlet context={contextStore} />
      </main>
    </>
  )
}

