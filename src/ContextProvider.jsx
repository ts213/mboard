import { createContext, useContext, useMemo, useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'displayMenu': {
      const menuId = state.menuId === action.menuId ? 0 : action.menuId;
      return { ...state, menuId: menuId };
    }
    case 'expandImage': {
      console.log('expandImage');
      return state;
    }

    default:
      throw Error('Unknown action: ' + action.type);
  }
}

const initialState = {
  menuId: 0,
  imageStateObject: {
    expanded: false,
    imageUrl: null,
  }
};

const ApiContext = createContext({});
const MenuIdContext = createContext({});

export function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const api = useMemo(() => {

    function onPostMenuClick(menuId) {
      dispatch({ type: 'displayMenu', menuId })
    }

    function onImageClick() {
      dispatch({ type: 'expandImage' })
    }

    return { onPostMenuClick, onImageClick }
  }, []);

  // const [imageStateObject, setImageDisplayState] = useState({
  //   expanded: false,
  //   imageUrl: null,
  // });

  // const [postEditable, setPostEditable] = useState(0);
  // const toggleEditMenu = id => setPostEditable.call(null, postEditable === id ? 0 : id);

  // const [menuId, setMenuId] = useState(0);
  // const toggleDropdownMenu = useCallback((id) => setMenuId(prev => prev === id ? 0 : id), []);

  // const imageOnClickHandler = useCallback((ev) => {
  //   ev.preventDefault();
  //   const imageClicked = ev.target.parentElement;
  //
  //   setImageDisplayState(prevState =>
  //     imageClicked.href !== prevState.imageUrl ?  // clicked img is a new one, displaying a new img
  //       {
  //         expanded: true,
  //         imageUrl: imageClicked.href,
  //       }
  //       : {  // same img clicked twice, removing from displaying
  //         expanded: false,
  //         imageUrl: null
  //       }
  //   );
  // }, []);


  // function hideImageOnClick(ev) {
  //   if (!ev.target.classList.contains('img')) {
  //     setImageDisplayState(prev =>
  //       prev.expanded ?
  //         { ...prev, expanded: false, imageUrl: null }
  //         : prev
  //     )
  //   }
  // }
  //
  // function clickOutsideToCloseMenu(ev) {
  //   if (!ev.target.classList.contains('dropdown')) {
  //     setMenuId(prev =>
  //       prev !== 0 ? 0 : prev
  //     );
  //   }
  // }
  //
  // const contextStore = {
  //   postEditable, setPostEditable,
  //   toggleEditMenu,
  //
  //   menuId, setMenuId,
  //   toggleDropdownMenu,
  //
  //   imageOnClickHandler,
  // };

  return (
    <ApiContext.Provider value={api}>
      <MenuIdContext.Provider value={state.menuId}>
        {children}
      </MenuIdContext.Provider>
    </ApiContext.Provider>
  )
}

export const useContextApi = () => useContext(ApiContext);
export const useMenuIdApi = () => useContext(MenuIdContext);
