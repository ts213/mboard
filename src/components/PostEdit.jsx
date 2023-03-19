import { useFetcher } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Button } from './Button.jsx';

export function PostEdit({ postId, onEditMenuClick, postTextElmnt, board }) {
  const fetcher = useFetcher();
  const textareaRef = useRef();


  useEffect(() => {
    textareaRef.current.focus();
    textareaRef.current.selectionStart = textareaRef.current.value.length;  // moving caret to end of text
  }, []);

  useEffect(() => {
    if (fetcher.data?.edited) {
      onEditMenuClick(0);
      postTextElmnt.innerHTML = fetcher.data.edited;
    }
  }, [fetcher.data?.edited, onEditMenuClick, postTextElmnt]);

  return (
    <>
      <textarea className=' outline-none resize overflow-scroll bg-slate-800 pb-10 w-[100%]'
                defaultValue={postTextElmnt.innerText}
                ref={textareaRef}
      />

      {fetcher.data?.errors &&
        <div className='text-center text-red-500 text-lg float-right'>
          {fetcher.data.errors}
        </div>
      }

      <div className='block mt-5 clear-both'>
        <Button type='button'
                value='Cancel'
                clickHandler={() => onEditMenuClick(0)}
                extraClass='mr-4 '
        />
        <Button type='button'
                value='Update'
                clickHandler={editPost}
                submitting={fetcher.state === 'submitting'}
                disabled={fetcher.state !== 'idle'}
        />
      </div>
    </>
  );

  async function editPost() {
    fetcher.submit(
      {
        text: textareaRef.current.value,
        id: postId,
        board: board
      },
      { method: 'patch', action: `/edit/` }
    );
  }
}
