import { useLoaderData, useFetcher } from 'react-router-dom';
import { SubmitButton } from './SubmitButton';
import { useReducer } from 'react';

export function PostForm() {
  const { threadId, board } = useLoaderData();
  const fetcher = useFetcher();

  const initialFormState = {
    text: '',
    poster: '',
    filesList: [],
    filesSize: 0,
    textError: '',
    fileError: '',
    posterError: '',
    formValid: false,
  };
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  function formReducer(state, action) {
    let error;
    console.log(state)
    switch (action.type) {
      case 'form_submitted': {
        let formValid = true;
        if (state.fileError || state.textError || state.posterError) {
          formValid = false;
        }
        return { ...state, formValid: formValid };
      }
      case 'reset_form': {
        return initialFormState;
      }
      case 'file_changed': {
        error = validate('file', action.payload, state);
        return { ...state, filesList: action.payload, fileError: error };
      }
      case 'text_changed': {
        error = validate('text', action.payload, state);
        return { ...state, text: action.payload, textError: error }
      }
      case 'poster_changed': {
        error = validate('poster', action.payload, state);
        return { ...state, poster: action.payload, posterError: error };
      }
      default:
        console.log('defaul!!!');
        return state;
    }
  }

  function validate(inputType, value, state) {
    switch (inputType) {
      case 'text': {
        return value.length > 10 ? 'post too long' : null;
      }
      case 'file': {
        let totalSize = 0;
        for (let file of value) {
          totalSize += file.size;
          state.filesList = [...state.filesList, file]
        }
        return totalSize > 5 * 1024 * 1024 ? 'file too large' : null;
      }
    }
  }

  function changeHandler(e) {
    if (e.target.name === 'file') {
      dispatch({ type: e.target.name + '_changed', payload: e.target.files })
    } else {
      dispatch({ type: e.target.name + '_changed', payload: e.target.value })
    }
    // dispatch({ type: 'reset_form' });
    // const totalSize = files.reduce((accum, file) => accum + file.size, 0);
  }

  function submitHandler(e) {
    e.preventDefault();  // ТУТУТУТТУ
    dispatch({ type: 'form_submitted' })
  }

  return (
    <fetcher.Form action='/posting/' method='POST' className='mb-20' encType='multipart/form-data'
      onSubmit={submitHandler}>
      {fetcher.data &&
        <div className='error text-center text-red-500 text-lg'>
          <p>{fetcher.data.errors}</p>
        </div>
      }
      <div className='m-auto w-2/6 flex'>
        <input type='text' name='poster' onChange={changeHandler}
          className='grow border border-gray-600 bg-slate-800 text-white' />
        <SubmitButton submitting={fetcher.state === 'submitting'} buttonType='submit' />
      </div>
      <textarea name='text' rows='7' required onChange={changeHandler}
        className='m-auto resize block border border-gray-600 w-2/6 bg-slate-800 text-white'
      />

      <label
        className='py-3 m-auto w-2/6 flex bg-slate-800 border border-gray-600 tracking-wide cursor-pointer '>
        <span className='m-auto text-gray-400'>SELECT A FILE</span>
        <input
          onChange={changeHandler}
          multiple name='file' type='file' className='hidden'
        />
      </label>

      {/*{state.errors.length > 0 &&*/}
      {/*  state.errors.map(error =>*/}
      {/*    <output key={error} className='block text-center text-red-400 mt-3'>*/}
      {/*      {error}*/}
      {/*    </output>)*/}
      {/*}*/}

      {state.filesList &&
        [...state.filesList].map(file =>  // destruct first, can't map FileList type right away
          <output key={file.name} className='block text-center text-gray-400 mt-1'>
            {file.name}
          </output>)
      }
      <input hidden name='board' readOnly value={board} />
      <input hidden name='threadId' readOnly value={threadId} />
    </fetcher.Form>
  )
}
