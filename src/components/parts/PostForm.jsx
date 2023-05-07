import '../styles/PostForm.css';
import { Button } from './Button.jsx';
import { useRef, useState, useEffect, useMemo } from 'react';
import { FormAttachments } from './FormAttachments.jsx';
import { formErrorList } from '../../utils/postFormErrors.js';
import { useFetcher, useNavigate } from 'react-router-dom';

export function PostForm() {
  const [fileList, setFileList] = useState([]);
  const inputFileRef = useRef();
  const textAreaRef = useRef();
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const errorList = useMemo(() => formErrorList(fileList, fetcher.data),
    [fetcher.data, fileList]
  );

  useEffect(() => {
    if (fetcher.data?.created === 1) {  // post created
      if (fetcher.data?.post?.thread === null) { // null == new thread
        return navigate(`thread/${fetcher.data.post.id}`);
      }

      textAreaRef.current.value = '';
      inputFileRef.current.value = '';
      setFileList([]);
    }
  }, [fetcher.data, navigate]);

  function onFileInputChange(e) {
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
    <>
      {errorList.length > 0 &&
        errorList.map((er, idx) =>
          <output key={idx} className='post-form-error'>
            {er}
          </output>
        )
      }

      <fetcher.Form
        method='POST' encType='multipart/form-data'
        className='post-form'
      >

        <div className='post-form-poster-input-wrap'>
          <input type='text' name='poster' maxLength='35' placeholder='Anon'
                 className='post-form-poster-input'
          />
          <Button
            disabled={(fileList.length > 0 && errorList.length > 0) || fetcher.state !== 'idle'}
            submitting={fetcher.state === 'submitting'}
            buttonType='submit'
          />
        </div>

        <textarea ref={textAreaRef} rows='7'
                  required={fileList.length < 1}
                  name='text'
                  minLength='1' maxLength='10000'
                  className='post-form-textarea'
        />

        <label
          className='file-input-label'>
          <div className='file-input-label-span'>
            SELECT A FILE
          </div>
          <input
            name='image' type='file' accept='image/*'
            multiple
            ref={inputFileRef}
            onChange={onFileInputChange}
          />
        </label>

        {fileList.length > 0 &&
          <FormAttachments
            onFileRemove={onFileRemove}
            fileList={fileList}
          />
        }
      </fetcher.Form>
    </>
  );

  function onFileRemove(idxToRemove, file) {
    const fileUrl = URL.createObjectURL(file);
    const dt = new DataTransfer(); // workaround, can't change input.files directly
    const nextFileList = fileList.filter((_, idx) => idx !== idxToRemove);  // need sync. value, not async
    nextFileList.forEach(file => dt.items.add(file));
    inputFileRef.current.files = dt.files;

    URL.revokeObjectURL(fileUrl);
    setFileList(nextFileList);
  }
}
