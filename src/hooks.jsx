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

    case 'postCreated': {
      const postId = Number(action.postId);
      return {
        ...state,
        postIdList: [...state.postIdList, { id: postId, editable: 1, deletable: 1 }]
      };
    }

    case 'postEdited': {
      const postId = Number(action.postId);
      return {
        ...state,
        postIdList: state.postIdList.map(post =>
          post.id === postId ? { ...post, editable: 0 } : post
        )
      };
    }

    case 'postDeleted': {
      const postId = Number(action.postId);
      return {
        ...state,
        postIdList: state.postIdList.filter(post => post.id !== postId)
      };
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
