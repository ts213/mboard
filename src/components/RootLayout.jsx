import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar.jsx';
import { useState } from 'react';

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

  return (
    <>
      <NavBar />
      <main>
        <Outlet context={contextStore} />
      </main>
    </>
  )
}
