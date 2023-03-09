import { useFetcher } from 'react-router-dom';
import { useEffect } from 'react';
import { SubmitButton } from './SubmitButton';

export function PostEdit({ postTextElmnt, postId,
                           postTextBeforeEdit, setPostEditable
}) {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.edited) {
      setPostEditable(0);
    }
  }, [fetcher, setPostEditable]);

  return (
    <>
      <div className={'float-right'}>
        <SubmitButton type='button'
                      value='Cancel'
                      clickHandler={cancelEdit}
                      extraStyle='mr-4 '
        />
        <SubmitButton type='button'
                      value='Update'
                      disabled={fetcher.state !== 'idle'}
                      clickHandler={testSubm}
                      submitting={fetcher.state === 'submitting'}
        />
      </div>
      <div className='text-center text-red-500 text-lg float-right'>
        {fetcher.data && fetcher.data.errors}
      </div>
    </>
  );

  function testSubm() {
    fetcher.submit(
      { text: postTextElmnt.current.innerHTML.trim() },
      { method: 'patch', action: `/edit/${postId}/` });
  }

  function cancelEdit() {
    postTextElmnt.current.innerHTML = postTextBeforeEdit;
    // postTextElmnt.current.style.width = '100%';  bug: if picture attached, it changes position
    postTextElmnt.current.style.height = '100%';
    setPostEditable(0);
  }

}
