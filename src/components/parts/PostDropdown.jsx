import { Button } from './Button.jsx';
import { useFetcher } from 'react-router-dom';
import { usePostPermissions } from '../../hooks/usePostPermissions.jsx';
import { toggleFloatingForm } from '../../utils/utils.js';
import { useEffect } from 'react';

export function PostDropdown({ post, onEditMenuClick, onDropdownClick, dispatch, closed }) {
  const fetcher = useFetcher();

  const { canEdit, canDelete, canBan, canClose } = usePostPermissions(post);

  useEffect(() => {
    if (fetcher.data?.created) {
      setTimeout(() => onDropdownClick(0), 200);
    }
  }, [fetcher.data?.created, onDropdownClick]);

  return (
    <div className='dropdown-menu'>
      <Button
        value='Reply'
        clickHandler={() => toggleFloatingForm({ force: false, post, dispatch })}
        disabled={closed}
      />

      {canEdit &&
        <Button
          clickHandler={() => onEditMenuClick(post.id)}
          value='Edit'
          extraStyle={{ display: 'block' }}
          disabled={closed}
        />
      }

      {canDelete &&
        <>
          <Button
            clickHandler={deletePost}
            value='Delete'
            extraStyle={{ display: 'block' }}
            extraClass='fetcher-btn'
            submitting={fetcher.state !== 'idle'}
            disabled={closed}
          />
          {canBan &&
            <Button extraStyle={{ transform: 'translate(100%, -100%)', display: 'none', position: 'absolute' }}
                    extraClass='ban-btn fetcher-btn'
                    value='& Ban'
                    clickHandler={(ev) => deletePost(ev, { promtForBan: true })}
                    disabled={closed}
            />
          }
        </>
      }

      {canClose &&
        <Button
          value={closed ? 'Open' : 'Close'}
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

  function deletePost(ev, options = undefined) {
    let url = `/${post.board}/thread/${post.id}`;

    if (canBan) {
      const toggled = toggleBanButtonOnFirstClick(ev);
      if (toggled) return;

      if (options?.promtForBan) {
        const duration = promptForBanDuration();
        if (duration) {
          url += `?ban=${duration}`;
        } else {
          return;
        }
      }
    }

    fetcher.submit(
      null,
      { method: 'delete', action: url }
    );
  }
}

function promptForBanDuration() {
  const duration = Number(window.prompt('Ban for (days; 1-30)', '1'));
  if (duration === 0) {
    return;
  }

  if (Number.isNaN(Number(duration)) || Number(duration) > 30) {
    return promptForBanDuration();
  }

  return duration;
}

function toggleBanButtonOnFirstClick(ev) {
  ev.preventDefault();
  const banBtn = document.querySelector('.ban-btn');
  if (banBtn.style.display === 'none') {
    banBtn.style.display = 'block';
    return true;
  }
}
