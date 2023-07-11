import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';

export function PostHistoryContext({ children }) {
  const [postIdList, dispatch] = useReducer(reducer, null, loadPostHistoryFromStorage);

  useEffect(() => {
    if (postIdList.length < 1) {
      return;
    }

    if (postIdList.length > 100) {
      postIdList.shift();
    }

    localStorage.setItem('posts', JSON.stringify(postIdList));
  }, [postIdList]);

  const onPostChange = useCallback(ev => {
    switch (ev.detail.method) {
      case 'POST':
        return dispatch({ type: 'postCreated', postId: ev.detail.postId });
      case 'PATCH':
        return dispatch({ type: 'postEdited', postId: ev.detail.postId });
      case 'DELETE':
        return dispatch({ type: 'postDeleted', postId: ev.detail.postId });
    }
  }, []);

  return (
    <PostHistoryContextApi.Provider value={onPostChange}>
      <PostHistoryContextList.Provider value={postIdList}>
        {children}
      </PostHistoryContextList.Provider>
    </PostHistoryContextApi.Provider>
  )
}

const PostHistoryContextApi = createContext();
export const usePostHistoryContextApi = () => useContext(PostHistoryContextApi);

const PostHistoryContextList = createContext();
export const usePostHistoryContext = () => useContext(PostHistoryContextList);

function reducer(state, action) {
  switch (action.type) {
    case 'postCreated':
      return [...state, { id: action.postId, ed: 1, del: 1 }];
    case 'postEdited':
      return state.map(post =>
        post.id === action.postId ? { ...post, ed: 0 } : post
      );
    case 'postDeleted':
      return state.filter(post => post.id !== action.postId);
  }
}

function loadPostHistoryFromStorage() {
  const postIdList = JSON.parse(localStorage.getItem('posts'));
  if (Array.isArray(postIdList)) {
    return postIdList;  // post history found and is ok
  }

  return [];
}
