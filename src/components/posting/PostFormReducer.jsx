import { createContext, useContext, useReducer } from 'react';

const initialFormState = {
  postText: '',
  posterName: '',
  fileList: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'textEdited':
      return { ...state, postText: action.value };
    case 'posterEdited':
      return { ...state, posterName: action.value };
    case 'fileListChange':
      return { ...state, fileList: action.value };
    case 'fileListPop':
      return { ...state, fileList: state.fileList.filter((_, idx) => idx !== action.value) };
    case 'insertQuoteId': {
      const { selStart, postId } = action.value;
      return { ...state, postText: insertIntoString(state.postText, `>>${postId}\n`, selStart) };
    }
  }
}

export function PostFormReducer({ children }) {
  const [state, dispatch] = useReducer(reducer, initialFormState);
  return (
    <FormStateContext.Provider value={state}>
      <FormDispatchContext.Provider value={dispatch}>
        {children}
      </FormDispatchContext.Provider>
    </FormStateContext.Provider>
  )
}

const FormDispatchContext = createContext();
export const useFormDispatchContext = () => useContext(FormDispatchContext);

const FormStateContext = createContext();
export const useFormStateContext = () => useContext(FormStateContext);


function insertIntoString(string, value, pos) {
  string = string.substring(0, pos)
    + value
    + string.substring(pos);

  const selectedText = window.getSelection().toString().trimEnd();
  if (selectedText.length > 0) {
    string += '>';
    string += selectedText.replace(/\n/g, '\n>');
    string += '\n';
  }
  return string;
}
