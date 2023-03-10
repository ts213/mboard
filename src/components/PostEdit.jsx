import { useFetcher } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from './Button.jsx';

export function PostEdit({
                           postTextElmnt, postId,
                           onEditMenuClick,
                           // postTextBeforeEdit
                         }) {
  const fetcher = useFetcher();
  //
  // useEffect(() => {
  //   if (fetcher.state === 'idle' && fetcher.data?.edited) {
  //     setPostEditable(0);
  //   }
  // }, [fetcher, setPostEditable]);

  return (
    <>
      <blockquote>aaa</blockquote>
      <div className={'float-right'}>
        <Button type='button'
                value='Cancel'
                clickHandler={() => onEditMenuClick(0)}
                extraStyle='mr-4 '
        />
        <Button type='button'
                value='Update'
                clickHandler={testSubm}
                disabled={fetcher.state !== 'idle'}
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

  // function cancelEdit() {
  //   postTextElmnt.current.innerHTML = postTextBeforeEdit;
  //   // postTextElmnt.current.style.width = '100%';  bug: if picture attached, it changes position
  //   postTextElmnt.current.style.height = '100%';
  // }
}
