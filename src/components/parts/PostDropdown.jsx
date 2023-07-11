import { Button } from './Button.jsx';
import { useFetcher } from 'react-router-dom';
import { usePostPermissions } from '../../hooks/usePostPermissions.jsx';
import { toggleFloatingForm } from '../../utils/utils.js';
import { useEffect } from 'react';
import i18n from '../../utils/translation.js';


export function PostDropdown({ post, onEditMenuClick, onDropdownClick, dispatch, closed }) {
  const fetcher = useFetcher();
  const { canEdit, canDelete, canClose } = usePostPermissions(post);

  useEffect(() => {
    if (fetcher.data?.created) {
      setTimeout(() => onDropdownClick(0), 200);
    }
  }, [fetcher.data?.created, onDropdownClick]);

  return (
    <div className='dropdown-menu'>
      <Button
        value={i18n.reply}
        clickHandler={() => toggleFloatingForm({ force: false, post, dispatch })}
        disabled={closed}
      />

      {canEdit &&
        <Button
          clickHandler={() => onEditMenuClick(post.id)}
          value={i18n.edit}
          extraStyle={{ display: 'block' }}
          disabled={closed}
        />
      }

      {canDelete &&
        <>
          <Button
            clickHandler={deletePost}
            value={i18n.delete}
            extraStyle={{ display: 'block' }}
            extraClass='fetcher-btn'
            submitting={fetcher.state !== 'idle'}
            disabled={closed}
          />
        </>
      }

      {canClose &&
        <Button
          value={closed ? i18n.open : i18n.close}
          clickHandler={closeThread}
          extraClass='fetcher-btn'
          submitting={fetcher.state !== 'idle'}
        />
      }
    </div>
  );

  function closeThread() {
    let url = `/${post.board}/thread/${post.id}`;
    fetcher.submit(
      { type: 'close' },
      { method: 'patch', action: url }
    );
  }

  function deletePost() {
    let url = `/${post.board}/thread/${post.id}`;

    fetcher.submit(
      null,
      { method: 'delete', action: url }
    );
  }
}
