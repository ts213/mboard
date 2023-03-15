import { useEffect, useReducer } from 'react';

const initialState = {
  menuId: 0,
  editMenu: 0,
  imageState: {
    expanded: false,
    imageUrl: null,
  },
  postIdList: getPostHistory(),
};

export function useReducerCustom() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.postIdList.length > 0) {
      window.localStorage.setItem('postHistory', JSON.stringify(state.postIdList));
    }
  }, [state.postIdList]);

  return [state, dispatch];
}

function reducer(state, action) {
  switch (action.type) {
    case 'displayDropdown':  // 0 == closed
      return { ...state, menuId: state.menuId === action.postId ? 0 : action.postId };

    case 'displayEditMenu':  // 0 == closed
      return { ...state, editMenu: state.editMenu === action.postId ? 0 : action.postId };

    case 'expandImage':
      return action.imageUrl !== state.imageState.imageUrl
        ? { // new img clicked, displaying a new img
          ...state,
          imageState: { expanded: true, imageUrl: action.imageUrl }
        }
        : { // same img clicked twice, collapsing it
          ...state,
          imageState: { expanded: false, imageUrl: null }
        };

    case 'unimportantClick':
      return state.imageState.expanded || state.menuId !== 0
        ? {  // if expanded, collapsing image or postMenu on some outside element click
          ...state,
          menuId: 0,
          imageState: { expanded: false, imageUrl: null }
        }
        : state;

    case 'postChange': {
      const postId = Number(action.postId);
      return state.postIdList.includes(postId)
        ? { ...state, postIdList: state.postIdList.filter(id => id !== postId) }  // post deletion
        : { ...state, postIdList: [...state.postIdList, postId] };  // creation
    }
  }
}

function getPostHistory() {
  const postHistory = window.localStorage.getItem('postHistory');
  if (postHistory) {
    try {
      const postIdList = JSON.parse(postHistory);
      if (Array.isArray(postIdList)) {
        return postIdList;
      }
    } catch {
      window.localStorage.setItem('postHistory', '[]');
    }
  }

  return [];
}
