import { createContext, useContext, useMemo, useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'displayMenu':  // 0 == closed
      return { ...state, menuId: state.menuId === action.menuId ? 0 : action.menuId };
    case 'expandImage':
      return action.imageUrl !== state.imageState.imageUrl ?
        { // new img clicked, displaying a new img
          ...state,
          imageState: { expanded: true, imageUrl: action.imageUrl }
        }
        : { // same img clicked twice, collapsing it
          ...state,
          imageState: { expanded: false, imageUrl: null }
        };
    case 'clicked':
      return state.imageState.expanded || state.menuId !== 0 ?
        {  // if expanded, collapsing image or postMenu on some outside element click
          ...state,
          menuId: 0,
          imageState: { expanded: false, imageUrl: null }
        }
        : state;
    case 'postEdited':
      return {
        ...state,
        postBeingEdited: state.postBeingEdited === action.postId ? 0 : action.postId
      };
  }
}

const initialState = {
  menuId: 0,
  imageState: {
    expanded: false,
    imageUrl: null,
  },
  postBeingEdited: 0,
};

export function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const api = useMemo(() => {

    function onPostMenuClick(menuId) {
      dispatch({ type: 'displayMenu', menuId });
    }

    function onImageClick(ev) {
      ev.preventDefault();
      const imageClicked = ev.target.parentElement;
      dispatch({ type: 'expandImage', imageUrl: imageClicked.href });
    }

    function onClick(ev) {
      const classList = ['img', 'dropdown'];
      if (!classList.some(class_ => ev.target.classList.contains(class_))) {
        dispatch({ type: 'clicked' });
      }
    }

    function onPostEdit(postId) {
      dispatch({ type: 'postEdited', postId })
    }

    return { onPostMenuClick, onImageClick, onClick, onPostEdit }
  }, []);

  // const [postEditable, setPostEditable] = useState(0);
  // const toggleEditMenu = id => setPostEditable.call(null, postEditable === id ? 0 : id);

  return (
    <ApiContext.Provider value={api}>
      <MenuIdContext.Provider value={state.menuId}>
        <ImageOverlayContext.Provider value={state.imageState}>
          <PostBeingEditedContext.Provider value={state.postBeingEdited}>
            {children}
          </PostBeingEditedContext.Provider>
        </ImageOverlayContext.Provider>
      </MenuIdContext.Provider>
    </ApiContext.Provider>
  )
}

const ApiContext = createContext();
const MenuIdContext = createContext();
const ImageOverlayContext = createContext();
const PostBeingEditedContext = createContext();

export const useContextApi = () => useContext(ApiContext);
export const useMenuId = () => useContext(MenuIdContext);
export const useImageOverlay = () => useContext(ImageOverlayContext);
export const usePostBeingEdited = () => useContext(PostBeingEditedContext);
