import { createContext, useContext, useMemo, useReducer } from 'react';

const initialState = {
  menuId: 0,
  editMenu: 0,
  imageOverview: {
    expanded: false,
    imageUrl: null,
  },
};

export function ThreadsContext({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const api = useMemo(() => {
    function onClick(ev) {
      const classList = ['img', 'dropdown-btn', 'fetcher-btn'];
      if (!classList.some(klass => ev.target.classList.contains(klass))) {
        dispatch({ type: 'click' });
      }
    }

    function onDropdownClick(postId) {
      dispatch({ type: 'displayDropdown', postId });
    }

    function onImageClick(ev) {
      ev.preventDefault();
      const imageClicked = ev.target.parentElement;
      dispatch({ type: 'expandImage', imageUrl: imageClicked.href });
    }

    function onEditMenuClick(postId) {
      dispatch({ type: 'displayEditMenu', postId });
    }

    return { onClick, onDropdownClick, onImageClick, onEditMenuClick }
  }, []);

  return (
    <EdiMenuContext.Provider value={state.editMenu}>
      <PostIdDropdown.Provider value={state.menuId}>
        <ImageOverlayContext.Provider value={state.imageOverview}>
          <GlobalContextApi.Provider value={api}>
            {children}
          </GlobalContextApi.Provider>
        </ImageOverlayContext.Provider>
      </PostIdDropdown.Provider>
    </EdiMenuContext.Provider>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case 'click':
      return state.imageOverview.expanded || state.menuId !== 0
        ? {  // if expanded, collapsing image or postMenu on outside element click
          ...state,
          menuId: 0,
          imageOverview: { expanded: false, imageUrl: null }
        }
        : state;

    case 'displayDropdown':
      return { ...state, menuId: state.menuId === action.postId ? 0 : action.postId };

    case 'displayEditMenu':
      return { ...state, editMenu: state.editMenu === action.postId ? 0 : action.postId };

    case 'expandImage':
      return action.imageUrl !== state.imageOverview.imageUrl
        ? { // new img clicked, displaying a new img
          ...state,
          imageOverview: { expanded: true, imageUrl: action.imageUrl }
        }
        : { // same img clicked twice, collapsing it
          ...state,
          imageOverview: { expanded: false, imageUrl: null }
        };
  }
}

const GlobalContextApi = createContext();
export const useGlobalContextApi = () => useContext(GlobalContextApi);

const PostIdDropdown = createContext();
export const usePostDropdownContext = () => useContext(PostIdDropdown);

const ImageOverlayContext = createContext();
export const useImageOverlayContext = () => useContext(ImageOverlayContext);

const EdiMenuContext = createContext();
export const useEdiMenuContext = () => useContext(EdiMenuContext);
