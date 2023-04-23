import { Button } from './Button.jsx';
import { useFetcher } from 'react-router-dom';
import { usePostHistoryContextList } from '../../context/PostHistoryContext.jsx';
import { ThreadListContext } from '../pages/ThreadList.jsx';
import { useContext, useEffect } from 'react';

export function PostDropdown({ postId, onEditMenuClick, postDateSecs }) {
  const fetcher = useFetcher();
  const postIdList = usePostHistoryContextList();
  const timeDiff = new Date().getTime() - postDateSecs * 1000;
  const allowed_interval = (timeDiff / 1000 / 60 / 60 / 24) <= 1;
  const deletePostCallback = useContext(ThreadListContext);

  useEffect(() => {
    if (deletePostCallback && fetcher.data?.deleted) {  // only from thread list page
      deletePostCallback(fetcher.data.post.id);
    }
  }, [fetcher.data?.deleted]);  // eslint-disable-line

  return (
    <div className='dropdown-menu'>
      <Button
        value={'Reply'}
      />
      {allowed_interval &&
        <>
          {postIdList.some(post => post.id === postId && post.ed) &&
            <Button
              clickHandler={() => onEditMenuClick(postId)}
              value='Edit'
              extraStyle={{display: 'block'}}
            />
          }

          {postIdList.some(post => post.id === postId && post.del) &&
            <Button
              clickHandler={deletePost}
              value={'Delete'}
              submitting={fetcher.data}
              extraStyle={{display: 'block'}}
              extraClass='del-btn'
            />
          }
        </>
      }
    </div>
  );

  function deletePost() {
    fetcher.submit(
      null,
      { method: 'delete', action: `/post/${postId}/` }
    );
  }
}
