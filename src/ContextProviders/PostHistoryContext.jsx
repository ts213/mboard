import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

export function PostHistoryContext({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadPostHistoryFromStorage);

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(state.postIdList));
  }, [state.postIdList]);

  const api = useMemo(() => {
    function onPostChange(ev) {
      switch (ev.detail.method) {
        case 'POST':
          return dispatch({ type: 'postCreated', postId: ev.detail.postId });
        case 'PATCH':
          return dispatch({ type: 'postEdited', postId: ev.detail.postId });
        case 'DELETE':
          return dispatch({ type: 'postDeleted', postId: ev.detail.postId });
      }
    }

    return { onPostChange }
  }, [dispatch]);

  return (
    <PostHistoryContextApi.Provider value={api}>
      <PostHistoryContextList.Provider value={state.postIdList}>
        {children}
      </PostHistoryContextList.Provider>
    </PostHistoryContextApi.Provider>
  )
}

const PostHistoryContextApi = createContext();
export const usePostHistoryContextApi = () => useContext(PostHistoryContextApi);

const PostHistoryContextList = createContext();
export const usePostHistoryContextList = () => useContext(PostHistoryContextList);

function reducer(state, action) {
  switch (action.type) {
    case 'postCreated':
      return {
        ...state,
        postIdList: [...state.postIdList, { id: action.postId, ed: 1, del: 1 }]
      };
    case 'postEdited':
      return {
        ...state,
        postIdList: state.postIdList.map(post =>
          post.id === action.postId ? { ...post, ed: 0 } : post
        )
      };
    case 'postDeleted':
      return {
        ...state,
        postIdList: state.postIdList.filter(post => post.id !== action.postId)
      };
  }
}

function loadPostHistoryFromStorage() {  // convert to set??? to do
  try {
    const postHistory = window.localStorage.getItem('posts');
    if (postHistory) {
      const postIdList = JSON.parse(postHistory);
      if (Array.isArray(postIdList)) {
        return { postIdList };  // post history found and is ok
      }
    }

  } catch {  // might be tampered with, coercing...
    window.localStorage.setItem('posts', '[]');
  }

  return { postIdList: [], };
}
