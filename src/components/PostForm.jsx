import { Button } from './Button.jsx';
import { useRef, useState, useEffect, useMemo } from 'react';
import { FormAttachments } from './FormAttachments';
import { formErrorList } from '../utils/postFormErrors.js';
import { useFetcher } from 'react-router-dom';

export function PostForm({ board, threadId = undefined }) {
  const [fileList, setFileList] = useState([]);
  const inputFileRef = useRef();
  const textAreaRef = useRef();

  const fetcher = useFetcher();
  const errorList = useMemo(() => formErrorList(fileList, fetcher.data), [fetcher.data, fileList]);

  useEffect(() => {
    if (fetcher.data?.status === 1) {
      textAreaRef.current.value = '';
      inputFileRef.current.value = '';
      setFileList([]);
      // updateThread();
    }
  }, [textAreaRef, inputFileRef, fetcher.data]);

  function onChange(e) {
    if (e.target.files.length > 4) {
      e.preventDefault();
      e.target.value = '';  // files might be left from previous input
      setFileList(Array.from(e.target.files));  // resetting too
      alert('>4');
    } else {
      setFileList(Array.from(e.target.files)); // FileList => Arr
    }
  }

  return (
    <fetcher.Form
      // action='/posting/'
      // action={ttt}
      // action={location.pathname + '?limit=' + (thr.replies.length + 1)}
      method='POST' encType='multipart/form-data'
      className='w-1/4 m-auto min-w-min mb-20' // min-w-min bc input elmnt has fixed default width
    >
      {errorList.length > 0 &&
        errorList.map((er, idx) =>
          <output key={idx} className='block text-center text-red-500 text-lg mb-3'>
            {er}
          </output>
        )}

      <div className='flex'>
        <input type='text' name='poster' maxLength='35' placeholder='Anon'
               className='grow border border-gray-600 bg-slate-800 text-white pl-2 placeholder:opacity-50 outline-none'
        />
        <Button
          disabled={errorList.length > 0 || fetcher.state !== 'idle'}
          submitting={fetcher.state === 'submitting'}
          buttonType='submit'
        />
      </div>

      <textarea ref={textAreaRef} rows='7'
                required={fileList.length < 1}
                name='text'
                minLength='1' maxLength='10000'
                className='min-w-[100%] border border-gray-600 bg-slate-800 text-white resize outline-none'
      />

      <label
        className='py-3 flex [&_span]:hover:text-white border border-gray-600 tracking-widest cursor-pointer hover:bg-gray-700 bg-slate-800'>
        <span className='m-auto text-gray-400 '>
          SELECT A FILE
        </span>
        <input ref={inputFileRef} onChange={onChange}
               multiple name='file' type='file' className='hidden' accept='image/*'
        />
      </label>

      {fileList.length > 0 &&
        <FormAttachments
          onFileRemove={onFileRemove}
          fileList={fileList}
        />
      }

      <input type='hidden' name='board' readOnly value={board} />
      {threadId && <input type='hidden' name='thread' readOnly value={threadId} />}
    </fetcher.Form>
  );

  function onFileRemove(idxToRemove, file) {
    const fileUrl = URL.createObjectURL(file);
    const dt = new DataTransfer(); // workaround bc can't change input.files directly
    const nextFileList = fileList.filter((_, idx) => idx !== idxToRemove);  // need sync. value instead of async
    nextFileList.forEach(file => dt.items.add(file));
    inputFileRef.current.files = dt.files;

    URL.revokeObjectURL(fileUrl);
    setFileList(nextFileList);
  }

}
