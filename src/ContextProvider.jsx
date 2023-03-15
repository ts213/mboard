import { createContext, useContext, useMemo } from 'react';
import { useReducerCustom } from './hooks.jsx';

export function ContextProvider({ children }) {
  const [state, dispatch] = useReducerCustom();

  const api = useMemo(() => {

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

    function onClick(ev) {
      const classList = ['img', 'dropdown', 'del-btn'];
      if (!classList.some(class_ => ev.target.classList.contains(class_))) {
        dispatch({ type: 'unimportantClick' });
      }
    }

    function onPostCreateOrDelete(ev) {
      dispatch({ type: 'postChange', postId: ev.detail.postId });
    }

    return { onDropdownClick, onImageClick, onClick, onEditMenuClick, onPostCreateOrDelete }
  }, [dispatch]);

  return (
    <PostHistoryContext.Provider value={state.postIdList}>
      <EdiMenutContext.Provider value={state.editMenu}>
        <PostIdDropdown.Provider value={state.menuId}>
          <ImageOverlayContext.Provider value={state.imageState}>
            <ApiContext.Provider value={api}>
              {children}
            </ApiContext.Provider>
          </ImageOverlayContext.Provider>
        </PostIdDropdown.Provider>
      </EdiMenutContext.Provider>
    </PostHistoryContext.Provider>
  )
}

const ApiContext = createContext();
const PostIdDropdown = createContext();
const ImageOverlayContext = createContext();
const EdiMenutContext = createContext();
const PostHistoryContext = createContext();

export const useContextApi = () => useContext(ApiContext);
export const usePostDropdownContext = () => useContext(PostIdDropdown);
export const useImageOverlayContext = () => useContext(ImageOverlayContext);
export const useEdiMenutContext = () => useContext(EdiMenutContext);
export const usePostHistoryContext = () => useContext(PostHistoryContext);
