import { createContext, useCallback, useRef, useState } from 'react';

export const Context = createContext(null);

export function ContextProvider({ children }) {
  console.log('context provider')
  const [postEditable, setPostEditable] = useState(0);
  const toggleEditMenu = id => setPostEditable.call(null, postEditable === id ? 0 : id);

  const [menuId, setMenuId] = useState(0);
  const toggleDropdownMenu = id => setMenuId.call(null, menuId === id ? 0 : id);

  const contextStore = {
    postEditable, setPostEditable,
    toggleEditMenu,

    menuId, setMenuId,
    toggleDropdownMenu,

    // imgObj, setImageObj,
    // test,
  };

  return (
    <Context.Provider value={contextStore}>
      {children}
    </Context.Provider>
  )
}
