import { createContext, useContext, useMemo, useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'displayMenu':  // 0 == closed
      return { ...state, menuId: state.menuId === action.postId ? 0 : action.postId };
    case 'editMenu':  // 0 == closed
      return { ...state, editMenu: state.editMenu === action.postId ? 0 : action.postId };
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
  }
}

const initialState = {
  menuId: 0,
  editMenu: 0,
  imageState: {
    expanded: false,
    imageUrl: null,
  },
};

export function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const api = useMemo(() => {

    function onDropdownClick(postId) {
      dispatch({ type: 'displayMenu', postId });
    }

    function onImageClick(ev) {
      ev.preventDefault();
      const imageClicked = ev.target.parentElement;
      dispatch({ type: 'expandImage', imageUrl: imageClicked.href });
    }

    function onEditMenuClick(postId) {
      dispatch({ type: 'editMenu', postId });
    }

    function onClick(ev) {
      const classList = ['img', 'dropdown'];
      if (!classList.some(class_ => ev.target.classList.contains(class_))) {
        dispatch({ type: 'clicked' });
      }
    }

    return { onDropdownClick, onImageClick, onClick, onEditMenuClick }
  }, []);

  return (
    <ApiContext.Provider value={api}>
      <PostIdDropdown.Provider value={state.menuId}>
        <ImageOverlayContext.Provider value={state.imageState}>
          <EdiMenutContext.Provider value={state.editMenu}>
            {children}
          </EdiMenutContext.Provider>
        </ImageOverlayContext.Provider>
      </PostIdDropdown.Provider>
    </ApiContext.Provider>
  )
}

const ApiContext = createContext();
const PostIdDropdown = createContext();
const ImageOverlayContext = createContext();
const EdiMenutContext = createContext();

export const useContextApi = () => useContext(ApiContext);
export const usePostDropdown = () => useContext(PostIdDropdown);
export const useImageOverlay = () => useContext(ImageOverlayContext);
export const useEdiMenutContext = () => useContext(EdiMenutContext);
