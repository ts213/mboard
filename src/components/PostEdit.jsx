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
    if (fetcher.data?.status === 1) {
      onEditMenuClick(0);
      postTextElmnt.innerHTML = fetcher.data.post.text;
    }
  }, [fetcher.data, onEditMenuClick, postTextElmnt]);

  return (
    <>
      <textarea className='edit-post-textarea'
                defaultValue={postTextElmnt.innerText}
                ref={textareaRef}
      />

      {fetcher.data?.errors &&
        <div className='edit-post-errors'>
          {fetcher.data.errors}
        </div>
      }

      {/*<div className='mt-5 clear-both'>*/}
      <div style={{ clear: 'both', marginTop: '1.25rem' }}>
        <Button type='button'
                value='Cancel'
                clickHandler={() => onEditMenuClick(0)}
                extraStyle={{ marginRight: '1rem' }}
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
