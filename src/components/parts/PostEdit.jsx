import { useFetcher } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Button } from './Button.jsx';

export function PostEdit({ postId, onEditMenuClick, postTextElmnt, board }) {
  const fetcher = useFetcher();
  const textareaRef = useRef();

  useEffect(() => {
    if (fetcher.data?.created === 1) {
      onEditMenuClick(0);
      postTextElmnt.innerHTML = fetcher.data.post.text;
    }
  }, [fetcher.data, onEditMenuClick, postTextElmnt]);

  return (
    <>
      <textarea className='edit-post-textarea'
                defaultValue={postTextElmnt.innerText}
                ref={textareaRef}
                autoFocus
                onFocus={(ev) => ev.target.selectionStart = ev.target.value.length}
      />

      {fetcher.data?.errors &&
        <div className='edit-post-errors'>
          {Object.values(fetcher.data.errors)}
        </div>
      }

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
        type: 'edit',
        text: textareaRef.current.value,
        id: postId,
      },
      {
        method: 'patch',
        action: `/${board}/thread/${postId}`
      }
    );
  }
}
